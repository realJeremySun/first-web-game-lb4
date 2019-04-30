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
import {Character, IdSet} from '../models';
import {CharacterRepository, IdSetRepository} from '../repositories';
import {v4 as uuid} from 'uuid';

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    //add following two lines
    @repository(IdSetRepository)
    public idSetRepository : IdSetRepository,
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
    /**
      let characterId = 1;
      while(await this.characterRepository.exists(characterId)){
        characterId ++;
      }
    */

      //generate unique characterId with in-memory database
      let characterId: string = uuid();
      while(await this.idSetRepository.exists(characterId)){
        characterId = uuid();
      }
      character.id = characterId;
      let uId : Partial<IdSet> = {};
      uId.id = characterId;
      await this.idSetRepository.create(uId);
      return await this.characterRepository.create(character);
  }

  /**
   * count character
   * @param where filter
   */
  @get('/characters/count', {
    responses: {
      '200': {
        description: 'Character model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Character)) where?: Where,
  ): Promise<Count> {
    return await this.characterRepository.count(where);
  }

  /**
   * show all character
   * @param where filter
   */
  @get('/characters', {
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
  async find(
    @param.query.object('filter', getFilterSchemaFor(Character)) filter?: Filter,
  ): Promise<Character[]> {
    return await this.characterRepository.find(filter);
  }

  /**
   * path all character
   * @param where filter
   */
  @patch('/characters', {
    responses: {
      '200': {
        description: 'Character PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() character: Character,
    @param.query.object('where', getWhereSchemaFor(Character)) where?: Where,
  ): Promise<Count> {
    return await this.characterRepository.updateAll(character, where);
  }

  /**
   * show character by id
   * @param id id
   */
  @get('/characters/{id}', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Character> {
    return await this.characterRepository.findById(id);
  }

  /**
   * patch character by id
   * @param where filter
   */
  @patch('/characters/{id}', {
    responses: {
      '204': {
        description: 'Character PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() character: Character,
  ): Promise<void> {
    await this.characterRepository.updateById(id, character);
  }

  /**
   * delete character by id
   * @param where filter
   */
  @del('/characters/{id}', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.characterRepository.deleteById(id);
  }
}
