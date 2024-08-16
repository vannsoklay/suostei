use async_graphql::Context;
use mongodb::{Client, Collection};

pub mod user;
pub mod role;
pub mod blog;
pub mod category;
pub mod tag;

use self::user::User;

fn model<T: Send + Sync>(ctx: &Context<'_>, name: &str) -> Collection<T> {
    let db_name = std::env::var("DB_NAME").unwrap_or_else(|_| "suostei".into());

    let client = ctx.data_unchecked::<Client>().clone();
    client.database(&db_name).collection(name)
}

pub fn model_user(ctx: &Context<'_>) -> Collection<User> {
    model::<User>(ctx, "users")
}