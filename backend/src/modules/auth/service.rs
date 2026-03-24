use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
};
use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};
use rand_core::OsRng;
use sqlx::SqlitePool;
use time::Duration;
use uuid::Uuid;

use crate::{
    common::{
        error::AppError,
        repository::{
            refresh_tokens::{RefreshToken, delete_by_hash, insert_refresh_token},
            user::{User, insert_user, select_user_by_email},
        },
    },
    modules::auth::{
        dto::{SigninRequest, SignupRequest},
        model::NewRefreshToken,
    },
};

pub async fn signin(db: &SqlitePool, payload: SigninRequest) -> Result<User, AppError> {
    let user = select_user_by_email(db, &payload.email)
        .await?
        .ok_or_else(|| AppError::Unauthorized("invalid email or password".to_string()))?;

    verify_password(&payload.password, &user.password_hash)?;

    Ok(user)
}

fn verify_password(password: &str, password_hash: &str) -> Result<(), AppError> {
    let parsed_hash = PasswordHash::new(password_hash)
        .map_err(|_| AppError::Unauthorized("invalid email or password".to_string()))?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::Unauthorized("invalid email or password".to_string()))
}

pub async fn signup(db: &SqlitePool, payload: SignupRequest) -> Result<User, AppError> {
    let password_hash = hash_password(&payload.password)?;

    let user = User {
        id: Uuid::new_v4(),
        email: payload.email,
        password_hash,
    };

    insert_user(db, &user).await?;

    Ok(user)
}

fn hash_password(password: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut OsRng);

    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hashed| hashed.to_string())
        .map_err(|_| AppError::Internal("failed to hash password".to_string()))
}

pub async fn save_refresh_token(
    db: &SqlitePool,
    jar: CookieJar,
    new_refresh_token: NewRefreshToken,
) -> Result<CookieJar, AppError> {
    let refresh_token = RefreshToken {
        id: new_refresh_token.id,
        user_id: new_refresh_token.user_id,
        token_hash: new_refresh_token.token_hash,
        expires_at: new_refresh_token.expires_at,
        created_at: new_refresh_token.created_at,
    };
    insert_refresh_token(db, &refresh_token).await?;

    let cookie = Cookie::build(("refresh_token", new_refresh_token.raw_token.to_string()))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(Duration::days(7))
        .build();

    Ok(jar.add(cookie))
}

pub async fn signout(db: &SqlitePool, refresh_token_hash: &str) -> Result<(), AppError> {
    delete_by_hash(db, refresh_token_hash).await
}
