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

  /**
   * get armor, weapon, and skill info
   * @param id character id
   */
  @get('/updatecharacter/{id}', {
    responses: {
      '200': {
        description: 'armor, weapon, and skill info',
        content: {},
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<any[]> {
    let res: any[] = ['no weapon', 'no armor', 'no skill'];
    try{res[0] = await this.characterRepository.weapon(id).get()}
    catch{console.log('@get /updatecharacter/{id}: no current weapon')};
    try{res[1] = await this.characterRepository.armor(id).get()}
    catch{console.log('@get /updatecharacter/{id}: no current armor')};
    try{res[2] = await this.characterRepository.skill(id).get()}
    catch{console.log('@get /updatecharacter/{id}: no current skill')};
    return res;
  }

  /**
   * update weapon for a given character
   * @param id character id
   * @param weapon weapon
   */
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
      let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      char.attack! -= oldWeapon.attack!;
      char.defence! -= oldWeapon.defence!;
      await this.characterRepository.weapon(id).delete();
    }
    catch(e){
      console.log('@patch /updatecharacter/{id}/weapon: no current weapon');
    }
    finally{
      await this.characterRepository.updateById(id, char);
      let weaponId = 1;
      while(await this.weaponRepository.exists(weaponId)){
        weaponId++;
      }
      weapon.id = weaponId;
      return await this.characterRepository.weapon(id).create(weapon);
    }
  }

  /**
   * update armor for a given character
   * @param id character id
   * @param armor armor
   */
  @patch('/updatecharacter/{id}/armor', {
    responses: {
      '200': {
        description: 'update armor',
        content: {'application/json': {schema: Armor}},
      },
    },
  })
  async updateArmor(
    @param.path.number('id') id: number,
    @requestBody() armor: Armor,
  ): Promise<Armor> {
    let char: Character = await this.characterRepository.findById(id);
    char.attack! += armor.attack;
    char.defence! += armor.defence;
    try{
      let oldArmor: Armor = await this.characterRepository.armor(id).get();
      char.attack! -= oldArmor.attack!;
      char.defence! -= oldArmor.defence!;
      await this.characterRepository.armor(id).delete();
    }
    catch(e){
      console.log('@patch /updatecharacter/{id}/armor: no current armor');
    }
    finally{
      await this.characterRepository.updateById(id, char);
      let armorId = 1;
      while(await this.armorRepository.exists(armorId)){
        armorId++;
      }
      armor.id = armorId;
      return await this.characterRepository.armor(id).create(armor);
    }
  }

  /**
   * update skill for a given character
   * @param id character id
   * @param skill skill
   */
  @patch('/updatecharacter/{id}/skill', {
    responses: {
      '200': {
        description: 'update skill',
        content: {'application/json': {schema: Skill}},
      },
    },
  })
  async updateSkill(
    @param.path.number('id') id: number,
    @requestBody() skill: Skill,
  ): Promise<Skill> {
    try{
      await this.characterRepository.skill(id).delete();
    }
    catch(e){
      console.log('@patch /updatecharacter/{id}/skill: no current skill');
    }
    finally{
      let skillId = 1;
      while(await this.skillRepository.exists(skillId)){
        skillId++;
      }
      skill.id = skillId;
      return await this.characterRepository.skill(id).create(skill);
    }
  }

  /**
   * delete weapon for a given character
   * @param id character id
   */
  @del('/updatecharacter/{id}/weapon', {
    responses: {
      '204': {
        description: 'DELETE Weapon',
      },
    },
  })
  async deleteWeapon(@param.path.number('id') id: number): Promise<void> {
    try{
      let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      await this.characterRepository.weapon(id).delete();
      let char: Character = await this.characterRepository.findById(id);
      char.attack! -= oldWeapon.attack!;
      char.defence! -= oldWeapon.defence!;
      await this.characterRepository.updateById(id, char);
    }
    catch(e){
      console.log('@del /updatecharacter/weapon: no current weapon');
    }
  }

  /**
   * delete armor for a given character
   * @param id character id
   */
  @del('/updatecharacter/{id}/armor', {
    responses: {
      '204': {
        description: 'DELETE Armor',
      },
    },
  })
  async deleteArmor(@param.path.number('id') id: number): Promise<void> {
    try{
      let oldArmor: Armor = await this.characterRepository.armor(id).get();
      await this.characterRepository.armor(id).delete();
      let char: Character = await this.characterRepository.findById(id);
      char.attack! -= oldArmor.attack!;
      char.defence! -= oldArmor.defence!;
      await this.characterRepository.updateById(id, char);
    }
    catch(e){
      console.log('@del /updatecharacter/armor: no current armor');
    }
  }

  /**
   * delete skill for a given character
   * @param id character id
   */
  @del('/updatecharacter/{id}/skill', {
    responses: {
      '204': {
        description: 'DELETE Skill',
      },
    },
  })
  async deleteSkill(@param.path.number('id') id: number): Promise<void> {
      await this.characterRepository.skill(id).delete();
  }
}
