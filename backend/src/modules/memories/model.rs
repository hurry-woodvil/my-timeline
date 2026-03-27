use chrono::{DateTime, Utc};

#[derive(Debug, Clone)]
struct Memory {
    pub memory_id: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
}
