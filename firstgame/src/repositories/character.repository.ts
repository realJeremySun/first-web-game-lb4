import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  juggler,
  repository} from '@loopback/repository';
import {Character, Armor, Weapon, Skill} from '../models';
import {MongoDbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {ArmorRepository} from './armor.repository';
import {WeaponRepository} from './weapon.repository';
import {SkillRepository} from './skill.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class CharacterRepository extends DefaultCrudRepository<
  Character,
  typeof Character.prototype.email
> {
  public armor: HasOneRepositoryFactory<
    Armor,
    typeof Character.prototype.email
  >;

  public weapon: HasOneRepositoryFactory<
    Weapon,
    typeof Character.prototype.email
  >;

  public skill: HasOneRepositoryFactory<
    Skill,
    typeof Character.prototype.email
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDbDataSource,
    @repository.getter(ArmorRepository)
    protected armorRepositoryGetter: Getter<ArmorRepository>,
    @repository.getter(WeaponRepository)
    protected weaponRepositoryGetter: Getter<WeaponRepository>,
    @repository.getter(SkillRepository)
    protected skillRepositoryGetter: Getter<SkillRepository>,
  ) {
    super(Character, dataSource);
    this.armor = this.createHasOneRepositoryFactoryFor('armor', armorRepositoryGetter);
    this.weapon = this.createHasOneRepositoryFactoryFor('weapon', weaponRepositoryGetter);
    this.skill = this.createHasOneRepositoryFactoryFor('skill', skillRepositoryGetter);
  }
}
