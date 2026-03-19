use sqlx::SqlitePool;

use crate::common::{
    error::AppError,
    repository::user::{User, select_user_by_id},
};

pub async fn get_me(db: &SqlitePool, sub: &str) -> Result<User, AppError> {
    let user = select_user_by_id(db, sub)
        .await?
        .ok_or_else(|| AppError::Unauthorized("user not found".to_string()))?;

    Ok(user)
}
