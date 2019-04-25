import {Entity, model, property} from '@loopback/repository';

//@model({settings: {"strict":false}})
@model()
export class Character extends Entity {
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
    default: 1,
  })
  level?: number;

  @property({
    type: 'number',
    default: 100,
  })
  nextLevelExp?: number;

  @property({
    type: 'number',
    default: 0,
  })
  currentExp?: number;

  @property({
    type: 'number',
    default: 100,
  })
  maxHealth?: number;

  @property({
    type: 'number',
    default: 100,
  })
  currentHealth?: number;

  @property({
    type: 'number',
    default: 50,
  })
  maxMana?: number;

  @property({
    type: 'number',
    default: 50,
  })
  currentMana?: number;

  @property({
    type: 'number',
    default: 20,
  })
  attack?: number;

  @property({
    type: 'number',
    default: 5,
  })
  defence?: number;

  constructor(data?: Partial<Character>) {
    super(data);
  }
}
