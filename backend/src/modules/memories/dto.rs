use chrono::{DateTime, Utc};

pub struct MemoriesRequest;

#[derive(Debug)]
pub struct MemoriesResponse {
    pub items: Vec<Memory>,
}

#[derive(Debug, Clone)]
struct Memory {
    pub memory_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
}
