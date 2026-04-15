use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct GetMemoryResponse {
    pub memory_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct PostMemoryRequest {
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateMemoryRequest {
    pub content: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct PostMemoryResponse {
    pub memory_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
}
