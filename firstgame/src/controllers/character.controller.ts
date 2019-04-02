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

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
  ) {}

  @post('/characters', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  async create(@requestBody() character: Character): Promise<Character> {
    //Auto incressment for id
    character.id = (await this.characterRepository.count()).count+1;
    return await this.characterRepository.create(character);
  }

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

  @get('/characters/{id}', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Character> {
    return await this.characterRepository.findById(id);
  }

  @patch('/characters/{id}', {
    responses: {
      '204': {
        description: 'Character PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() character: Character,
  ): Promise<void> {
    await this.characterRepository.updateById(id, character);
  }

  @put('/characters/{id}', {
    responses: {
      '204': {
        description: 'Character PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() character: Character,
  ): Promise<void> {
    await this.characterRepository.replaceById(id, character);
  }

  @del('/characters/{id}', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.characterRepository.deleteById(id);
  }
}
