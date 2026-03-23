use axum::{
    extract::{FromRef, FromRequestParts},
    http::{StatusCode, request::Parts},
};

use crate::app_state::AppState;

#[derive(Debug, Clone)]
pub struct CurrentUser {
    pub id: String,
}

impl<S> FromRequestParts<S> for CurrentUser
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        parts
            .extensions
            .get::<CurrentUser>()
            .cloned()
            .ok_or(StatusCode::UNAUTHORIZED)
    }
}
