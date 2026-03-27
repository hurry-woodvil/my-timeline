use crate::common::repository::memories::Memory;

pub struct MemoriesRequest;

#[derive(Debug)]
pub struct MemoriesResponse {
    pub items: Vec<Memory>,
}
