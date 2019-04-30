import {Entity, model, property} from '@loopback/repository';

@model()
export class IdSet extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;


  constructor(data?: Partial<IdSet>) {
    super(data);
  }
}
