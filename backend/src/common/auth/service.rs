pub mod token {
    use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
    use chrono::{Duration, Utc};
    use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
    use rand::{TryRngCore, rngs::OsRng};
    use sha2::{Digest, Sha256};
    use uuid::Uuid;

    use crate::{
        common::{auth::model::Claims, error::AppError, repository::user::User},
        modules::auth::model::NewRefreshToken,
    };

    pub fn generate_access_token(user: &User, secret: &str) -> Result<String, AppError> {
        let now = Utc::now();
        let exp = now + chrono::Duration::minutes(15);

        let claims = Claims {
            sub: user.id.to_string(),
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

    pub fn generate_refresh_token(user_id: &str, days: i64) -> Result<NewRefreshToken, AppError> {
        let mut bytes = [0u8; 32];
        OsRng.try_fill_bytes(&mut bytes).map_err(|_| {
            AppError::Internal("failed to generate secure random bytes".to_string())
        })?;

        let raw_token = URL_SAFE_NO_PAD.encode(bytes);

        let token_hash = hash_refresh_token(&raw_token);

        let now = Utc::now().timestamp();
        let expires_at = (Utc::now() + Duration::days(days)).timestamp();

        Ok(NewRefreshToken {
            id: Uuid::new_v4().to_string(),
            raw_token,
            token_hash,
            user_id: user_id.to_string(),
            expires_at,
            created_at: now,
        })
    }

    fn hash_refresh_token(raw_token: &str) -> String {
        let mut hasher = Sha256::new();

        hasher.update(raw_token.as_bytes());

        format!("{:x}", hasher.finalize())
    }

    pub fn verify_access_token(access_token: &str, secret: &str) -> Result<Claims, AppError> {
        let mut validation = Validation::new(Algorithm::HS256);
        validation.validate_exp = true;

        let token_data = decode::<Claims>(
            access_token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &validation,
        )
        .map_err(|_| AppError::Unauthorized("invalid or expired token".to_string()))?;

        Ok(token_data.claims)
    }
}
