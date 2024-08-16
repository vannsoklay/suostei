use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Categories {
    pub _id: Option<String>,
    pub name: String,
    pub description: String,
    pub created_at: Option<DateTime>,
    pub updated_at: Option<DateTime>,
}