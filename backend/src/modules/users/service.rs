use sqlx::SqlitePool;

use crate::common::{
    error::AppError,
    repository::user::{User, UsersRepository},
};

pub async fn get_me(db: &SqlitePool, users: &UsersRepository, sub: &str) -> Result<User, AppError> {
    let user = users
        .select_user_by_id(db, sub)
        .await?
        .ok_or_else(|| AppError::Unauthorized("user not found".to_string()))?;

    Ok(user)
}
