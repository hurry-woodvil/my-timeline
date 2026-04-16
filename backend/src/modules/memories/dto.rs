use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::modules::memories::model::Memory;

// GET /memories
#[derive(Debug, Deserialize)]
pub struct GetMemoriesRequestPayload {}

#[derive(Debug, Serialize)]
pub struct GetMemoriesResponseBodyData {
    pub items: Vec<Memory>,
}

// GET /memories/{id}
#[derive(Debug, Deserialize)]
pub struct GetMemoryRequestPayload {}

#[derive(Debug, Serialize)]
pub struct GetMemoryResponseBodyData {
    pub id: String,
    pub content: String,
    pub is_clip: bool,
    pub tags: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// POST /memories
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostMemoryRequestPayload {
    pub content: String,
    pub is_clip: bool,
    pub tags: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct PostMemoryResponseBodyData {
    pub id: String,
    pub content: String,
    pub is_clip: bool,
    pub tags: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// DELETE /memories/{id}
#[derive(Debug, Deserialize)]
pub struct DeleteMemoryRequestPayload {}

#[derive(Debug, Serialize)]
pub struct DeleteMemoryResponseBodyData {
    pub id: String,
}

// PATCH /memories/{id}
#[derive(Debug, Deserialize)]
pub struct PatchMemoryRequestPayload {
    pub content: Option<String>,
    pub is_clip: Option<bool>,
    pub tags: Option<Vec<String>>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct PatchMemoryResponseBodyData {
    pub id: String,
    pub content: Option<String>,
    pub is_clip: Option<bool>,
    pub tags: Option<Vec<String>>,
    pub updated_at: DateTime<Utc>,
}
