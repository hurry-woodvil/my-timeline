use axum::{
    extract::{FromRef, FromRequestParts},
    http::{header, request::Parts},
};
use uuid::Uuid;

use crate::{
    app_state::AppState,
    common::{auth::service::token, error::AppError},
    modules::users::service,
};

#[derive(Debug, Clone)]
pub struct CurrentUser {
    pub id: Uuid,
    pub email: String,
}

impl<S> FromRequestParts<S> for CurrentUser
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let app_state = AppState::from_ref(state);

        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .ok_or_else(|| {
                AppError::Unauthorized(
                    "missing authorization
                header"
                        .to_string(),
                )
            })?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or_else(|| AppError::Unauthorized("invalid authorization".to_string()))?;

        let claims = token::verify_access_token(token, &app_state.jwt_secret)?;

        let user = service::get_me(&app_state.db, &claims.sub).await?;

        Ok(CurrentUser {
            id: user.id,
            email: user.email,
        })
    }
}
