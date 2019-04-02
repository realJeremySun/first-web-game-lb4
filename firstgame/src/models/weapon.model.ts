import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Character} from './character.model';

@model({settings: {"strict":false}})
export class Weapon extends Entity {
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
  defence: number;

  @belongsTo(() => Character)
    characterId: number;

  constructor(data?: Partial<Weapon>) {
    super(data);
  }
}
