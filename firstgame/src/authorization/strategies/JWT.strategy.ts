import {Request, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {AuthenticationStrategy,
        AuthenticationMetadata,
        AuthenticationBindings,
        TokenService,
} from '@loopback/authentication';
import {MyUserProfile,
        UserPermissionsFn,} from '../types';
import {MyAuthBindings,} from '../keys';
import {PermissionKey} from '../permission-key';

//export const JWT_SECRET = 'jwtsecret';

export class JWTStrategy implements AuthenticationStrategy{
  name: string = 'jwt';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject(MyAuthBindings.USER_PERMISSIONS)
    protected checkPermissons: UserPermissionsFn,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    protected tokenService: TokenService,
  ) {}
  async authenticate(request: Request): Promise<MyUserProfile | undefined> {
    let token = request.query.access_token || request.headers['authentication'];
    if (!token) throw new HttpErrors.Unauthorized('No access token found!');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    try {
      const user = await this.tokenService.verifyToken(token);
      const requiredPermissions = this.metadata.options;
      if(!this.checkPermissons(
        (user as MyUserProfile).permissions ,
        requiredPermissions as PermissionKey[]
      )){
        throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
      }
      return user as MyUserProfile;
    } catch (err) {
      Object.assign(err, {
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      });
      throw err;
    }
  }
}
