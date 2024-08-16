use std::future::{ready, Ready};

use actix_web::{
    dev::Payload,
    error::{Error as ActixWebError, ErrorUnauthorized},
    http, web, FromRequest, HttpRequest,
};
use futures::executor::block_on;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use mongodb::bson::doc;
use serde_json::json;

use crate::{
    context::{AppState, TokenClaims},
    models::user::User,
};

pub struct AuthenticationGuard {
    pub user_id: String,
}

impl FromRequest for AuthenticationGuard {
    type Error = ActixWebError;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let token = req
            .cookie("token")
            .map(|c| c.value().to_string())
            .or_else(|| {
                req.headers()
                    .get(http::header::AUTHORIZATION)
                    .map(|h| h.to_str().unwrap().split_at(7).1.to_string())
            });

        if token.is_none() {
            return ready(Err(ErrorUnauthorized(
                json!({"status": "fail", "message": "You are not logged in, please provide token"}),
            )));
        }

        let data = req.app_data::<web::Data<AppState>>().unwrap();

        let jwt_secret = data.env.jwt_secret.to_owned();
        let decode = decode::<TokenClaims>(
            token.unwrap().as_str(),
            &DecodingKey::from_secret(jwt_secret.as_ref()),
            &Validation::new(Algorithm::HS256),
        );

        let user_id = match decode {
            Ok(token) => token.claims.sub.to_owned(),
            Err(_) => {
                return ready(Err(ErrorUnauthorized(
                    json!({"status": "fail", "message": "Invalid token or usre doesn't exists"}),
                )))
            }
        };

        let user_existed = async move {
            let user_db = data.db.collection::<User>("users");

            let user = user_db.find_one(doc! { "_id": user_id }).await;

            if user.is_err() {
                return Err(ErrorUnauthorized(format!("Internal Server Error")));
            }

            let user = match user.unwrap() {
                Some(data) => data,
                None => return Err(ErrorUnauthorized(format!("Internal Server Error"))),
            };

            Ok(AuthenticationGuard {
                user_id: user._id.unwrap().to_owned(),
            })
        };

        match block_on(user_existed) {
            Ok(user) => ready(Ok(user)),
            Err(e) => ready(Err(ErrorUnauthorized(format!(
                "Internal Server Error {:?}",
                e
            )))),
        }
    }
}
