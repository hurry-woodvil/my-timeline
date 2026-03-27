use axum::{extract::State, http::StatusCode};

use crate::{
    app_state::AppState,
    common::response,
    extractors::current_user::CurrentUser,
    modules::memories::{dto::MemoriesResponse, model::Memory, service},
};

pub async fn memories(
    State(state): State<AppState>,
    current_user: CurrentUser,
) -> response::ApiResult<MemoriesResponse> {
    let memories =
        service::memories(&state.db, &state.memories_repository, &current_user.id).await?;

    let items = memories
        .iter()
        .map(|m| Memory {
            memory_id: m.memory_id.clone(),
            content: m.content.clone(),
            created_at: m.created_at,
        })
        .collect();

    Ok((
        StatusCode::OK,
        response::ok("view memories", MemoriesResponse { items }),
    ))
}
