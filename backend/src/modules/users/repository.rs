use sqlx::{Row, SqlitePool};
use uuid::Uuid;

use crate::common::error::AppError;
use crate::modules::users::dto::NewRefreshToken;
use crate::modules::users::model::User;

pub async fn create_user(db: &SqlitePool, user: &User) -> Result<(), AppError> {
    let result = sqlx::query(
        r#"
        INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)
        "#,
    )
    .bind(user.id.to_string())
    .bind(&user.email)
    .bind(&user.password_hash)
    .execute(db)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(sqlx::Error::Database(db_err)) => {
            if db_err.is_unique_violation() {
                return Err(AppError::Conflict("email already exists".to_string()));
            }
            Err(AppError::Database(sqlx::Error::Database(db_err)))
        }
        Err(e) => Err(AppError::Database(e)),
    }
}

pub async fn find_user_by_email(db: &SqlitePool, email: &str) -> Result<Option<User>, AppError> {
    let row = sqlx::query(
        r#"
        SELECT id, email, password_hash
        FROM users
        WHERE email = ?
        LIMIT 1
        "#,
    )
    .bind(email)
    .fetch_optional(db)
    .await?;

    let Some(row) = row else { return Ok(None) };

    let id_str: String = row.get("id");
    let email: String = row.get("email");
    let password_hash: String = row.get("password_hash");

    let id = Uuid::parse_str(&id_str).map_err(|_| {
        AppError::Internal(
            "invalid user
            id"
            .to_string(),
        )
    })?;

    Ok(Some(User {
        id,
        email,
        password_hash,
    }))
}

pub async fn find_user_by_id(db: &SqlitePool, user_id: &str) -> Result<Option<User>, AppError> {
    let row = sqlx::query(
        r#"
        SELECT id, email, password_hash
        FROM users
        WHERE id = ?
        LIMIT 1
        "#,
    )
    .bind(user_id)
    .fetch_optional(db)
    .await?;

    let Some(row) = row else { return Ok(None) };

    let id_str: String = row.get("id");
    let email: String = row.get("email");
    let password_hash: String = row.get("password_hash");

    let id = Uuid::parse_str(&id_str).map_err(|_| {
        AppError::Internal(
            "invalid user
            id"
            .to_string(),
        )
    })?;

    Ok(Some(User {
        id,
        email,
        password_hash,
    }))
}

pub async fn insert_refresh_token(
    pool: &SqlitePool,
    token: &NewRefreshToken,
) -> Result<(), AppError> {
    let result = sqlx::query(
        r#"
        INSERT INTO refresh_tokens (
            id,
            user_id,
            token_hash,
            expires_at,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
        "#,
    )
    .bind(&token.id)
    .bind(&token.user_id)
    .bind(&token.token_hash)
    .bind(token.expires_at)
    .bind(token.created_at)
    .execute(pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            println!("DB ERROR: {:?}", e);
            Err(AppError::from(e))
        }
    }
}
