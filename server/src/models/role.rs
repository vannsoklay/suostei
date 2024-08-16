use async_graphql::{Context, Enum};
use mongodb::bson::{doc, DateTime};

use super::{model_user, user::User};

#[derive(Enum, Debug, Clone, Copy, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
enum ROLE {
    USER,
    ADMIN,
    WRITER
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct Role {
    _id: String,
    role: String,
    owner_id: String,
    created_at: Option<DateTime>,
    updated_at: Option<DateTime>,
}

#[async_graphql::Object]
impl Role {
    async fn id(&self) -> &str {
        &self._id
    }
    async fn role(&self) -> &str {
        &self.role
    }
    async fn user(&self, ctx: &Context<'_>) -> Option<User> {
        let USER = model_user(ctx);

        let user = USER.find_one(doc! { "_id": self.owner_id.to_owned() }).await;

        if user.is_err() {
            return None;
        }

        match user.unwrap() {
            Some(data) => Some(data),
            None => None,
        }
    }
}
