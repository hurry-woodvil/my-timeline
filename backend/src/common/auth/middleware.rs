use axum::{
    extract::{Request, State},
    http::{StatusCode, header},
    middleware::Next,
    response::Response,
};

use crate::{app_state::AppState, extractors::current_user::CurrentUser};

pub async fn require_auth(
    State(state): State<AppState>,
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let claims = state
        .auth_service
        .verify_access_token(token)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let current_user = CurrentUser { id: claims.sub };

    req.extensions_mut().insert(current_user);

    Ok(next.run(req).await)
}
