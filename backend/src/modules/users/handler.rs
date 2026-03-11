use axum::{Json, extract::State, http::StatusCode};

use crate::{
    app_state::AppState,
    common::auth,
    common::response,
    extractors::current_user::CurrentUser,
    modules::users::dto::{
        LoginUserRequest, LoginUserResponse, MeResponse, RegisterUserRequest, RegisterUserResponse,
        UserResponse,
    },
    modules::users::service,
};

pub async fn register_user(
    State(state): State<AppState>,
    Json(payload): Json<RegisterUserRequest>,
) -> response::ApiResult<RegisterUserResponse> {
    let user = service::register_user(&state.db, payload).await?;

    let token = auth::generate_jwt(&user, &state.jwt_secret)?;

    Ok((
        StatusCode::CREATED,
        response::ok("user created", RegisterUserResponse { token }),
    ))
}

pub async fn login_user(
    State(state): State<AppState>,
    Json(payload): Json<LoginUserRequest>,
) -> response::ApiResult<LoginUserResponse> {
    let user = service::login_user(&state.db, payload).await?;

    let token = auth::generate_jwt(&user, &state.jwt_secret)?;

    Ok((
        StatusCode::OK,
        response::ok("login successful", LoginUserResponse { token }),
    ))
}

pub async fn me(current_user: CurrentUser) -> response::ApiResult<MeResponse> {
    Ok((
        StatusCode::OK,
        response::ok(
            "you are",
            MeResponse {
                user: UserResponse {
                    id: current_user.id.to_string(),
                    email: current_user.email,
                },
            },
        ),
    ))
}
