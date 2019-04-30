import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './id-set.datasource.json';

export class IdSetDataSource extends juggler.DataSource {
  static dataSourceName = 'idSet';

  constructor(
    @inject('datasources.config.idSet', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
