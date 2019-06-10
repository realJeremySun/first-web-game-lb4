import {BindingKey,Interceptor} from '@loopback/context';
import {UserPermissionsFn} from './types';
import {TokenService} from '@loopback/authentication';

/**
 * Binding keys used by this component.
 */
export namespace MyAuthBindings {
  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn>(
    'userAuthorization.actions.userPermissions',
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );

  export const AUTH_INTERCEPTOR = BindingKey.create<Interceptor>(
    'interceptors.authorization',
  );
}

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '600000';
}
