use mongodb::bson::DateTime;
use serde::Serialize;

#[allow(non_snake_case)]
#[derive(Debug, Serialize)]
pub struct FilteredUser {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub role: String,
    pub photo: Option<String>,
    pub verified: bool,
    pub provider: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Serialize, Debug)]
pub struct UserData {
    pub user: FilteredUser,
}

#[derive(Serialize, Debug)]
pub struct UserResponse {
    pub status: String,
    pub data: UserData,
}