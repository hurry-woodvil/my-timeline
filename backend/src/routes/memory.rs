use axum::{
    Router, middleware,
    routing::{delete, get, patch, post},
};

use crate::{
    app_state::AppState, common::auth::middleware::require_auth, modules::memory::handler,
};

pub fn router(state: AppState) -> Router<AppState> {
    let base_path = "/memory";

    let fetch_path = format!("{}/{{memory_id}}", base_path);
    let delete_path = format!("{}/{{memory_id}}", base_path);
    let update_path = format!("{}/{{memory_id}}", base_path);

    Router::new()
        .route(&fetch_path, get(handler::fetch_memory))
        .route(&base_path, post(handler::post_memory))
        .route(&update_path, patch())
        .route(&delete_path, delete(handler::delete_memory))
        .route_layer(middleware::from_fn_with_state(state, require_auth))
}
