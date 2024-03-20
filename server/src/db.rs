use actix_web::Result;
use mongodb::{options::ClientOptions, Client};

use crate::config::Config;

pub async fn connect_to_mongodb() -> Result<Client, mongodb::error::Error> {
    let config = Config::init();
    let client_options = ClientOptions::parse(config.database_url).await?;
    let client = Client::with_options(client_options);

    match client {
        Ok(client) => {
            println!("{}", "Connected to database");
            Ok(client)
        }
        Err(e) => Err(e),
    }
}
