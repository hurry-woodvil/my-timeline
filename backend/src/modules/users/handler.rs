use axum::{extract::State, http::StatusCode};

use crate::{
    app_state::AppState,
    common::response,
    extractors::current_user::CurrentUser,
    modules::users::{
        dto::{MeResponse, User},
        service,
    },
};

pub async fn me(
    State(state): State<AppState>,
    current_user: CurrentUser,
) -> response::ApiResult<MeResponse> {
    let user = service::get_me(&state.db, &state.users_repository, &current_user.id).await?;

    let user = User {
        id: user.user_id,
        email: user.user_email,
    };

    Ok((StatusCode::OK, response::ok("you are", MeResponse { user })))
}
