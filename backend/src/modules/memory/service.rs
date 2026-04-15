use chrono::Utc;
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::{
    common::{
        error::AppError,
        repository::memories::{MemoriesRepository, Memory},
    },
    extractors::current_user::CurrentUser,
    modules::memory::dto::{PostMemoryRequest, UpdateMemoryRequest},
};

pub async fn fetch_memory(
    db: &SqlitePool,
    user: &CurrentUser,
    memories: &MemoriesRepository,
    memory_id: &str,
) -> Result<Memory, AppError> {
    memories.select_by_memory_id(&db, memory_id, &user.id).await
}

pub async fn post_memory(
    db: &SqlitePool,
    user: &CurrentUser,
    memories: &MemoriesRepository,
    payload: PostMemoryRequest,
) -> Result<Memory, AppError> {
    let memory_id = Uuid::new_v4().to_string();
    let user_id = user.id.clone();
    let content = payload.content.clone();
    let now = Utc::now();
    let created_at = now;
    let updated_at = now;

    let memory = Memory {
        memory_id,
        user_id,
        content,
        created_at,
        updated_at,
    };

    memories.insert_memory(&db, &memory).await?;

    Ok(memory)
}

pub async fn update_memory(
    db: &SqlitePool,
    user: &CurrentUser,
    memories: &MemoriesRepository,
    memory: &UpdateMemoryRequest,
    memory_id: &str,
) -> Result<(), AppError> {
    memories
        .update_memory(&db, memory, memory_id, &user.id)
        .await?;

    Ok(())
}

pub async fn delete_memory(
    db: &SqlitePool,
    user: &CurrentUser,
    memories: &MemoriesRepository,
    memory_id: &str,
) -> Result<(), AppError> {
    memories
        .delete_by_memory_id(&db, memory_id, &user.id)
        .await?;

    Ok(())
}
