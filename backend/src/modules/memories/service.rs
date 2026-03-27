use sqlx::SqlitePool;

use crate::common::{
    error::AppError,
    repository::memories::{MemoriesRepository, Memory},
};

pub async fn memories(
    db: &SqlitePool,
    memories: &MemoriesRepository,
    user_id: &str,
) -> Result<Vec<Memory>, AppError> {
    let memories = memories.select_by_user_id(db, user_id).await?;

    Ok(memories)
}
