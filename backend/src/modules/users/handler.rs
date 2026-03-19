use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;

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

    let access_token = auth::generate_jwt(&user, &state.jwt_secret)?;

    Ok((
        StatusCode::CREATED,
        response::ok("user created", RegisterUserResponse { access_token }),
    ))
}

pub async fn login_user(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(payload): Json<LoginUserRequest>,
) -> response::ApiCookieResult<LoginUserResponse> {
    let user = service::login_user(&state.db, payload).await?;

    let access_token = auth::generate_jwt(&user, &state.jwt_secret)?;

    let refresh_token = auth::generate_refresh_token(&user.email, 7)?;

    let cookie_jar = service::save_refresh_token(&state.db, jar, &refresh_token).await?;

    Ok((
        StatusCode::OK,
        cookie_jar,
        response::ok("login successful", LoginUserResponse { access_token }),
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
