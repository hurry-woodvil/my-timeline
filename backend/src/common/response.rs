use axum::{Json, http::StatusCode};
use axum_extra::extract::CookieJar;
use serde::Serialize;

use crate::common::error::AppError;

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub data: Option<T>,
}

// #[derive(Debug, Serialize)]
// pub struct MessageResponse {
//     pub message: String,
// }

pub type ApiResult<T> = Result<(StatusCode, Json<ApiResponse<T>>), AppError>;
pub type ApiCookieResult<T> = Result<(StatusCode, CookieJar, Json<ApiResponse<T>>), AppError>;

pub fn ok<T: Serialize>(msg: &str, data: T) -> Json<ApiResponse<T>> {
    Json(ApiResponse {
        success: true,
        message: msg.to_string(),
        data: Some(data),
    })
}

// pub fn message(msg: &str) -> Json<ApiResponse<MessageResponse>> {
//     Json(ApiResponse {
//         success: true,
//         message: msg.to_string(),
//         data: None,
//     })
// }
