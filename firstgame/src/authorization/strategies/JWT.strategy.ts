// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT



import {Request, HttpErrors} from '@loopback/rest';

import {inject} from '@loopback/core';
import * as _ from 'lodash';
import {toJSON} from '@loopback/testlab';
import {promisify} from 'util';
import * as isemail from 'isemail';

import {AuthenticationStrategy,
        AuthenticationMetadata,
        AuthenticationBindings,
        TokenService,
} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {CharacterRepository} from '../../repositories';
import {MyUserProfile,
        UserPermissionsFn,} from '../types';
import {MyAuthBindings,} from '../keys';
import {PermissionKey} from '../permission-key';
//import {JWTService} from '../services/JWT.service';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export const JWT_SECRET = 'jwtsecret';

export class JWTStrategy implements AuthenticationStrategy{
  name: string = 'jwt';

  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
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
