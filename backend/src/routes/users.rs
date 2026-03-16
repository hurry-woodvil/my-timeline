use axum::{
    Router,
    routing::{get, post},
};

use crate::{app_state::AppState, modules::users::handler};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/users/register", post(handler::register_user))
        .route("/users/login", post(handler::login_user))
        .route("/users/me", get(handler::me))
}
