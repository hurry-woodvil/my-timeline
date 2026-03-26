use std::collections::HashMap;

use chrono::{DateTime, Utc};
use sqlx::{Row, SqlitePool};

use crate::common::error::AppError;

#[derive(Debug, Clone)]
pub struct User {
    pub user_id: String,
    pub user_name: String,
    pub user_email: String,
    pub password_hash: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

trait UserRepositoryTrait {
    async fn select_user_by_id(&self, db: &SqlitePool, id: &str) -> Result<Option<User>, AppError>;
    async fn select_user_by_name(
        &self,
        db: &SqlitePool,
        name: &str,
    ) -> Result<Option<User>, AppError>;
    async fn select_user_by_email(
        &self,
        db: &SqlitePool,
        email: &str,
    ) -> Result<Option<User>, AppError>;
    async fn insert_user(&mut self, db: &SqlitePool, user: &User) -> Result<(), AppError>;
}

pub struct InMemoryUserRepository {
    pub users_by_id: HashMap<String, User>,
    pub users_by_name: HashMap<String, User>,
    pub users_by_email: HashMap<String, User>,
}

impl UserRepositoryTrait for InMemoryUserRepository {
    async fn select_user_by_id(
        &self,
        _db: &SqlitePool,
        id: &str,
    ) -> Result<Option<User>, AppError> {
        Ok(self.users_by_id.get(id).cloned())
    }

    async fn select_user_by_name(
        &self,
        _db: &SqlitePool,
        name: &str,
    ) -> Result<Option<User>, AppError> {
        Ok(self.users_by_name.get(name).cloned())
    }

    async fn select_user_by_email(
        &self,
        _db: &SqlitePool,
        email: &str,
    ) -> Result<Option<User>, AppError> {
        Ok(self.users_by_email.get(email).cloned())
    }

    async fn insert_user(&mut self, _db: &SqlitePool, user: &User) -> Result<(), AppError> {
        self.users_by_id.insert(user.user_id.clone(), user.clone());
        self.users_by_name
            .insert(user.user_name.clone(), user.clone());
        self.users_by_email
            .insert(user.user_email.clone(), user.clone());

        Ok(())
    }
}

pub struct InDatabaseUserRepository;

impl UserRepositoryTrait for InDatabaseUserRepository {
    async fn select_user_by_id(&self, db: &SqlitePool, id: &str) -> Result<Option<User>, AppError> {
        let row = sqlx::query(
            r#"
        SELECT
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE user_id = ?
        LIMIT 1
        "#,
        )
        .bind(id)
        .fetch_optional(db)
        .await?;

        let Some(row) = row else { return Ok(None) };

        let user_id: String = row.get("id");
        let user_name: String = row.get("user_name");
        let user_email: String = row.get("email");
        let password_hash = row.get("password_hash");
        let is_active: bool = row.get("is_active");
        let created_at: DateTime<Utc> = row.get("created_at");
        let updated_at: DateTime<Utc> = row.get("updated_at");

        Ok(Some(User {
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at,
        }))
    }

    async fn select_user_by_name(
        &self,
        db: &SqlitePool,
        name: &str,
    ) -> Result<Option<User>, AppError> {
        let row = sqlx::query(
            r#"
        SELECT
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE user_name = ?
        LIMIT 1
        "#,
        )
        .bind(name)
        .fetch_optional(db)
        .await?;

        let Some(row) = row else { return Ok(None) };

        let user_id: String = row.get("id");
        let user_name: String = row.get("user_name");
        let user_email: String = row.get("email");
        let password_hash = row.get("password_hash");
        let is_active: bool = row.get("is_active");
        let created_at: DateTime<Utc> = row.get("created_at");
        let updated_at: DateTime<Utc> = row.get("updated_at");

        Ok(Some(User {
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at,
        }))
    }

    async fn select_user_by_email(
        &self,
        db: &SqlitePool,
        email: &str,
    ) -> Result<Option<User>, AppError> {
        let row = sqlx::query(
            r#"
        SELECT
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at
        FROM users
        WHERE user_name = ?
        LIMIT 1
        "#,
        )
        .bind(email)
        .fetch_optional(db)
        .await?;

        let Some(row) = row else { return Ok(None) };

        let user_id: String = row.get("id");
        let user_name: String = row.get("user_name");
        let user_email: String = row.get("email");
        let password_hash = row.get("password_hash");
        let is_active: bool = row.get("is_active");
        let created_at: DateTime<Utc> = row.get("created_at");
        let updated_at: DateTime<Utc> = row.get("updated_at");

        Ok(Some(User {
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at,
        }))
    }

    async fn insert_user(&mut self, db: &SqlitePool, user: &User) -> Result<(), AppError> {
        let result = sqlx::query(
            r#"
        INSERT INTO users (
            user_id,
            user_name,
            user_email,
            password_hash,
            is_active,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        "#,
        )
        .bind(&user.user_id)
        .bind(&user.user_name)
        .bind(&user.user_email)
        .bind(&user.password_hash)
        .bind(user.is_active)
        .bind(&user.created_at)
        .bind(&user.updated_at)
        .execute(db)
        .await;

        match result {
            Ok(_) => Ok(()),
            Err(sqlx::Error::Database(db_err)) => {
                if db_err.is_unique_violation() {
                    return Err(AppError::Conflict("email already exists".to_string()));
                }
                Err(AppError::Database(sqlx::Error::Database(db_err)))
            }
            Err(e) => Err(AppError::Database(e)),
        }
    }
}
