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
  authenticate,
  UserProfile,
  AuthenticationBindings,
} from '@loopback/authentication';
import {inject, Setter} from '@loopback/core';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from '../models/character.model';
import {Credentials} from '../repositories/character.repository';
import {JWTAuthenticationService} from '../services/JWT.authentication.service';
import {JWTAuthenticationBindings} from '../keys';
import {validateCredentials} from '../services/JWT.authentication.service';
import * as _ from 'lodash';
import {HttpErrors} from '@loopback/rest';

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService,
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
  async create(@requestBody() character: Character): Promise<Character> {
      //add
      character.userType = 'regular';
      validateCredentials(_.pick(character, ['email', 'password', 'userType']) as Credentials);
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
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    validateCredentials(credentials);
    const token = await this.jwtAuthenticationService.getAccessTokenForUser(
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
  @authenticate('jwt')
  async printCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<UserProfile> {
    return currentUser;
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
  @authenticate('jwt')
  async findById(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<Character> {
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
  @authenticate('jwt')
  async deleteById(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<void> {
    //delete weapon, armor, and skill
    await this.characterRepository.weapon(currentUser.email).delete();
    await this.characterRepository.armor(currentUser.email).delete();
    await this.characterRepository.skill(currentUser.email).delete();
    ///
    await this.characterRepository.deleteById(currentUser.email);
  }
}
