import {
  DefaultCrudRepository,
  BelongsToAccessor,
  juggler,
  repository} from '@loopback/repository';
import {Skill, Character} from '../models';
import {MongoDbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {CharacterRepository} from './character.repository';

export class SkillRepository extends DefaultCrudRepository<
  Skill,
  typeof Skill.prototype.id
> {
  public readonly character: BelongsToAccessor<
    Character,
    typeof Skill.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDbDataSource,
    @repository.getter('CharacterRepository')
    protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Skill, dataSource);

    this.character = this.createBelongsToAccessorFor('character',characterRepositoryGetter);
  }
}
