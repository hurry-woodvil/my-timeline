use axum::{Router, middleware, routing::post};

use crate::{
    app_state::AppState, common::auth::middleware::require_auth, modules::memory::handler,
};

pub fn router(state: AppState) -> Router<AppState> {
    let base_path = "/memory";

    Router::new()
        .route(&base_path, post(handler::post_memory))
        .route_layer(middleware::from_fn_with_state(state, require_auth))
}
