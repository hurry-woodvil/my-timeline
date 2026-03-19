use axum::http::StatusCode;

use crate::{
    common::response,
    extractors::current_user::CurrentUser,
    modules::users::dto::{MeResponse, User},
};

pub async fn me(current_user: CurrentUser) -> response::ApiResult<MeResponse> {
    let user = User {
        id: current_user.id.to_string(),
        email: current_user.email,
    };

    Ok((StatusCode::OK, response::ok("you are", MeResponse { user })))
}
