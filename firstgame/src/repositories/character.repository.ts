import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  juggler,
  repository} from '@loopback/repository';
import {Character} from '../models';
import {MongoDbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';

export class CharacterRepository extends DefaultCrudRepository<
  Character,
  typeof Character.prototype.id
> {

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Character, dataSource);
  }
}
