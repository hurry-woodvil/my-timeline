use std::{collections::HashMap, sync::Arc};

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use sqlx::{FromRow, Row, SqlitePool};
use tokio::sync::RwLock;

use crate::common::error::AppError;

#[derive(Debug, Clone, FromRow)]
pub struct Record {
    pub id: String,
    pub user_id: String,
    pub content: Option<String>,
    pub is_clip: Option<bool>,
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
    ) -> Result<Record, AppError>;
    async fn select_by_user_id(
        &self,
        db: &SqlitePool,
        user_id: &str,
    ) -> Result<Vec<Record>, AppError>;
    async fn insert_memory(&self, db: &SqlitePool, memory: &Record) -> Result<(), AppError>;
    async fn update_memory(&self, db: &SqlitePool, memory: &Record) -> Result<(), AppError>;
    async fn delete_by_memory_id(
        &self,
        db: &SqlitePool,
        memory_id: &str,
        user_id: &str,
    ) -> Result<(), AppError>;
}

pub type MemoriesRepository = Arc<dyn MemoriesRepositoryTrait + Send + Sync>;

pub struct InMemoryMemoriesRepository {
    pub memories_by_memory_id: RwLock<HashMap<String, Record>>,
}

#[async_trait]
impl MemoriesRepositoryTrait for InMemoryMemoriesRepository {
    async fn select_by_memory_id(
        &self,
        _db: &SqlitePool,
        memory_id: &str,
        _user_id: &str,
    ) -> Result<Record, AppError> {
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
    ) -> Result<Vec<Record>, AppError> {
        let map = self.memories_by_memory_id.read().await;

        let mut memories: Vec<Record> = map
            .values()
            .filter(|m| m.user_id == user_id)
            .cloned()
            .collect();

        memories.sort_by(|a, b| b.created_at.cmp(&a.created_at));

        Ok(memories)
    }

    async fn insert_memory(&self, _db: &SqlitePool, memory: &Record) -> Result<(), AppError> {
        let mut map = self.memories_by_memory_id.write().await;
        map.insert(memory.id.clone(), memory.clone()).unwrap();

        Ok(())
    }

    async fn update_memory(&self, _db: &SqlitePool, memory: &Record) -> Result<(), AppError> {
        if memory.content.is_none() {
            return Err(AppError::Internal("No filed to update.".into()));
        }

        let mut memories = self.memories_by_memory_id.write().await;

        let target = memories
            .get_mut(&memory.id)
            .ok_or_else(|| AppError::Internal("Memory not found.".into()))?;

        if target.user_id != memory.user_id {
            return Err(AppError::Internal("Memory not found.".into()));
        }

        if let Some(con) = &memory.content {
            let trimmed = con.trim();

            target.content = Some(trimmed.to_string());
        }

        target.updated_at = memory.updated_at;

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
    ) -> Result<Record, AppError> {
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

        let id: String = row.get("id");
        let user_id: String = row.get("user_id");
        let content: Option<String> = Some(row.get("content"));
        let is_clip: Option<bool> = Some(row.get("is_clip"));
        let created_at: DateTime<Utc> = row.get("created_at");
        let updated_at: DateTime<Utc> = row.get("updated_at");

        Ok(Record {
            id,
            user_id,
            content,
            is_clip,
            created_at,
            updated_at,
        })
    }

    async fn select_by_user_id(
        &self,
        db: &SqlitePool,
        user_id: &str,
    ) -> Result<Vec<Record>, AppError> {
        let memories = sqlx::query_as::<_, Record>(
            r#"
            SELECT
                id,
                user_id,
                content,
                is_clip,
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

    async fn insert_memory(&self, db: &SqlitePool, memory: &Record) -> Result<(), AppError> {
        let result = sqlx::query(
            r#"
            INSERT INTO memories (
                memory_id,
                user_id,
                content,
                is_clip,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&memory.id)
        .bind(&memory.user_id)
        .bind(&memory.content)
        .bind(&memory.is_clip)
        .bind(&memory.created_at)
        .bind(&memory.updated_at)
        .execute(db)
        .await;

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(AppError::Database(e)),
        }
    }

    async fn update_memory(&self, db: &SqlitePool, memory: &Record) -> Result<(), AppError> {
        if memory.content.is_none() {
            return Err(AppError::Internal("No fields to update.".into()));
        }

        let mut sets = Vec::new();

        if memory.content.is_some() {
            sets.push("content = ?");
        }

        if memory.is_clip.is_some() {
            sets.push("is_clip = ?")
        }

        sets.push("updated_at = ?");

        let sql = format!(
            "UPDATE memories SET {} WHERE id = ? AND user_id = ?",
            sets.join(", ")
        );

        let mut query = sqlx::query(&sql);

        if let Some(content) = &memory.content {
            query = query.bind(content);
        }

        if let Some(is_clip) = &memory.is_clip {
            query = query.bind(is_clip);
        }

        query = query
            .bind(&memory.updated_at)
            .bind(&memory.id)
            .bind(&memory.user_id);

        query.execute(db).await?;

        Ok(())
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
