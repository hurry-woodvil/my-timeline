pub struct NewRefreshToken {
    pub id: String,
    pub raw_token: String,
    pub token_hash: String,
    pub user_id: String,
    pub expires_at: i64,
    pub created_at: i64,
}
