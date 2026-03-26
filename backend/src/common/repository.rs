use std::{collections::HashMap, sync::Arc};

use tokio::sync::RwLock;

use crate::{
    common::repository::{
        refresh_tokens::{
            InDataBaseRefreshTokensRepository, InMemoryRefreshTokensRepository,
            RefreshTokensRepository,
        },
        user::{InDatabaseUserRepository, InMemoryUsersRepository, UsersRepository},
    },
    config::auth_storage::AuthStorageKind,
};

pub mod refresh_tokens;
pub mod user;

pub async fn create_users_repository(kind: AuthStorageKind) -> UsersRepository {
    match kind {
        AuthStorageKind::Memory => {
            let users = InMemoryUsersRepository {
                users_by_id: RwLock::new(HashMap::new()),
                users_by_name: RwLock::new(HashMap::new()),
                users_by_email: RwLock::new(HashMap::new()),
            };
            users.new().await;
            let repo: UsersRepository = Arc::new(users);
            repo
        }
        AuthStorageKind::Database => {
            let repo: UsersRepository = Arc::new(InDatabaseUserRepository);
            repo
        }
    }
}

pub fn create_refresh_tokens_repository(kind: AuthStorageKind) -> RefreshTokensRepository {
    match kind {
        AuthStorageKind::Memory => {
            let repo: RefreshTokensRepository = Arc::new(InMemoryRefreshTokensRepository {
                refresh_tokens_by_hash: RwLock::new(HashMap::new()),
            });
            repo
        }
        AuthStorageKind::Database => {
            let repo: RefreshTokensRepository = Arc::new(InDataBaseRefreshTokensRepository);
            repo
        }
    }
}
