use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct MeResponse {
    pub user: User,
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: String,
    pub email: String,
}
