#![allow(non_snake_case)]

mod config;
mod context;
mod db;
mod graphql;
mod models;
mod routes;
mod security;

use actix_cors::Cors;
use actix_session::{storage::RedisSessionStore, SessionMiddleware};
use actix_web::{cookie::Key, guard, http::header, web, App, HttpServer};
use async_graphql::{EmptySubscription, Schema};
use context::AppState;
use db::connect_to_mongodb;
use dotenv::dotenv;
use graphql::{PrivateMutationRoot, PrivateQueryRoot};
use routes::{index_graphiql, index_ws, private_graphql};

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

    let private_schema = Schema::build(
        PrivateQueryRoot::default(),
        PrivateMutationRoot::default(),
        EmptySubscription,
    )
    .finish();

    HttpServer::new(move || {
        let cors = Cors::permissive()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCESS_CONTROL_ALLOW_ORIGIN,
                header::ACCEPT,
            ])
            .supports_credentials();
        App::new()
            .service(actix_files::Files::new("/api/images", &public_dir))
            .app_data(app_data.clone())
            .app_data(private_schema.clone())
            .service(private_graphql)
            .service(web::resource("/").guard(guard::Get()).to(index_graphiql))
            .service(
                web::resource("/")
                    .guard(guard::Get())
                    .guard(guard::Header("upgrade", "websocket"))
                    .to(index_ws),
            )
            .configure(security::handler::api)
            .wrap(SessionMiddleware::new(
                redis_store.clone(),
                secret_key.clone(),
            ))
            .wrap(cors)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
