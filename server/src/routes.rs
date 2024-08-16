use actix_web::{route, web, HttpRequest, HttpResponse, Result};
use async_graphql::{http::GraphiQLSource, Schema};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};

use crate::{context::{token::AuthenticationGuard, ClaimState}, graphql::PrivateSchema};



pub async fn index_graphiql() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(
            GraphiQLSource::build()
                .endpoint("/graphql/private")
                .subscription_endpoint("/")
                .finish(),
        ))
}

#[route("/graphql/private", method = "GET", method = "POST")]
pub async fn private_graphql(
    schema: web::Data<PrivateSchema>,
    // auth: AuthenticationGuard,
    gql_request: GraphQLRequest,
    // req: HttpRequest,
) -> GraphQLResponse {
    println!("hell0s");
    // let db_name = std::env::var("DB_NAME").unwrap_or_else(|_| "suostei".into());
    let mut request = gql_request.into_inner();

    // let user_id = auth.user_id.clone();

    request = request.data(ClaimState {
        user_id: format!("hello"),
        role: None
    });
    return schema.execute(request).await.into();
}

pub async fn index_ws(
    schema: web::Data<PrivateSchema>,
    req: HttpRequest,
    payload: web::Payload,
) -> Result<HttpResponse> {
    GraphQLSubscription::new(Schema::clone(&*schema)).start(&req, payload)
}
