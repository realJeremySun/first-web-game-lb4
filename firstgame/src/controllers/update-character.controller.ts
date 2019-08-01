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
} from '@loopback/rest';
import {Character, Armor, Weapon, Skill} from '../models';
import {
  CharacterRepository,
  WeaponRepository,
  ArmorRepository,
  SkillRepository,
} from '../repositories';
//add
import {inject, Getter} from '@loopback/core';
import {MyUserProfile, PermissionKey} from '../authorization';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';

export class UpdateCharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
    @repository(WeaponRepository)
    public weaponRepository: WeaponRepository,
    @repository(ArmorRepository)
    public armorRepository: ArmorRepository,
    @repository(SkillRepository)
    public skillRepository: SkillRepository,
    //
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) {}

  /**
   * get armor, weapon, and skill info for current user
   */
  @get('/updatecharacter', {
    responses: {
      '200': {
        description: 'armor, weapon, and skill info',
        content: {},
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async findById(): Promise<any[]> {
    const currentUser = await this.getCurrentUser();
    let res: any[] = ['no weapon', 'no armor', 'no skill'];

    let wfilter: Filter<Weapon> = {where: {characterId: currentUser.email}};
    if ((await this.weaponRepository.find(wfilter))[0] != undefined) {
      res[0] = await this.characterRepository.weapon(currentUser.email).get();
    }
    let afilter: Filter<Armor> = {where: {characterId: currentUser.email}};
    if ((await this.armorRepository.find(afilter))[0] != undefined) {
      res[1] = await this.characterRepository.armor(currentUser.email).get();
    }
    let sfilter: Filter<Skill> = {where: {characterId: currentUser.email}};
    if ((await this.skillRepository.find(sfilter))[0] != undefined) {
      res[2] = await this.characterRepository.skill(currentUser.email).get();
    }
    return res;
  }

  /**
   * levelup for a current character
   */
  @patch('/updatecharacter/levelup', {
    responses: {
      '200': {
        description: 'level up',
        content: {'application/json': {schema: Character}},
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async levelUp(): Promise<Character> {
    const currentUser = await this.getCurrentUser();
    let char: Character = await this.characterRepository.findById(
      currentUser.email,
    );
    let levels: number = 0;
    while (char.currentExp! >= char.nextLevelExp!) {
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
    await this.characterRepository!.updateById(currentUser.email, char);
    return char;
  }

  /**
   * update weapon for current character
   * @param weapon weapon
   */
  @patch('/updatecharacter/weapon', {
    responses: {
      '200': {
        description: 'update weapon',
        content: {'application/json': {schema: Weapon}},
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async updateWeapon(@requestBody() weapon: Weapon): Promise<Weapon> {
    const currentUser = await this.getCurrentUser();
    //equip new weapon
    let char: Character = await this.characterRepository.findById(
      currentUser.email,
    );
    char.attack! += weapon.attack;
    char.defence! += weapon.defence;

    //unequip old weapon
    let filter: Filter<Weapon> = {where: {characterId: currentUser.email}};
    if ((await this.weaponRepository.find(filter))[0] != undefined) {
      let oldWeapon: Weapon = await this.characterRepository
        .weapon(currentUser.email)
        .get();
      char.attack! -= oldWeapon.attack;
      char.defence! -= oldWeapon.defence;
      await this.characterRepository.weapon(currentUser.email).delete();
    }
    await this.characterRepository.updateById(currentUser.email, char);
    return await this.characterRepository
      .weapon(currentUser.email)
      .create(weapon);
  }

  /**
   * update armor for current character
   * @param armor armor
   */
  @patch('/updatecharacter/armor', {
    responses: {
      '200': {
        description: 'update armor',
        content: {'application/json': {schema: Armor}},
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async updateArmor(@requestBody() armor: Armor): Promise<Armor> {
    const currentUser = await this.getCurrentUser();
    //equip new armor
    let char: Character = await this.characterRepository.findById(
      currentUser.email,
    );
    char.attack! += armor.attack;
    char.defence! += armor.defence;

    //unequip old armor
    let filter: Filter<Armor> = {where: {characterId: currentUser.email}};
    if ((await this.armorRepository.find(filter))[0] != undefined) {
      let oldArmor: Armor = await this.characterRepository
        .armor(currentUser.email)
        .get();
      char.attack! -= oldArmor.attack;
      char.defence! -= oldArmor.defence;
      await this.characterRepository.armor(currentUser.email).delete();
    }
    await this.characterRepository.updateById(currentUser.email, char);
    return await this.characterRepository
      .armor(currentUser.email)
      .create(armor);
  }

  /**
   * update skill for current character
   * @param skill skill
   */
  @patch('/updatecharacter/skill', {
    responses: {
      '200': {
        description: 'update skill',
        content: {'application/json': {schema: Skill}},
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async updateSkill(@requestBody() skill: Skill): Promise<Skill> {
    const currentUser = await this.getCurrentUser();
    await this.characterRepository.skill(currentUser.email).delete();
    return await this.characterRepository
      .skill(currentUser.email)
      .create(skill);
  }

  /**
   * delete weapon for current character
   */
  @del('/updatecharacter/weapon', {
    responses: {
      '204': {
        description: 'DELETE Weapon',
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async deleteWeapon(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    //unequip old weapon
    let filter: Filter<Weapon> = {where: {characterId: currentUser.email}};
    if ((await this.weaponRepository.find(filter))[0] != undefined) {
      let oldWeapon: Weapon = await this.characterRepository
        .weapon(currentUser.email)
        .get();
      let char: Character = await this.characterRepository.findById(
        currentUser.email,
      );
      char.attack! -= oldWeapon.attack;
      char.defence! -= oldWeapon.defence;
      await this.characterRepository.weapon(currentUser.email).delete();
      await this.characterRepository.updateById(currentUser.email, char);
    }
  }

  /**
   * delete armor for current character
   */
  @del('/updatecharacter/armor', {
    responses: {
      '204': {
        description: 'DELETE Armor',
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async deleteArmor(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    //unequip old armor
    let filter: Filter<Armor> = {where: {characterId: currentUser.email}};
    if ((await this.armorRepository.find(filter))[0] != undefined) {
      let oldArmor: Armor = await this.characterRepository
        .armor(currentUser.email)
        .get();
      let char: Character = await this.characterRepository.findById(
        currentUser.email,
      );
      char.attack! -= oldArmor.attack;
      char.defence! -= oldArmor.defence;
      await this.characterRepository.armor(currentUser.email).delete();
      await this.characterRepository.updateById(currentUser.email, char);
    }
  }

  /**
   * delete skill for current character
   */
  @del('/updatecharacter/skill', {
    responses: {
      '204': {
        description: 'DELETE Skill',
      },
    },
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser, PermissionKey.UpdateOwnUser],
  })
  async deleteSkill(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    await this.characterRepository.skill(currentUser.email).delete();
  }
}
