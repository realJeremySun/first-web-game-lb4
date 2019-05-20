// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthorizationStrategy} from '../types';
import {CharacterRepository} from '../../repositories';
import {repository} from '@loopback/repository';
import {Request, HttpErrors} from '@loopback/rest';
import {UserProfile, Credentials, AuthorizationMetadata, UserPermissionsFn} from '../types';
import {inject} from '@loopback/core';
import * as _ from 'lodash';
import {toJSON} from '@loopback/testlab';
import {promisify} from 'util';
import * as isemail from 'isemail';
import {AuthorizationBindings} from '../keys';
import {PermissionKey} from '../permission-key';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export const JWT_SECRET = 'jwtsecret';

export class JWTStrategy implements AuthorizationStrategy{
  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
    @inject(AuthorizationBindings.SECRET)
    public jwt_secret: string,
    @inject(AuthorizationBindings.METADATA)
    public metadata: AuthorizationMetadata,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    protected checkPermissons: UserPermissionsFn,
  ) {}
  async authorize(request: Request): Promise<UserProfile | undefined> {
    let token = request.query.access_token || request.headers['authorization'];
    if (!token) throw new HttpErrors.Unauthorized('No access token found!');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    try {
      const user = await this.decodeAccessToken(token);
      const requiredPermissions = this.metadata.permissions;
      if(!this.checkPermissons(
        user.permissions,
        requiredPermissions as PermissionKey[]
      )){
        throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
      }
      return user;
    } catch (err) {
      Object.assign(err, {
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      });
      throw err;
    }
  }

  /**
   * A function that retrieves the user with given credentials. Generates
   * JWT access token using user profile as payload if user found.
   *
   * Usually a request's corresponding controller function filters the credential
   * fields and invokes this function.
   *
   * @param credentials The user credentials including email and password.
   */
  async getAccessTokenForUser(credentials: Credentials): Promise<string> {
    const foundUser = await this.characterRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors['NotFound'](
        `User with email ${credentials.email} not found.`,
      );
    }

    if (credentials.password != foundUser.password) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    const currentUser = _.pick(toJSON(foundUser), ['email', 'name', 'permissions']);
    // Generate user token using JWT
    const token = await signAsync(currentUser, this.jwt_secret, {
      expiresIn: 300,
    });

    return token;
  }

  /**
   * Decodes the user's information from a valid JWT access token.
   * Then generate a `UserProfile` instance as the returned user.
   *
   * @param token A JWT access token.
   */
  async decodeAccessToken(token: string): Promise<UserProfile> {
    const decoded = await verifyAsync(token, this.jwt_secret);
    let user = _.pick(decoded, ['email', 'name', `permissions`]);
    //(user as UserProfile).name = user.name;
    //delete user.name;
    return user;
  }
}
