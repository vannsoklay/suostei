#![allow(non_snake_case)]

mod config;
mod contexts;
mod db;
mod models;
mod security;

use actix_cors::Cors;
use actix_session::{storage::RedisSessionStore, SessionMiddleware};
use actix_web::{cookie::Key, http::header, web, App, HttpServer};
use contexts::AppState;
use db::connect_to_mongodb;
use dotenv::dotenv;

fn get_secret_key() -> Key {
    let secret_key = Key::generate();
    secret_key
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }
    dotenv().ok();
    env_logger::init();
    let secret_key = get_secret_key();
    let redis_store = RedisSessionStore::new("redis://127.0.0.1:6379")
        .await
        .unwrap();
    let db = connect_to_mongodb()
        .await
        .unwrap()
        .to_owned()
        .database("suostei");

    let db = AppState::init(db);
    let app_data = web::Data::new(db);
    let public_dir = std::env::current_dir().unwrap().join("public");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();
        App::new()
            .service(actix_files::Files::new("/api/images", &public_dir))
            .app_data(app_data.clone())
            .configure(security::handler::api)
            .wrap(SessionMiddleware::new(
                redis_store.clone(),
                secret_key.clone(),
            )).wrap(cors)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
