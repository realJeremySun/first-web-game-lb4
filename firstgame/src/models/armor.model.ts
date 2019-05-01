import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Character} from './character.model';

@model({settings: {"strict":false}})
export class Armor extends Entity {
  @property({
    type: 'string',
    id: true,
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
    characterId: string;

  constructor(data?: Partial<Armor>) {
    super(data);
  }
}
