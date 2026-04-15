use std::{collections::HashMap, sync::Arc};

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::{FromRow, Row, SqlitePool};
use tokio::sync::RwLock;

use crate::common::error::AppError;

#[derive(Debug, Clone, FromRow)]
pub struct Memory {
    pub memory_id: String,
    pub user_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[async_trait]
pub trait MemoriesRepositoryTrait: Send + Sync {
    async fn select_by_memory_id(
        &self,
        db: &SqlitePool,
        memory_id: &str,
        user_id: &str,
    ) -> Result<Memory, AppError>;
    async fn select_by_user_id(
        &self,
        db: &SqlitePool,
        user_id: &str,
    ) -> Result<Vec<Memory>, AppError>;
    async fn insert_memory(&self, db: &SqlitePool, memory: &Memory) -> Result<(), AppError>;
    async fn delete_by_memory_id(
        &self,
        db: &SqlitePool,
        memory_id: &str,
        user_id: &str,
    ) -> Result<(), AppError>;
}

pub type MemoriesRepository = Arc<dyn MemoriesRepositoryTrait + Send + Sync>;

pub struct InMemoryMemoriesRepository {
    pub memories_by_memory_id: RwLock<HashMap<String, Memory>>,
}

#[async_trait]
impl MemoriesRepositoryTrait for InMemoryMemoriesRepository {
    async fn select_by_memory_id(
        &self,
        _db: &SqlitePool,
        memory_id: &str,
        _user_id: &str,
    ) -> Result<Memory, AppError> {
        let map = self.memories_by_memory_id.read().await;

        let memory = map.get(memory_id);

        match memory {
            Some(memory) => Ok(memory.clone()),
            None => Err(AppError::Internal("memory not found".to_string())),
        }
    }

    async fn select_by_user_id(
        &self,
        _db: &SqlitePool,
        user_id: &str,
    ) -> Result<Vec<Memory>, AppError> {
        let map = self.memories_by_memory_id.read().await;

        let mut memories: Vec<Memory> = map
            .values()
            .filter(|m| m.user_id == user_id)
            .cloned()
            .collect();

        memories.sort_by(|a, b| b.created_at.cmp(&a.created_at));

        Ok(memories)
    }

    async fn insert_memory(&self, _db: &SqlitePool, memory: &Memory) -> Result<(), AppError> {
        {
            let mut map = self.memories_by_memory_id.write().await;
            map.insert(memory.memory_id.clone(), memory.clone());
        }

        Ok(())
    }

    async fn delete_by_memory_id(
        &self,
        _db: &SqlitePool,
        memory_id: &str,
        user_id: &str,
    ) -> Result<(), AppError> {
        let mut map = self.memories_by_memory_id.write().await;

        match map.get(memory_id) {
            Some(memory) if memory.user_id == user_id => {
                map.remove(memory_id);
                Ok(())
            }
            _ => Err(AppError::Internal("memory not found".to_string())),
        }
    }
}

pub struct InDatabaseMemoriesRepository;

#[async_trait]
impl MemoriesRepositoryTrait for InDatabaseMemoriesRepository {
    async fn select_by_memory_id(
        &self,
        db: &SqlitePool,
        memory_id: &str,
        user_id: &str,
    ) -> Result<Memory, AppError> {
        let row = sqlx::query(
            r#"
            SELECT
                memory_id,
                user_id,
                content,
                created_at,
                updated_at
            FROM memories
            WHERE memory_id = ? AND user_id = ?
            LIMIT 1
            "#,
        )
        .bind(memory_id)
        .bind(user_id)
        .fetch_optional(db)
        .await?;

        let Some(row) = row else {
            return Err(AppError::Internal("memory not found".to_string()));
        };

        let memory_id: String = row.get("memory_id");
        let user_id: String = row.get("user_id");
        let content: String = row.get("content");
        let created_at: DateTime<Utc> = row.get("created_at");
        let updated_at: DateTime<Utc> = row.get("updated_at");

        Ok(Memory {
            memory_id,
            user_id,
            content,
            created_at,
            updated_at,
        })
    }

    async fn select_by_user_id(
        &self,
        db: &SqlitePool,
        user_id: &str,
    ) -> Result<Vec<Memory>, AppError> {
        let memories = sqlx::query_as::<_, Memory>(
            r#"
            SELECT
                memory_id,
                user_id,
                content,
                created_at,
                updated_at
            FROM memories
            WHERE user_id = ?
            ORDER BY created_at DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(db)
        .await?;

        Ok(memories)
    }

    async fn insert_memory(&self, db: &SqlitePool, memory: &Memory) -> Result<(), AppError> {
        let result = sqlx::query(
            r#"
            INSERT INTO memories (
                memory_id,
                user_id,
                content,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?)
            "#,
        )
        .bind(&memory.memory_id)
        .bind(&memory.user_id)
        .bind(&memory.content)
        .bind(&memory.created_at)
        .bind(&memory.updated_at)
        .execute(db)
        .await;

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(AppError::Database(e)),
        }
    }

    async fn delete_by_memory_id(
        &self,
        db: &SqlitePool,
        memory_id: &str,
        user_id: &str,
    ) -> Result<(), AppError> {
        let result = sqlx::query(
            r#"
            DELETE FROM memories
            WHERE memory_id = ? AND user_id = ?
            "#,
        )
        .bind(memory_id)
        .bind(user_id)
        .execute(db)
        .await
        .map_err(AppError::Database)?;

        if result.rows_affected() == 0 {
            return Err(AppError::Internal("memory not found".to_string()));
        }

        Ok(())
    }
}
