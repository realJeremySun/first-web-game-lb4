import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Character} from './character.model';
import {v4 as uuid} from 'uuid';

@model({settings: {"strict":false}})
export class Skill extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  attack: number;

  @property({
    type: 'number',
    required: true,
  })
  cost: number;

  @belongsTo(() => Character)
    characterId: string;

  constructor(data?: Partial<Skill>) {
    super(data);
  }
}
