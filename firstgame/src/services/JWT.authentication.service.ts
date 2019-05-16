// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as _ from 'lodash';
import {Credentials, CharacterRepository} from '../repositories/character.repository';
import {toJSON} from '@loopback/testlab';
import {promisify} from 'util';
import * as isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {JWTAuthenticationBindings} from '../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

/**
 * Constant for JWT secret string
 */
export const JWT_SECRET = 'jwtsecret';

/**
 * A JWT authentication service that could be reused by
 * different clients. Usually it can be injected in the
 * controller constructor.
 * It provides services that handle the logics between the controller layer
 * and the repository layer.
 */
export class JWTAuthenticationService {
  constructor(
    @repository(CharacterRepository) public characterRepository: CharacterRepository,
    @inject(JWTAuthenticationBindings.SECRET)
    public jwt_secret: string
  ) {}

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

    const currentUser = _.pick(toJSON(foundUser), ['id', 'email', 'name']);
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
    let user = _.pick(decoded, ['id', 'email', 'name', `userType`]);
    (user as UserProfile).name = user.name;
    (user as UserProfile).userType = user.userType;
    //delete user.name;
    return user;
  }
}

/**
 * To be removed in story
 * https://github.com/strongloop/loopback4-example-shopping/issues/39
 * @param credentials
 */
export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}
