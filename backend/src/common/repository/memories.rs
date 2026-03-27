use std::{collections::HashMap, sync::Arc};

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
use tokio::sync::RwLock;

use crate::common::error::AppError;

#[derive(Debug, Clone)]
pub struct Memory {
    pub memory_id: String,
    pub user_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[async_trait]
pub trait MemoriesRepositoryTrait: Send + Sync {
    async fn insert_memory(&self, db: &SqlitePool, memory: &Memory) -> Result<(), AppError>;
}

pub type MemoriesRepository = Arc<dyn MemoriesRepositoryTrait + Send + Sync>;

pub struct InMemoryMemoriesRepository {
    pub memories_by_memory_id: RwLock<HashMap<String, Memory>>,
    pub memories_by_user_id: RwLock<HashMap<String, Memory>>,
}

#[async_trait]
impl MemoriesRepositoryTrait for InMemoryMemoriesRepository {
    async fn insert_memory(&self, _db: &SqlitePool, memory: &Memory) -> Result<(), AppError> {
        {
            let mut map = self.memories_by_memory_id.write().await;
            map.insert(memory.memory_id.clone(), memory.clone());
        }

        {
            let mut map = self.memories_by_user_id.write().await;
            map.insert(memory.user_id.clone(), memory.clone());
        }

        Ok(())
    }
}

pub struct InDatabaseMemoriesRepository;

#[async_trait]
impl MemoriesRepositoryTrait for InDatabaseMemoriesRepository {
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
}
