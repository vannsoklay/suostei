use crate::context::token::AuthenticationGuard;
use crate::models::user::{LoginUserSchema, QueryCode, RegisterUserSchema, User};
use crate::security::response::{FilteredUser, UserData, UserResponse};
use crate::security::{
    github_oauth::{get_github_oauth_token, get_github_user},
    google_oauth::{get_google_user, request_token},
};
use actix_web::{
    cookie::{time::Duration as ActixWebDuration, Cookie},
    get, post, web, HttpResponse, Responder,
};
use chrono::{prelude::*, Duration};
use jsonwebtoken::{encode, EncodingKey, Header};
use mongodb::bson::{doc, oid::ObjectId, DateTime};
use actix_web::http::header::LOCATION;

use crate::context::{AppState, TokenClaims};

#[post("/auth/register")]
async fn register_user_handler(
    body: web::Json<RegisterUserSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let USER = data.db.collection::<User>("users");

    let user = USER
        .find_one(doc! { "email": body.email.to_lowercase() })
        .await
        .expect("Can't find");

    if user.is_some() {
        return HttpResponse::Conflict()
            .json(serde_json::json!({"status": "fail","message": "Email already exist"}));
    }

    let datetime = DateTime::now();

    let user = User {
        _id: Some(ObjectId::new().to_hex()),
        name: body.name.to_owned(),
        verified: false,
        email: Some(body.email.to_owned()),
        provider: "local".to_string(),
        role: "user".to_string(),
        password: "".to_string(),
        photo: Some("default.png".to_string()),
        third_party_id: 0,
        created_at: Some(datetime),
        updated_at: Some(datetime),
    };

    let write_user = USER.insert_one(user).await;

    if write_user.is_err() {
        return HttpResponse::Conflict()
            .json(serde_json::json!({"status": "fail","message": "Can't register user"}));
    }

    HttpResponse::Ok().json(serde_json::json!({
        "status": "success",
        "data": write_user.unwrap()
    }))
}

#[post("/auth/login")]
async fn login_user_handler(
    body: web::Json<LoginUserSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let USER = data.db.collection::<User>("users");

    let user = USER
        .find_one(doc! { "email": body.email.to_lowercase() })
        .await
        .expect("Can't find");

    if user.is_none() {
        return HttpResponse::BadRequest()
            .json(serde_json::json!({"status": "fail", "message": "Invalid email or password"}));
    }

    let user = user.unwrap().clone();

    if user.provider == "Google" {
        return HttpResponse::Unauthorized()
            .json(serde_json::json!({"status": "fail", "message": "Use Google OAuth2 instead"}));
    } else if user.provider == "GitHub" {
        return HttpResponse::Unauthorized()
            .json(serde_json::json!({"status": "fail", "message": "Use GitHub OAuth instead"}));
    }

    let jwt_secret = data.env.jwt_secret.to_owned();
    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + Duration::minutes(data.env.jwt_max_age)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user._id.unwrap(),
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = Cookie::build("token", token)
        .path("/")
        .max_age(ActixWebDuration::new(60 * data.env.jwt_max_age, 0))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(serde_json::json!({"status": "success"}))
}

#[get("/sessions/oauth/google")]
async fn google_oauth_handler(
    query: web::Query<QueryCode>,
    data: web::Data<AppState>,
) -> impl Responder {
    let USER = data.db.collection::<User>("users");

    let code = &query.code;
    let state = &query.state;

    if code.is_empty() {
        return HttpResponse::Unauthorized().json(
            serde_json::json!({"status": "fail", "message": "Authorization code not provided!"}),
        );
    }

    let token_response = request_token(code.as_str(), &data).await;
    if token_response.is_err() {
        let message = token_response.err().unwrap().to_string();
        return HttpResponse::BadGateway()
            .json(serde_json::json!({"status": "fail", "message": message}));
    }

    let token_response = token_response.unwrap();
    let google_user = get_google_user(&token_response.access_token, &token_response.id_token).await;
    if google_user.is_err() {
        let message = google_user.err().unwrap().to_string();
        return HttpResponse::BadGateway()
            .json(serde_json::json!({"status": "fail", "message": message}));
    }

    let google_user = google_user.unwrap();

    let user = USER
        .find_one(doc! { "third_party_id": google_user.id.clone() as i64 })
        .await
        .expect("Can't find");

    let user_id: String;

    if user.is_some() {
        let mut user = user.unwrap();
        user_id = user._id.to_owned().unwrap();
        user.email = google_user.email.to_owned();
        user.photo = google_user.picture;
        user.updated_at = Some(DateTime::now());
    } else {
        let datetime = DateTime::now();
        let id = ObjectId::new().to_hex();
        user_id = id.to_owned().to_string();
        let user_data = User {
            _id: Some(id.to_string()),
            name: google_user.name,
            verified: google_user.verified_email,
            email: google_user.email,
            third_party_id: google_user.id.clone(),
            provider: "Google".to_string(),
            role: "user".to_string(),
            password: "".to_string(),
            photo: google_user.picture,
            created_at: Some(datetime),
            updated_at: Some(datetime),
        };

        let _ = USER.insert_one(user_data).await;
    }

    let jwt_secret = data.env.jwt_secret.to_owned();
    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + Duration::minutes(data.env.jwt_max_age)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user_id,
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = Cookie::build("token", token)
        .path("/")
        .max_age(ActixWebDuration::new(60 * data.env.jwt_max_age, 0))
        .http_only(true)
        .finish();

    let frontend_origin = data.env.client_origin.to_owned();
    let mut response = HttpResponse::Found();
    response.append_header((LOCATION, format!("{}{}", frontend_origin, state)));
    response.cookie(cookie);
    response.finish()
}

#[get("/sessions/oauth/github")]
async fn github_oauth_handler(
    query: web::Query<QueryCode>,
    data: web::Data<AppState>,
) -> impl Responder {
    let USER = data.db.collection::<User>("users");

    let code = &query.code;
    let state = &query.state;

    if code.is_empty() {
        return HttpResponse::Unauthorized().json(
            serde_json::json!({"status": "fail", "message": "Authorization code not provided!"}),
        );
    }

    let token_response = get_github_oauth_token(code.as_str(), &data).await;
    if token_response.is_err() {
        let message = token_response.err().unwrap().to_string();
        return HttpResponse::BadGateway()
            .json(serde_json::json!({"status": "fail", "message": message}));
    }

    let token_response = token_response.unwrap();
    
    let github_user = get_github_user(token_response.access_token).await;
    if github_user.is_err() {
        let message = github_user.err().unwrap().to_string();
        return HttpResponse::BadGateway()
            .json(serde_json::json!({"status": "fail", "message": message}));
    }

    let github_user = github_user.unwrap();
    let third_party_id = github_user.id;

    let user = USER
        .find_one(doc! { "third_party_id": third_party_id.clone() as i64 })
        .await
        .expect("Can't find");

    let user_id: String;

    if user.is_some() {
        let datetime = DateTime::now();
        let mut user = user.unwrap();
        user_id = user._id.to_owned().unwrap();
        user.email = github_user.email.to_owned();
        user.third_party_id = third_party_id.to_owned();
        user.photo = github_user.avatar_url;
        user.updated_at = Some(datetime);
    } else {
        let datetime = DateTime::now();
        let id = ObjectId::new().to_hex();
        user_id = id.to_owned().to_string();
        let user_data = User {
            _id: Some(id.to_string()),
            name: github_user.login,
            verified: true,
            email: github_user.email,
            third_party_id: third_party_id.to_owned(),
            provider: "GitHub".to_string(),
            role: "user".to_string(),
            password: "".to_string(),
            photo: github_user.avatar_url,
            created_at: Some(datetime),
            updated_at: Some(datetime),
        };

        let _ = USER.insert_one(user_data).await;
    }

    let jwt_secret = data.env.jwt_secret.to_owned();
    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + Duration::minutes(data.env.jwt_max_age)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user_id,
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = Cookie::build("token", token)
        .path("/")
        .max_age(ActixWebDuration::new(60 * data.env.jwt_max_age, 0))
        .http_only(true)
        .finish();

    let frontend_origin = data.env.client_origin.to_owned();
    let mut response = HttpResponse::Found();
    response.append_header((LOCATION, format!("{}{}", frontend_origin, state)));
    response.cookie(cookie);
    response.finish()
}

#[get("/auth/logout")]
async fn logout_handler(_: AuthenticationGuard) -> impl Responder {
    let cookie = Cookie::build("token", "")
        .path("/")
        .max_age(ActixWebDuration::new(-1, 0))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(serde_json::json!({"status": "success"}))
}

#[get("/users/me")]
async fn get_me_handler(
    auth_guard: AuthenticationGuard,
    data: web::Data<AppState>,
) -> impl Responder {
    let USER = data.db.collection::<User>("users");

    let user = USER
        .find_one(doc! { "_id": auth_guard.user_id.to_owned() })
        .await
        .expect("Can't find");

    let json_response = UserResponse {
        status: "success".to_string(),
        data: UserData {
            user: user_to_response(&user.unwrap()),
        },
    };

    HttpResponse::Ok().json(json_response)
}

pub fn user_to_response(user: &User) -> FilteredUser {
    FilteredUser {
        id: user._id.to_owned().unwrap(),
        name: user.name.to_owned(),
        email: user.email.to_owned(),
        verified: user.verified.to_owned(),
        photo: user.photo.to_owned(),
        provider: user.provider.to_owned(),
        role: user.role.to_owned(),
        created_at: user.created_at.unwrap(),
        updated_at: user.updated_at.unwrap(),
    }
}

pub fn api(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(register_user_handler)
        .service(login_user_handler)
        .service(google_oauth_handler)
        .service(github_oauth_handler)
        .service(logout_handler)
        .service(get_me_handler);

    conf.service(scope);
}
