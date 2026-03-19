use sqlx::SqlitePool;

use crate::common::error::AppError;

#[derive(Debug, Clone)]
pub struct RefreshToken {
    pub id: String,
    pub user_id: String,
    pub token_hash: String,
    pub expires_at: i64,
    pub created_at: i64,
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
        WHRER token_hash = ?
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
