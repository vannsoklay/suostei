use mongodb::Database;
use serde::{Deserialize, Serialize};

use crate::config;

pub mod token;

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize,
}

pub struct AppState {
    pub db: Database,
    pub env: config::Config,
}

impl AppState {
    pub fn init(db: Database) -> AppState {
        AppState {
            db: db.clone(),
            env: config::Config::init(),
        }
    }
}