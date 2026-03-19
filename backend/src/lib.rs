mod app_state;
mod common;
mod extractors;
mod modules;
mod routes;

use axum::Router;
use dotenvy::dotenv;
use sqlx::sqlite::SqlitePoolOptions;
use std::{env, net::SocketAddr};
use tower_http::cors::CorsLayer;

pub async fn run() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    let db = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect(
            "failed to
            connect database",
        );

    sqlx::migrate!("./migrations/")
        .run(&db)
        .await
        .expect("failed to run migrations");

    let state = app_state::AppState { db, jwt_secret };

    let app = Router::new()
        .merge(routes::auth::router())
        .merge(routes::users::router())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind");

    println!("server running on http://{}", addr);

    axum::serve(listener, app).await.expect("server error");
}
