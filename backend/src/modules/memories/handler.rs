use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    app_state::AppState,
    common::response,
    extractors::current_user::CurrentUser,
    modules::memories::{
        dto::{
            DeleteMemoryResponseBodyData, GetMemoriesResponseBodyData, GetMemoryResponseBodyData,
            PatchMemoryRequestPayload, PatchMemoryResponseBodyData, PostMemoryRequestPayload,
            PostMemoryResponseBodyData,
        },
        model::Memory,
        service,
    },
};

pub async fn get_memories(
    State(state): State<AppState>,
    current_user: CurrentUser,
) -> response::ApiResult<GetMemoriesResponseBodyData> {
    let user_id = &current_user.id;

    let items = service::fetch_memories(&state.db, &state.memories_repository, user_id).await?;

    Ok((
        StatusCode::OK,
        response::ok("get memories", GetMemoriesResponseBodyData { items }),
    ))
}

pub async fn get_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Path(id): Path<String>,
) -> response::ApiResult<GetMemoryResponseBodyData> {
    let memory_id = &id;
    let user_id = &current_user.id;

    let memory =
        service::fetch_memory(&state.db, &state.memories_repository, memory_id, user_id).await?;

    let id = memory.id.unwrap_or_default();
    let content = memory.content.unwrap_or_default();
    let created_at = memory.created_at.unwrap_or_default();
    let updated_at = memory.updated_at;

    let response_body_data = GetMemoryResponseBodyData {
        id,
        content,
        created_at,
        updated_at,
    };

    Ok((
        StatusCode::OK,
        response::ok("get memory", response_body_data),
    ))
}

pub async fn post_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Json(payload): Json<PostMemoryRequestPayload>,
) -> response::ApiResult<PostMemoryResponseBodyData> {
    let id = None;
    let user_id = current_user.id;
    let content = Some(payload.content);
    let created_at = Some(payload.created_at);
    let updated_at = payload.updated_at;

    let memory = Memory {
        id,
        user_id,
        content,
        created_at,
        updated_at,
    };

    let result = service::create_memory(&state.db, &state.memories_repository, &memory).await?;

    let id = result.id.unwrap().clone();
    let content = result.content.unwrap().clone();
    let created_at = result.created_at.unwrap().clone();
    let updated_at = result.updated_at.clone();

    let response_body_data = PostMemoryResponseBodyData {
        id,
        content,
        created_at,
        updated_at,
    };

    Ok((
        StatusCode::CREATED,
        response::ok("create memory", response_body_data),
    ))
}

pub async fn patch_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Path(id): Path<String>,
    Json(payload): Json<PatchMemoryRequestPayload>,
) -> response::ApiResult<PatchMemoryResponseBodyData> {
    let id = Some(id);
    let user_id = current_user.id;
    let content = payload.content;
    let created_at = None;
    let updated_at = payload.updated_at;

    let memory = Memory {
        id,
        user_id,
        content,
        created_at,
        updated_at,
    };

    let result = service::update_memory(&state.db, &state.memories_repository, &memory).await?;

    let content = result.content;

    let response_body_data = PatchMemoryResponseBodyData { content };

    Ok((
        StatusCode::OK,
        response::ok("update successful", response_body_data),
    ))
}

pub async fn delete_memory(
    State(state): State<AppState>,
    current_user: CurrentUser,
    Path(id): Path<String>,
) -> response::ApiResult<DeleteMemoryResponseBodyData> {
    let memory_id = &id;
    let user_id = &current_user.id;

    let result =
        service::delete_memory(&state.db, &state.memories_repository, memory_id, user_id).await?;

    let id = result;

    let response_body_data = DeleteMemoryResponseBodyData { id };

    Ok((
        StatusCode::OK,
        response::ok("delete memory", response_body_data),
    ))
}
