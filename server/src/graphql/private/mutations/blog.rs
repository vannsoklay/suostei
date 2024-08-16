use async_graphql::*;

use crate::context::ClaimState;

#[derive(Debug, Clone, Default)]
pub struct BlogMutation;

#[async_graphql::Object]
impl BlogMutation {
    async fn create_blog(&self, ctx: &Context<'_>) -> String {
        let user_id = ctx
            .data_opt::<ClaimState>()
            .clone()
            .unwrap()
            .user_id
            .to_owned();

        format!("hello world {}", user_id)
    }
}
