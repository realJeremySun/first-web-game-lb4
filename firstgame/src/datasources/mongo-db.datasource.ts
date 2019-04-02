import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './mongo-db.datasource.json';

export class MongoDbDataSource extends juggler.DataSource {
  static dataSourceName = 'mongoDB';

  constructor(
    @inject('datasources.config.mongoDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
