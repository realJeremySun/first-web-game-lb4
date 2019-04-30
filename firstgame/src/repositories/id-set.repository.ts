import {DefaultCrudRepository} from '@loopback/repository';
import {IdSet} from '../models';
import {IdSetDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IdSetRepository extends DefaultCrudRepository<
  IdSet,
  typeof IdSet.prototype.id
> {
  constructor(
    @inject('datasources.idSet') dataSource: IdSetDataSource,
  ) {
    super(IdSet, dataSource);
  }
}
