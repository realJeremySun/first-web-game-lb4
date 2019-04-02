import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Character, Armor, Weapon, Skill} from '../models';
import {
  CharacterRepository,
  WeaponRepository,
  ArmorRepository,
  SkillRepository
} from '../repositories';

export class UpdateCharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    @repository(WeaponRepository)
    public weaponRepository : CharacterRepository,
    @repository(ArmorRepository)
    public armorRepository : CharacterRepository,
    @repository(SkillRepository)
    public skillRepository : CharacterRepository,
  ) {}

  //get armor, weapon, and skill info
  @get('/updatecharacter/{id}', {
    responses: {
      '200': {
        description: 'armor, weapon, and skill info',
        content: {
//          'application/json': {schema: Weapon},
//          'application/json': {schema: Armor},
//          'application/json': {schema: Skill}
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Weapon> {
    return await this.characterRepository.weapon(id).get();
  }

  //update weapon
  @patch('/updatecharacter/{id}/weapon', {
    responses: {
      '200': {
        description: 'update weapon',
        content: {'application/json': {schema: Weapon}},
      },
    },
  })
  async updateWeapon(
    @param.path.number('id') id: number,
    @requestBody() weapon: Weapon,
  ): Promise<Weapon> {
    let char: Character = await this.characterRepository.findById(id);
    char.attack! += weapon.attack;
    char.defence! += weapon.defence;
    try{
      console.log("0");
      let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      console.log("1");
      char.attack! -= oldWeapon.attack!;
      console.log("2");
      char.defence! -= oldWeapon.defence!;
      console.log("3");
      await this.characterRepository.weapon(id).delete();
      console.log("4");
    }
    catch(e){
      console.log(e);
      //console.log('no current weapon');
    }
    finally{
      await this.characterRepository.updateById(id, char);
      weapon.id = (await this.weaponRepository.count()).count+1;
      return await this.characterRepository.weapon(id).create(weapon);
    }
  }

  @del('/updatecharacter/{id}', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.characterRepository.deleteById(id);
  }
}
