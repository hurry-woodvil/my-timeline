use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Memory {
    pub memory_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
}
