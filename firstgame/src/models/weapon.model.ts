import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Character} from './character.model';
import {v4 as uuid} from 'uuid';

@model({settings: {"strict":false}})
export class Weapon extends Entity {
  @property({
    type: 'string',
    id: true,
    //add this line
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
  defence: number;

  @belongsTo(() => Character)
    characterId: number;

  constructor(data?: Partial<Weapon>) {
    super(data);
  }
}
