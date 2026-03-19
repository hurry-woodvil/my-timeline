use axum::{Router, routing::get};

use crate::{app_state::AppState, modules::users::handler};

pub fn router() -> Router<AppState> {
    let base_path = "/users";

    let me_path = format!("{}/me", base_path);

    Router::new().route(&me_path, get(handler::me))
}
