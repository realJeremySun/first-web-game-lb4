import {
  DefaultCrudRepository,
  BelongsToAccessor,
  juggler,
  repository} from '@loopback/repository';
import {Weapon, Character} from '../models';
import {MongoDbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {CharacterRepository} from './character.repository';

export class WeaponRepository extends DefaultCrudRepository<
  Weapon,
  typeof Weapon.prototype.id
> {
  public readonly character: BelongsToAccessor<
    Character,
    typeof Weapon.prototype.id
  >;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('CharacterRepository')
    protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Weapon, dataSource);

    this.character = this.createBelongsToAccessorFor('character',characterRepositoryGetter);
  }
}
