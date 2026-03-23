use sqlx::{Row, SqlitePool};

use crate::common::error::AppError;

#[derive(Debug, Clone)]
pub struct RefreshToken {
    pub id: String,
    pub user_id: String,
    pub token_hash: String,
    pub expires_at: i64,
    pub created_at: i64,
}

pub async fn select_refresh_token_by_hash(
    db: &SqlitePool,
    token_hash: &str,
) -> Result<Option<RefreshToken>, AppError> {
    let row = sqlx::query(
        r#"
        SELECT id, user_id, token_hash, expires_at, created_at
        FROM refresh_tokens
        WHERE token_hash = ?
        LIMIT 1
        "#,
    )
    .bind(token_hash)
    .fetch_optional(db)
    .await?;

    let Some(row) = row else { return Ok(None) };

    let id = row.get("id");
    let user_id = row.get("user_id");
    let token_hash = row.get("token_hash");
    let expires_at: i64 = row.get("expires_at");
    let created_at: i64 = row.get("expires_at");

    Ok(Some(RefreshToken {
        id,
        user_id,
        token_hash,
        expires_at,
        created_at,
    }))
}

pub async fn insert_refresh_token(db: &SqlitePool, token: &RefreshToken) -> Result<(), AppError> {
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
    .execute(db)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(AppError::Database(e)),
    }
}

pub async fn delete_by_hash(db: &SqlitePool, token_hash: &str) -> Result<(), AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM refresh_tokens
        WHERE token_hash = ?
        "#,
    )
    .bind(token_hash)
    .execute(db)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(AppError::Database(e)),
    }
}
