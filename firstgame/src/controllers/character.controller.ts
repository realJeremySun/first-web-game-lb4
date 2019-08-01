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
import {inject, Getter} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  MyUserProfile,
  Credential,
  MyAuthBindings,
  PermissionKey,
  CredentialsRequestBody,
  UserRequestBody,
  UserProfileSchema,
  JWTService,
} from '../authorization';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
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
    @requestBody(UserRequestBody) character: Character,
  ): Promise<Character> {
    character.permissions = [
      PermissionKey.ViewOwnUser,
      PermissionKey.CreateUser,
      PermissionKey.UpdateOwnUser,
      PermissionKey.DeleteOwnUser,
    ];
    if (await this.characterRepository.exists(character.email)) {
      throw new HttpErrors.BadRequest(`This email already exists`);
    } else {
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
    @requestBody(CredentialsRequestBody) credential: Credential,
  ): Promise<{token: string}> {
    const token = await this.jwtService.getToken(credential);
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
  @authenticate('jwt', {required: [PermissionKey.ViewOwnUser]})
  async printCurrentUser(): Promise<MyUserProfile> {
    return this.getCurrentUser();
  }

  /**
   * show current character
   */
  @patch('/characters/name', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  @authenticate('jwt', {required: [PermissionKey.ViewOwnUser]})
  async changeName(@requestBody() newName: Partial<Character>): Promise<void> {
    const currentUser = await this.getCurrentUser();
    let char: Character = await this.characterRepository.findById(
      currentUser.email,
    );
    char.name = newName.name!;
    return await this.characterRepository.updateById(currentUser.email, char);
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
  @authenticate('jwt', {required: [PermissionKey.ViewOwnUser]})
  async findById(): Promise<Character> {
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
  @authenticate('jwt', {required: [PermissionKey.DeleteOwnUser]})
  async deleteById(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    //delete weapon, armor, and skill
    await this.characterRepository.weapon(currentUser.email).delete();
    await this.characterRepository.armor(currentUser.email).delete();
    await this.characterRepository.skill(currentUser.email).delete();
    ///
    await this.characterRepository.deleteById(currentUser.email);
  }
}
