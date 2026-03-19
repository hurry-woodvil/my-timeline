use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};
use sqlx::SqlitePool;
use time::Duration;
use uuid::Uuid;

use crate::modules::users::{
    dto::{LoginUserRequest, RegisterUserRequest},
    model::{Claims, User},
    repository,
};
use crate::{common::error::AppError, modules::users::dto::NewRefreshToken};

pub async fn register_user(
    db: &SqlitePool,
    payload: RegisterUserRequest,
) -> Result<User, AppError> {
    validate_register_user_request(&payload)?;

    let password_hash = hash_password(&payload.password)?;

    let user = User {
        id: Uuid::new_v4(),
        email: payload.email,
        password_hash,
    };

    repository::create_user(db, &user).await?;

    Ok(user)
}

pub async fn login_user(db: &SqlitePool, payload: LoginUserRequest) -> Result<User, AppError> {
    validate_login_user_request(&payload)?;

    let user = repository::find_user_by_email(db, &payload.email)
        .await?
        .ok_or_else(|| AppError::Unauthorized("invalid email or password".to_string()))?;

    verify_password(&payload.password, &user.password_hash)?;

    Ok(user)
}

pub async fn get_me(db: &SqlitePool, claims: &Claims) -> Result<User, AppError> {
    let user = repository::find_user_by_id(db, &claims.sub)
        .await?
        .ok_or_else(|| AppError::Unauthorized("user not found".to_string()))?;

    Ok(user)
}

fn validate_register_user_request(payload: &RegisterUserRequest) -> Result<(), AppError> {
    if payload.email.trim().is_empty() {
        return Err(AppError::Validation("email is required".to_string()));
    }

    if payload.password.len() < 8 {
        return Err(AppError::Validation(
            "password must be at least 8 characters".to_string(),
        ));
    }

    Ok(())
}

fn validate_login_user_request(payload: &LoginUserRequest) -> Result<(), AppError> {
    if payload.email.trim().is_empty() {
        return Err(AppError::Validation("email is required".to_string()));
    }

    if payload.password.is_empty() {
        return Err(AppError::Validation("password is required".to_string()));
    }

    Ok(())
}

fn hash_password(password: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);

    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hashed| hashed.to_string())
        .map_err(|_| AppError::Internal("failed to hash password".to_string()))
}

fn verify_password(password: &str, password_hash: &str) -> Result<(), AppError> {
    let parsed_hash = PasswordHash::new(password_hash).map_err(|_| {
        AppError::Unauthorized(
            "invalid
            email or password"
                .to_string(),
        )
    })?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::Unauthorized("invalid email or password".to_string()))
}

pub async fn save_refresh_token(
    db: &SqlitePool,
    jar: CookieJar,
    refresh_token: &NewRefreshToken,
) -> Result<CookieJar, AppError> {
    repository::insert_refresh_token(db, refresh_token).await?;

    let cookie = Cookie::build(("refresh_token", refresh_token.raw_token.to_string()))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(Duration::days(7))
        .build();

    Ok(jar.add(cookie))
}
