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

export class AdminController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    //add
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService,
  ) {}

  /**
   * count character
   * @param where filter
   */
  @get('/admin/characters/count', {
    responses: {
      '200': {
        description: 'Character model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @inject('authentication.currentUser') currentUser: UserProfile,
    @param.query.object('where', getWhereSchemaFor(Character)) where?: Where,
  ): Promise<Count> {
    if((await this.characterRepository.findById(currentUser.email)).userType != 'admin'){
      throw new HttpErrors.Unauthorized('You are not admin');
    }
    return await this.characterRepository.count(where);
  }

  /**
   * show all character
   * @param where filter
   */
  @get('/admin/characters', {
    responses: {
      '200': {
        description: 'Array of Character model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Character}},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @inject('authentication.currentUser') currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Character)) filter?: Filter,
  ): Promise<Character[]> {
    if((await this.characterRepository.findById(currentUser.email)).userType != 'admin'){
      throw new HttpErrors.Unauthorized('You are not admin');
    }
    return await this.characterRepository.find(filter);
  }

  /**
   * path all character
   * @param where filter
   */
  @patch('/admin/characters', {
    responses: {
      '200': {
        description: 'Character PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @inject('authentication.currentUser') currentUser: UserProfile,
    @requestBody() character: Character,
    @param.query.object('where', getWhereSchemaFor(Character)) where?: Where,
  ): Promise<Count> {
    if((await this.characterRepository.findById(currentUser.email)).userType != 'admin'){
      throw new HttpErrors.Unauthorized('You are not admin');
    }
    return await this.characterRepository.updateAll(character, where);
  }

  /**
   * show character by email
   * @param email email
   */
  @get('/admin/characters/{email}', {
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
    @param.path.string('email') email: string
  ): Promise<Character> {
    if((await this.characterRepository.findById(currentUser.email)).userType != 'admin'){
      throw new HttpErrors.Unauthorized('You are not admin');
    }
    return await this.characterRepository.findById(email);
  }

  /**
   * patch character by email
   * @param where filter
   */
  @patch('/admin/characters/{email}', {
    responses: {
      '204': {
        description: 'Character PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('email') email: string,
    @requestBody() character: Character,
  ): Promise<void> {
    if((await this.characterRepository.findById(currentUser.email)).userType != 'admin'){
      throw new HttpErrors.Unauthorized('You are not admin');
    }
    await this.characterRepository.updateById(email, character);
  }

  /**
   * delete character by email
   */
  @del('/admin/characters/{email}', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('email') email: string
  ): Promise<void> {
    if((await this.characterRepository.findById(currentUser.email)).userType != 'admin'){
      throw new HttpErrors.Unauthorized('You are not admin');
    }
    //delete weapon, armor, and skill
    await this.characterRepository.weapon(email).delete();
    await this.characterRepository.armor(email).delete();
    await this.characterRepository.skill(email).delete();
    ///
    await this.characterRepository.deleteById(email);
  }
}
