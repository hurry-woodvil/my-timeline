mod app_state;
mod common;
mod config;
mod extractors;
mod modules;
mod routes;

use axum::{
    Router,
    http::{
        HeaderValue, Method,
        header::{AUTHORIZATION, CONTENT_TYPE},
    },
};
use axum_server::tls_rustls::RustlsConfig;
use dotenvy::dotenv;
use rustls::crypto::aws_lc_rs;
use sqlx::sqlite::SqlitePoolOptions;
use std::{env, net::SocketAddr};
use tower_http::cors::{AllowOrigin, CorsLayer};

use crate::config::auth_storage::AuthStorageKind;

pub async fn run() {
    aws_lc_rs::default_provider()
        .install_default()
        .expect("failed to install rustls crypto provider");

    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    let db = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("failed to connect database");

    let auth_storage_kind = AuthStorageKind::from_env();

    let users_repository = common::repository::create_users_repository(auth_storage_kind).await;
    let refresh_tokens_repository =
        common::repository::create_refresh_tokens_repository(auth_storage_kind);
    let memories_repository = common::repository::create_memories_repository(auth_storage_kind);

    sqlx::migrate!("./migrations/")
        .run(&db)
        .await
        .expect("failed to run migrations");

    let auth_service = app_state::AuthService { jwt_secret };
    let state = app_state::AppState {
        db,
        users_repository,
        refresh_tokens_repository,
        memories_repository,
        auth_service,
    };

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact(
            "https://localhost:5173"
                .parse::<HeaderValue>()
                .expect("invalid frontend origin"),
        ))
        .allow_credentials(true)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([AUTHORIZATION, CONTENT_TYPE]);

    let app = Router::new()
        .merge(routes::auth::router())
        .merge(routes::users::router(state.clone()))
        .merge(routes::memories::router(state.clone()))
        .layer(cors)
        .with_state(state);

    let tls_config =
        RustlsConfig::from_pem_file("../certs/localhost+2.pem", "../certs/localhost+2-key.pem")
            .await
            .expect("failed to load TLS certificate files");

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!("server running on https://{}", addr);
    println!("allowed frontend origin: https://localhost:5173");

    axum_server::bind_rustls(addr, tls_config)
        .serve(app.into_make_service())
        .await
        .expect("server error");
}
