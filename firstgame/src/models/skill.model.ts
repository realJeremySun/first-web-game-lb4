import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Character} from './character.model';

@model({settings: {"strict":false}})
export class Skill extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

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
    characterId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Skill>) {
    super(data);
  }
}
