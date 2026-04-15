use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    app_state::AppState,
    common::response,
    extractors::current_user::CurrentUser,
    modules::memory::{
        dto::{GetMemoryResponse, PostMemoryRequest, PostMemoryResponse},
        service,
    },
};

pub async fn fetch_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Path(memory_id): Path<String>,
) -> response::ApiResult<GetMemoryResponse> {
    let result = service::fetch_memory(
        &state.db,
        &current_user,
        &state.memories_repository,
        &memory_id,
    )
    .await?;

    Ok((
        StatusCode::OK,
        response::ok(
            "get memory",
            GetMemoryResponse {
                memory_id: result.memory_id,
                content: result.content,
                created_at: result.created_at,
            },
        ),
    ))
}

pub async fn post_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Json(payload): Json<PostMemoryRequest>,
) -> response::ApiResult<PostMemoryResponse> {
    let result = service::post_memory(
        &state.db,
        &current_user,
        &state.memories_repository,
        payload,
    )
    .await?;

    let memory_id = result.memory_id.clone();
    let content = result.content.clone();
    let created_at = result.created_at.clone();

    Ok((
        StatusCode::CREATED,
        response::ok(
            "post successful",
            PostMemoryResponse {
                memory_id,
                content,
                created_at,
            },
        ),
    ))
}

pub async fn delete_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Path(memory_id): Path<String>,
) -> response::ApiResult<()> {
    service::delete_memory(
        &state.db,
        &current_user,
        &state.memories_repository,
        &memory_id,
    )
    .await?;

    Ok((StatusCode::OK, response::ok("delete memory", {})))
}
