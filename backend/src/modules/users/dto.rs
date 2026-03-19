use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct RegisterUserRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct RegisterUserResponse {
    pub access_token: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginUserRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginUserResponse {
    pub access_token: String,
}

#[derive(Debug, Clone)]
pub struct NewRefreshToken {
    pub id: String,
    pub raw_token: String,
    pub token_hash: String,
    pub user_id: String,
    pub expires_at: i64,
    pub created_at: i64,
}

#[derive(Debug, Serialize)]
pub struct MeResponse {
    pub user: UserResponse,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
}
