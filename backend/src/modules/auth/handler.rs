use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;

use crate::{
    app_state::AppState,
    common::{
        auth::service::token, error::AppError, repository::user::select_user_by_id, response,
    },
    modules::auth::{
        dto::{RefreshResponse, SigninRequest, SigninResponse, SignupRequest, SignupResponse},
        service,
    },
};

pub async fn signin(
    State(state): State<AppState>,
    cookie_jar: CookieJar,
    Json(payload): Json<SigninRequest>,
) -> response::ApiCookieResult<SigninResponse> {
    validate::signin_request(&payload)?;

    let user = service::signin(&state.db, payload).await?;

    let access_token =
        token::generate_access_token(&user.id.to_string(), &state.auth_service.jwt_secret)?;

    let refresh_token = token::generate_refresh_token(&user.id.to_string(), 7)?;

    let jar = service::save_refresh_token(&state.db, cookie_jar, refresh_token).await?;

    Ok((
        StatusCode::OK,
        jar,
        response::ok("signin successful", SigninResponse { access_token }),
    ))
}

pub async fn signup(
    State(state): State<AppState>,
    cookie_jar: CookieJar,
    Json(payload): Json<SignupRequest>,
) -> response::ApiCookieResult<SignupResponse> {
    validate::signup_request(&payload)?;

    let user = service::signup(&state.db, payload).await?;

    let access_token =
        token::generate_access_token(&user.id.to_string(), &state.auth_service.jwt_secret)?;

    let refresh_token = token::generate_refresh_token(&user.id.to_string(), 7)?;

    let jar = service::save_refresh_token(&state.db, cookie_jar, refresh_token).await?;

    Ok((
        StatusCode::CREATED,
        jar,
        response::ok("user created", SignupResponse { access_token }),
    ))
}

pub async fn refresh(
    State(state): State<AppState>,
    cookie_jar: CookieJar,
) -> response::ApiCookieResult<RefreshResponse> {
    let raw_refresh_token = cookie_jar
        .get("refresh_token")
        .map(|cookie| cookie.value().to_string())
        .ok_or_else(|| AppError::Unauthorized("refresh token not found".to_string()))?;

    let refresh_token = token::verify_refresh_token(&state.db, &raw_refresh_token).await?;

    let user = select_user_by_id(&state.db, &refresh_token.user_id)
        .await?
        .ok_or_else(|| AppError::Unauthorized("".to_string()))?;

    let user_id = user.id.to_string();

    let access_token = token::generate_access_token(&user_id, &state.auth_service.jwt_secret)?;

    let refresh_token = token::generate_refresh_token(&user_id, 7)?;

    let jar = service::save_refresh_token(&state.db, cookie_jar, refresh_token).await?;

    Ok((
        StatusCode::OK,
        jar,
        response::ok("token refreshed", RefreshResponse { access_token }),
    ))
}

mod validate {
    use crate::{
        common::error::AppError,
        modules::auth::dto::{SigninRequest, SignupRequest},
    };

    pub fn signin_request(payload: &SigninRequest) -> Result<(), AppError> {
        if payload.email.trim().is_empty() {
            return Err(AppError::Validation("email is required".to_string()));
        }

        if payload.password.len() < 8 {
            return Err(AppError::Validation(
                "password must be at least 8 characters".to_string(),
            ));
        }

        Ok(())
    }

    pub fn signup_request(payload: &SignupRequest) -> Result<(), AppError> {
        if payload.email.trim().is_empty() {
            return Err(AppError::Validation("email is required".to_string()));
        }

        if payload.password.len() < 8 {
            return Err(AppError::Validation(
                "password must be at least 8 characters".to_string(),
            ));
        }

        Ok(())
    }
}
