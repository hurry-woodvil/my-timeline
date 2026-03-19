use axum::{Router, routing::post};

use crate::{app_state::AppState, modules::auth::handler};

pub fn router() -> Router<AppState> {
    let base_path = "/auth";

    let signin_path = format!("{}/signin", base_path);
    let signup_path = format!("{}/signup", base_path);

    Router::new()
        .route(&signin_path, post(handler::signin))
        .route(&signup_path, post(handler::signup))
}
