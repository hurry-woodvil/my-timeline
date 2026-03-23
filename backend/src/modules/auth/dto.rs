use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct SigninRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct SigninResponse {
    pub access_token: String,
}

#[derive(Debug, Deserialize)]
pub struct SignupRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct SignupResponse {
    pub access_token: String,
}

#[derive(Debug, Serialize)]
pub struct SignoutResponse {}

#[derive(Debug, Serialize)]
pub struct RefreshResponse {
    pub access_token: String,
}
