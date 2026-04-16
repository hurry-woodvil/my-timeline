use axum::{
    Router, middleware,
    routing::{delete, get, patch, post},
};

use crate::{
    app_state::AppState, common::auth::middleware::require_auth, modules::memories::handler,
};

pub fn router(state: AppState) -> Router<AppState> {
    let base_path = "/memories";

    let get_path = format!("{}/{{id}}", base_path);
    let patch_path = format!("{}/{{id}}", base_path);
    let delete_path = format!("{}/{{id}}", base_path);

    Router::new()
        // GET /memories
        .route(&base_path, get(handler::get_memories))
        // GET /memories/{id}
        .route(&get_path, get(handler::get_memory))
        // POST /memories
        .route(&base_path, post(handler::post_memory))
        // PATCH /memories/{id}
        .route(&patch_path, patch(handler::patch_memory))
        // DELETE /memories/{id}
        .route(&delete_path, delete(handler::delete_memory))
        // middleware layer
        .route_layer(middleware::from_fn_with_state(state, require_auth))
}
