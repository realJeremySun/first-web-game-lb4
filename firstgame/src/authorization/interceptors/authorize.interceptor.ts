import {
  inject,
  Interceptor,
  Provider,
} from '@loopback/context';
import {Getter} from '@loopback/core';
import {MyAuthBindings,} from '../keys';
import {HttpErrors} from '@loopback/rest';
import {MyUserProfile,
        UserPermissionsFn,
        RequiredPermissions,} from '../types';
import {AuthenticationMetadata,AuthenticationBindings} from '@loopback/authentication';

export class AuthorizationInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject(MyAuthBindings.USER_PERMISSIONS)
    protected checkPermissons: UserPermissionsFn,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) {}

  value(): Interceptor {
    return async (invocationCtx, next) => {
      if (!this.metadata) return await next();
      const result = await next();

      const requiredPermissions = this.metadata.options as RequiredPermissions;
      const user = await this.getCurrentUser();
      if(!this.checkPermissons(user.permissions, requiredPermissions)){
        throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
      }
      return result;
    };
  }
}
