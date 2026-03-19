use axum::{Router, middleware, routing::get};

use crate::{app_state::AppState, common::auth::middleware::require_auth, modules::users::handler};

pub fn router(state: AppState) -> Router<AppState> {
    let base_path = "/users";

    let me_path = format!("{}/me", base_path);

    Router::new()
        .route(&me_path, get(handler::me))
        .route_layer(middleware::from_fn_with_state(state, require_auth))
}
