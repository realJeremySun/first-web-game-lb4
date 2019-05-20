import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Character} from '../models';
import {CharacterRepository} from '../repositories';
//add
import {
  authorize,
  UserProfile,
  AuthorizationBindings,
  PermissionKey,
  CredentialsRequestBody,
  UserRequestBody,
  UserProfileSchema,
  Credentials,
  JWTStrategy,
} from '../authorization';
import {inject, Setter, Getter} from '@loopback/core';
import * as _ from 'lodash';
import {HttpErrors} from '@loopback/rest';

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    @inject(AuthorizationBindings.STRATEGY)
    public jwt: JWTStrategy,
    @inject.getter(AuthorizationBindings.CURRENT_USER)
    public getCurrentUser: Getter<UserProfile>,
  ) {}

  /**
   * create character
   * @param character character
   */
  @post('/characters', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  async create(
    @requestBody(UserRequestBody) character: Character
  ): Promise<Character> {
      //todo validateCredentials
      character.permissions = [PermissionKey.ViewOwnUser,
                               PermissionKey.CreateUser,
                               PermissionKey.UpdateOwnUser,
                               PermissionKey.DeleteOwnUser];
      if (await this.characterRepository.exists(character.email)){
        throw new HttpErrors.BadRequest(`This email already exists`);
      }
      else {
        const savedCharacter = await this.characterRepository.create(character);
        delete savedCharacter.password;
        return savedCharacter;
      }
  }

  //add
  /**
   * user login
   * @param credentials email and password
   */
  @post('/characters/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {},
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    //todo validateCredentials
    const token = await this.jwt.getAccessTokenForUser(
      credentials,
    );
    return {token};
  }

  @get('/characters/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authorize([PermissionKey.ViewOwnUser])
  async printCurrentUser(
  ): Promise<UserProfile> {
    return await this.getCurrentUser();
  }

  /**
   * show current character
   */
  @get('/characters', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  @authorize([PermissionKey.ViewOwnUser])
  async findById(
  ): Promise<Character> {
    const currentUser = await this.getCurrentUser();
    return await this.characterRepository.findById(currentUser.email);
  }

  /**
   * delete current character
   */
  @del('/characters', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  @authorize([PermissionKey.DeleteOwnUser])
  async deleteById(
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    //delete weapon, armor, and skill
    await this.characterRepository.weapon(currentUser.email).delete();
    await this.characterRepository.armor(currentUser.email).delete();
    await this.characterRepository.skill(currentUser.email).delete();
    ///
    await this.characterRepository.deleteById(currentUser.email);
  }
}
