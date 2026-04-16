use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Memory {
    pub id: Option<String>,
    pub user_id: String,
    pub content: Option<String>,
    pub is_clip: Option<bool>,
    pub tags: Option<Vec<String>>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: DateTime<Utc>,
}
