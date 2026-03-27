use axum::{Router, middleware, routing::get};

use crate::{
    app_state::AppState, common::auth::middleware::require_auth, modules::memories::handler,
};

pub fn router(state: AppState) -> Router<AppState> {
    let base_path = "/memories";

    Router::new()
        .route(&base_path, get(handler::memories))
        .route_layer(middleware::from_fn_with_state(state, require_auth))
}
