use axum::{
    Router,
    routing::{get, post},
};

use crate::{app_state::AppState, modules::auth::handler};

pub fn router() -> Router<AppState> {
    let base_path = "/auth";

    let signin_path = format!("{}/signin", base_path);
    let signup_path = format!("{}/signup", base_path);
    let signout_path = format!("{}/signout", base_path);
    let refresh_path = format!("{}/refresh", base_path);

    Router::new()
        .route(&signin_path, post(handler::signin))
        .route(&signup_path, post(handler::signup))
        .route(&signout_path, get(handler::signout))
        .route(&refresh_path, get(handler::refresh))
}
