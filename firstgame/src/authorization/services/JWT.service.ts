import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {TokenServiceConstants} from '../keys';
import {MyUserProfile} from '../types';
import {repository} from '@loopback/repository';
import {CharacterRepository} from '../../repositories';
import * as _ from 'lodash';
import {toJSON} from '@loopback/testlab';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
  ) {}

  async verifyToken(token: string): Promise<MyUserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    const decryptedToken = await verifyAsync(token, TokenServiceConstants.TOKEN_SECRET_VALUE);
    let userProfile = _.pick(decryptedToken, ['id', 'email', 'password', 'name', `permissions`]);
    return userProfile;
  }

  async generateToken(userProfile: MyUserProfile): Promise<string> {
    const foundUser = await this.characterRepository.findOne({
      where: {email: userProfile.email},
    });
    if (!foundUser) {
      throw new HttpErrors['NotFound'](
        `User with email ${userProfile.email} not found.`,
      );
    }

    if (userProfile.password != foundUser.password) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    // Generate a JSON Web Token
    const currentUser = _.pick(toJSON(foundUser), ['email', 'password', 'name', 'permissions']);
    const token = await signAsync(currentUser, TokenServiceConstants.TOKEN_SECRET_VALUE, {
      expiresIn: TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    });

    return token;
  }
}
