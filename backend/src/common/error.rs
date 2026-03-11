use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Error)]
pub enum AppError {
    #[error("validation error: {0}")]
    Validation(String),

    #[error("conflict error: {0}")]
    Conflict(String),

    #[error("unauthorized error: {0}")]
    Unauthorized(String),

    #[error("database error")]
    Database(#[from] sqlx::Error),

    #[error("internal error: {0}")]
    Internal(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, msg),
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::Database(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "database error".to_string(),
            ),
            AppError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        (
            status,
            Json(ErrorResponse {
                success: false,
                message,
            }),
        )
            .into_response()
    }
}
