pub mod private;
pub mod public;

use async_graphql::{EmptySubscription, MergedObject, Schema};

use self::private::{mutations::*, queries::*};

#[derive(MergedObject, Default)]
pub struct PrivateQueryRoot(BlogQuery);

#[derive(MergedObject, Default)]
pub struct PrivateMutationRoot(BlogMutation);

pub type PrivateSchema = Schema<PrivateQueryRoot, PrivateMutationRoot, EmptySubscription>;


