use serde::Serialize;

use crate::modules::memories::model::Memory;

pub struct MemoriesRequest;

#[derive(Debug, Serialize)]
pub struct MemoriesResponse {
    pub items: Vec<Memory>,
}
