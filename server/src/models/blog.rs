use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Blog {
    pub _id: String,
    pub title: String,
    pub body: Option<String>,
    pub slug: String,
    pub featured_image: String,
    pub publish_date: DateTime,
    pub status: bool,
    pub author_id: String,
    pub categories: Vec<String>,
    pub tags: Vec<String>,
    pub created_at: Option<DateTime>,
    pub updated_at: Option<DateTime>,
}

impl Blog {}

#[async_graphql::Object]
impl Blog {
    async fn id(&self) -> &str {
        &self._id
    }
}
