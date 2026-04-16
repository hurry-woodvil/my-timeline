use sqlx::SqlitePool;

use crate::{
    common::{
        error::AppError,
        repository::memories::{MemoriesRepository, Record},
    },
    modules::memories::model::Memory,
};

pub async fn fetch_memories(
    db: &SqlitePool,
    memories: &MemoriesRepository,
    user_id: &str,
) -> Result<Vec<Memory>, AppError> {
    let result = memories.select_by_user_id(db, user_id).await?;

    let memories: Vec<Memory> = result
        .iter()
        .map(|r| Memory {
            id: Some(r.id.clone()),
            user_id: r.user_id.clone(),
            content: r.content.clone(),
            is_clip: r.is_clip,
            tags: None,
            created_at: Some(r.created_at),
            updated_at: r.updated_at,
        })
        .collect();

    Ok(memories)
}

pub async fn fetch_memory(
    db: &SqlitePool,
    memories: &MemoriesRepository,
    memory_id: &str,
    user_id: &str,
) -> Result<Memory, AppError> {
    let result = memories.select_by_memory_id(db, memory_id, user_id).await?;

    let memory = Memory {
        id: Some(result.id.clone()),
        user_id: result.user_id.clone(),
        content: result.content.clone(),
        is_clip: result.is_clip,
        tags: None,
        created_at: Some(result.created_at),
        updated_at: result.updated_at,
    };

    Ok(memory)
}

pub async fn create_memory(
    db: &SqlitePool,
    memories: &MemoriesRepository,
    memory: &Memory,
) -> Result<Memory, AppError> {
    let id = uuid::Uuid::new_v4().to_string();
    let user_id = memory.user_id.clone();
    let content = memory.content.clone();
    let is_clip = memory.is_clip;
    let created_at = memory.created_at.unwrap();
    let updated_at = memory.updated_at;

    let record = Record {
        id,
        user_id,
        content,
        is_clip,
        created_at,
        updated_at,
    };

    memories.insert_memory(db, &record).await?;

    let result = memories
        .select_by_memory_id(db, &record.id, &record.user_id)
        .await?;

    let memory = Memory {
        id: Some(result.id.clone()),
        user_id: result.user_id.clone(),
        content: result.content.clone(),
        is_clip: result.is_clip,
        tags: None,
        created_at: Some(result.created_at),
        updated_at: result.updated_at,
    };

    Ok(memory)
}

pub async fn update_memory(
    db: &SqlitePool,
    memories: &MemoriesRepository,
    memory: &Memory,
) -> Result<Memory, AppError> {
    let id = memory.id.clone().unwrap();
    let user_id = memory.user_id.clone();
    let content = memory.content.clone();
    let is_clip = memory.is_clip;
    let created_at = memory.created_at.unwrap();
    let updated_at = memory.updated_at;

    let record = Record {
        id,
        user_id,
        content,
        is_clip,
        created_at,
        updated_at,
    };

    memories.update_memory(db, &record).await?;

    let result = memories
        .select_by_memory_id(db, &record.id, &record.user_id)
        .await?;

    let memory = Memory {
        id: Some(result.id.clone()),
        user_id: result.user_id.clone(),
        content: result.content.clone(),
        is_clip: result.is_clip,
        tags: None,
        created_at: Some(result.created_at),
        updated_at: result.updated_at,
    };

    Ok(memory)
}

pub async fn delete_memory(
    db: &SqlitePool,
    memories: &MemoriesRepository,
    memory_id: &str,
    user_id: &str,
) -> Result<String, AppError> {
    memories.delete_by_memory_id(db, memory_id, user_id).await?;

    Ok(memory_id.to_string())
}
