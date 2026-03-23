use sqlx::SqlitePool;

use crate::common::{
    auth::{model::Claims, service::token},
    error::AppError,
};

#[derive(Clone)]
pub struct AppState {
    pub db: SqlitePool,
    pub auth_service: AuthService,
}

#[derive(Clone)]
pub struct AuthService {
    pub jwt_secret: String,
}

impl AuthService {
    pub fn verify_access_token(&self, access_token: &str) -> Result<Claims, AppError> {
        let claims = token::verify_access_token(access_token, &self.jwt_secret)?;

        Ok(claims)
    }
}
