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
import {v4 as uuid} from 'uuid';

export class UpdateCharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,

    //add following lines
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
    @param.path.string('id') id: string,
  ): Promise<any[]> {
    let res: any[] = ['no weapon', 'no armor', 'no skill'];

    let filter: Filter = {where:{"characterId":id}};
    if((await this.weaponRepository.find(filter))[0] != undefined){
      res[0] = await this.characterRepository.weapon(id).get()
    }
    if((await this.armorRepository.find(filter))[0] != undefined){
      res[1] = await this.characterRepository.armor(id).get()
    }
    if((await this.skillRepository.find(filter))[0] != undefined){
      res[2] = await this.characterRepository.skill(id).get()
    }

    return res;
  }

  /**
   * levelup for a given character
   * @param id character id
   */
  @patch('/updatecharacter/{id}/levelup', {
    responses: {
      '200': {
        description: 'level up',
        content: {'application/json': {schema: Character}},
      },
    },
  })
  async levelUp(@param.path.string('id') id: string): Promise<Character> {
      let char: Character = await this.characterRepository.findById(id);
      let levels: number = 0;
      while(char.currentExp! >= char.nextLevelExp!){
        levels++;
        char.currentExp! -= char.nextLevelExp!;
        char.nextLevelExp! += 100;
      }
      char.level! += levels;
      char.maxHealth! += 10 * levels;
      char.currentHealth! = char.maxHealth!;
      char.maxMana! += 5 * levels;
      char.currentMana! = char.maxMana!;
      char.attack! += 3 * levels;
      char.defence! += levels;
      await this.characterRepository!.updateById(id, char);
      return char;
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
    @param.path.string('id') id: string,
    @requestBody() weapon: Weapon,
  ): Promise<Weapon> {
    //equip new weapon
    let char: Character = await this.characterRepository.findById(id);
    char.attack! += weapon.attack;
    char.defence! += weapon.defence;

    //unequip old weapon
    let filter: Filter = {where:{"characterId":id}};
    if((await this.weaponRepository.find(filter))[0] != undefined){
      let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      char.attack! -= oldWeapon.attack!;
      char.defence! -= oldWeapon.defence!;
      await this.characterRepository.weapon(id).delete();
    }
    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.weapon(id).create(weapon);
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
    @param.path.string('id') id: string,
    @requestBody() armor: Armor,
  ): Promise<Armor> {
    //equip new armor
    let char: Character = await this.characterRepository.findById(id);
    char.attack! += armor.attack;
    char.defence! += armor.defence;

    //unequip old armor
    let filter: Filter = {where:{"characterId":id}};
    if((await this.armorRepository.find(filter))[0] != undefined){
      let oldArmor: Armor = await this.characterRepository.armor(id).get();
      char.attack! -= oldArmor.attack!;
      char.defence! -= oldArmor.defence!;
      await this.characterRepository.armor(id).delete();
    }
    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.armor(id).create(armor);
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
    @param.path.string('id') id: string,
    @requestBody() skill: Skill,
  ): Promise<Skill> {

    //unequip old armor
    let filter: Filter = {where:{"characterId":id}};
    if((await this.skillRepository.find(filter))[0] != undefined){
      await this.characterRepository.skill(id).delete();
    }
    return await this.characterRepository.skill(id).create(skill);
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
  async deleteWeapon(
    @param.path.string('id') id: string
  ): Promise<void> {
    //unequip old weapon
    let filter: Filter = {where:{"characterId":id}};
    if((await this.weaponRepository.find(filter))[0] != undefined){
      let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      let char: Character = await this.characterRepository.findById(id);
      char.attack! -= oldWeapon.attack!;
      char.defence! -= oldWeapon.defence!;
      await this.characterRepository.weapon(id).delete();
      await this.characterRepository.updateById(id, char);
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
  async deleteArmor(
    @param.path.string('id') id: string
  ): Promise<void> {
    //unequip old armor
    let filter: Filter = {where:{"characterId":id}};
    if((await this.armorRepository.find(filter))[0] != undefined){
      let oldArmor: Armor = await this.characterRepository.armor(id).get();
      let char: Character = await this.characterRepository.findById(id);
      char.attack! -= oldArmor.attack!;
      char.defence! -= oldArmor.defence!;
      await this.characterRepository.armor(id).delete();
      await this.characterRepository.updateById(id, char);
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
  async deleteSkill(
    @param.path.string('id') id: string
  ): Promise<void> {
      await this.characterRepository.skill(id).delete();
  }
}
