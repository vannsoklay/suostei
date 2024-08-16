use async_graphql::Context;

use crate::context::ClaimState;


#[derive(Debug, Clone, Default)]
pub struct BlogQuery;

#[async_graphql::Object]
impl BlogQuery {
    async fn blog(&self, ctx: &Context<'_>) -> String {
        let user_id = ctx
            .data_opt::<ClaimState>()
            .clone()
            .unwrap()
            .user_id
            .to_owned();

        format!("hello world {}", user_id)
    }
}
