#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub client_origin: String,
    pub jwt_secret: String,
    pub jwt_expires_in: String,
    pub jwt_max_age: i64,
    pub google_oauth_client_id: String,
    pub google_oauth_client_secret: String,
    pub google_oauth_redirect_url: String,
    pub github_oauth_client_id: String,
    pub github_oauth_client_secret: String,
    pub github_oauth_redirect_url: String,
}

impl Config {
    pub fn init() -> Config {
        let database_url = std::env::var("DB_URL").expect("DATABASE must be set");
        let client_origin = std::env::var("CLIENT_ORIGIN").expect("CLIENT_ORIGIN must be set");
        let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let jwt_expires_in =
            std::env::var("TOKEN_EXPIRED_IN").expect("TOKEN_EXPIRED_IN must be set");
        let jwt_max_age = std::env::var("TOKEN_MAXAGE").expect("TOKEN_MAXAGE must be set");
        let google_oauth_client_id =
            std::env::var("GOOGLE_OAUTH_CLIENT_ID").expect("GOOGLE_OAUTH_CLIENT_ID must be set");
        let google_oauth_client_secret = std::env::var("GOOGLE_OAUTH_CLIENT_SECRET")
            .expect("GOOGLE_OAUTH_CLIENT_SECRET must be set");
        let google_oauth_redirect_url = std::env::var("GOOGLE_OAUTH_REDIRECT_URL")
            .expect("GOOGLE_OAUTH_REDIRECT_URL must be set");
        let github_oauth_client_id =
            std::env::var("GITHUB_OAUTH_CLIENT_ID").expect("GITHUB_OAUTH_CLIENT_ID must be set");
        let github_oauth_client_secret = std::env::var("GITHUB_OAUTH_CLIENT_SECRET")
            .expect("GITHUB_OAUTH_CLIENT_SECRET must be set");
        let github_oauth_redirect_url = std::env::var("GITHUB_OAUTH_REDIRECT_URL")
            .expect("GITHUB_OAUTH_REDIRECT_URL must be set");

        Config {
            database_url,
            client_origin,
            jwt_secret,
            jwt_expires_in,
            jwt_max_age: jwt_max_age.parse::<i64>().unwrap(),
            google_oauth_client_id,
            google_oauth_client_secret,
            google_oauth_redirect_url,
            github_oauth_client_id,
            github_oauth_client_secret,
            github_oauth_redirect_url,
        }
    }
}