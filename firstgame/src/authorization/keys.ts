import {BindingKey} from '@loopback/context';
import {MetadataAccessor} from '@loopback/metadata';
import {AuthorizeFn, AuthorizationMetadata, UserPermissionsFn, UserProfile} from './types';
import {JWTStrategy} from './strategies/JWT.strategy';

/**
 * Binding keys used by this component.
 */
export namespace AuthorizationBindings {
  export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
    'userAuthorization.actions.authorize',
  );

  export const METADATA = BindingKey.create<AuthorizationMetadata | undefined>(
    'userAuthorization.operationMetadata',
  );

  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn>(
    'userAuthorization.actions.userPermissions',
  );

  export const SECRET = BindingKey.create<string>(
    'authorization.jwt.secret'
  );

  export const STRATEGY = BindingKey.create<JWTStrategy>(
    'authorization.strategies.jwt.strategy'
  );

  export const CURRENT_USER = BindingKey.create<UserProfile | undefined>(
    'authorization.currentUser',
  );
}

/**
 * Metadata accessor key for authorize method decorator
 */
export const AUTHORIZATION_METADATA_ACCESSOR = MetadataAccessor.create<
  AuthorizationMetadata,
  MethodDecorator
>('userAuthorization.accessor.operationMetadata');
