use chrono::{Duration, Utc};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};

use crate::common::error::AppError;
use crate::modules::users::model::{Claims, User};

pub fn generate_jwt(user: &User, secret: &str) -> Result<String, AppError> {
    let now = Utc::now();
    let exp = now + Duration::hours(24);

    let claims = Claims {
        sub: user.id.to_string(),
        email: user.email.clone(),
        iat: now.timestamp() as usize,
        exp: exp.timestamp() as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|_| AppError::Internal("failed to generate token".to_string()))
}

pub fn verify_jwt(token: &str, secret: &str) -> Result<Claims, AppError> {
    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
    .map_err(|_| AppError::Unauthorized("invalid or expired token".to_string()))?;

    Ok(token_data.claims)
}
