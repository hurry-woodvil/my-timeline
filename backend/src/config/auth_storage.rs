#[derive(Debug, Clone, Copy)]
pub enum AuthStorageKind {
    Memory,
    Database,
}

impl AuthStorageKind {
    pub fn from_env() -> Self {
        match std::env::var("AUTH_STORAGE")
            .unwrap_or_else(|_| "database".to_string())
            .to_lowercase()
            .as_str()
        {
            "memory" => Self::Memory,
            "database" => Self::Database,
            _ => Self::Database,
        }
    }
}
