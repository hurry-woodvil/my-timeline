use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct RegisterUserRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct RegisterUserResponse {
    pub token: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginUserRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginUserResponse {
    pub token: String,
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
