use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;

use crate::{
    app_state::AppState,
    common::auth::service::token,
    common::response,
    modules::auth::{
        dto::{SigninRequest, SigninResponse, SignupRequest, SignupResponse},
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

    let access_token = token::generate_access_token(&user, &state.jwt_secret)?;

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

    let access_token = token::generate_access_token(&user, &state.jwt_secret)?;

    let refresh_token = token::generate_refresh_token(&user.id.to_string(), 7)?;

    let jar = service::save_refresh_token(&state.db, cookie_jar, refresh_token).await?;

    Ok((
        StatusCode::CREATED,
        jar,
        response::ok("user created", SignupResponse { access_token }),
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
