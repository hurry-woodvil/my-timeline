use std::collections::HashMap;

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

trait RefreshTokensRepositoryTrait {
    async fn select_refresh_token_by_hash(
        &self,
        db: &SqlitePool,
        token_hash: &str,
    ) -> Result<Option<RefreshToken>, AppError>;
    async fn insert_refresh_token(
        &mut self,
        db: &SqlitePool,
        refresh_token: &RefreshToken,
    ) -> Result<(), AppError>;
    async fn delete_by_hash(&mut self, db: &SqlitePool, token_hash: &str) -> Result<(), AppError>;
}

pub struct InMemoryRefreshTokensRepository {
    pub refresh_tokens_by_hash: HashMap<String, RefreshToken>,
}

impl RefreshTokensRepositoryTrait for InMemoryRefreshTokensRepository {
    async fn select_refresh_token_by_hash(
        &self,
        _db: &SqlitePool,
        token_hash: &str,
    ) -> Result<Option<RefreshToken>, AppError> {
        Ok(self.refresh_tokens_by_hash.get(token_hash).cloned())
    }

    async fn insert_refresh_token(
        &mut self,
        _db: &SqlitePool,
        refresh_token: &RefreshToken,
    ) -> Result<(), AppError> {
        self.refresh_tokens_by_hash
            .insert(refresh_token.token_hash.clone(), refresh_token.clone());

        Ok(())
    }

    async fn delete_by_hash(&mut self, _db: &SqlitePool, token_hash: &str) -> Result<(), AppError> {
        self.refresh_tokens_by_hash.remove(token_hash);

        Ok(())
    }
}

pub struct InDataBaseRefreshTokensRepository;

impl RefreshTokensRepositoryTrait for InDataBaseRefreshTokensRepository {
    async fn select_refresh_token_by_hash(
        &self,
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

    async fn insert_refresh_token(
        &mut self,
        db: &SqlitePool,
        token: &RefreshToken,
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
        .execute(db)
        .await;

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(AppError::Database(e)),
        }
    }

    async fn delete_by_hash(&mut self, db: &SqlitePool, token_hash: &str) -> Result<(), AppError> {
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
}
