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
import {inject, Setter, Getter} from '@loopback/core';
import * as _ from 'lodash';
import {HttpErrors} from '@loopback/rest';
import {
  MyUserProfile,
  MyAuthBindings,
  PermissionKey,
  CredentialsRequestBody,
  UserRequestBody,
  UserProfileSchema,
  JWTStrategy,
} from '../authorization';
import {authenticate,
        TokenService,
        AuthenticationBindings,
} from '@loopback/authentication';

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
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
    @requestBody(CredentialsRequestBody) myUserProfile: MyUserProfile,
  ): Promise<{token: string}> {

    //console.log(this.jwt);
    const token = await this.jwtService.generateToken(myUserProfile);
    //console.log((await this.getStrategy()).getAccessTokenForUser);
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
  @authenticate('jwt', [PermissionKey.ViewOwnUser])
  async printCurrentUser(
  ): Promise<MyUserProfile> {
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
  @authenticate('jwt', [PermissionKey.ViewOwnUser])
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
  @authenticate('jwt', [PermissionKey.DeleteOwnUser])
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
