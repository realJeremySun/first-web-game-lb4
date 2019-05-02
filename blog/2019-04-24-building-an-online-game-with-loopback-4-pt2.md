---
layout: post
title: Building an Online Game With LoopBack 4 (Part 2)
date: 2019-05-08
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt2/
categories:
  - How-To
  - LoopBack
published: false  
---

## Part 2: Generating Universally Unique ID and Managing Models Relationships

### Introduction

"Ready to build amazing things?" asks the LoopBack 4 homepage before encouraging you to try the open source framework.

"Try LoopBack 4 now."

In this series, I'm going to do exactly that! Join me as I create an API web game using LoopBack 4.

The main purpose of this series is to help you learn LoopBack 4 and how to use it to easily build your own API and web project. We'll do so by creating a new project I'm working on: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game should also allow multiple players to log in and play with their friends.

### Previously on Building an Online Game With LoopBack 4

In the previous episode, we have created a foundation for our project. Now we have some basic APIs to create, edit, and delete character.

Here is the previous episode:
* [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)

<!--more-->

### In this episode

First, we will use a third-party library in our LoopBack 4 project to generate unique character IDs. Then we will create `weapon`, `armor`, and `skill` models and build relationships between those models.

Loopback 4 support three relations for now:

* [HasMany](https://loopback.io/doc/en/lb4/HasMany-relation.html)
* [BelongsTo](https://loopback.io/doc/en/lb4/BelongsTo-relation.html)
* [HasOne](https://loopback.io/doc/en/lb4/hasOne-relation.html)

We will use `HasOne` in this episode.

You can check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part2) for the code of this episode.

### Universally Unique ID (UUID)

In the last episode, we used a while loop to generate continuous character IDs. However, that could be disaster in a real world application. Because fetching data from database is expensive. We don't want to do that hundreds times to just find a unique character ID. On the other hand, we don't really need continuous IDs, we only need unique IDs to distinguish characters. So we will use a better approach to generate universally unique IDs (UUID).

We are going to use a third-party library called [uuid](https://www.npmjs.com/package/uuid). Run `npm install --save @types/uuid` in your project root to install it.

Then go back to `src/models/character.model.ts` and change the type of `id` to string. Because [uuid](https://www.npmjs.com/package/uuid) can only generate string IDs.

```ts
  @property({
    //type: 'number',
    type: 'string',
    id: true,
  })
  //id?: number;
  id?: string;
```

Go to `src/controllers/character.controller.ts`. In the `get /characters/{id}` API, change the type of `id` to `string`.

```ts
  @get('/characters/{id}', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  async findById(
    //@param.path.number('id') id: number
    @param.path.string('id') id: string
  ): Promise<Character> {
    return await this.characterRepository.findById(id);
  }
```
Then do the same thing for `patch /characters/{id}`, `put /characters/{id}`, and `del /characters/{id}` APIs.

The [uuid](https://www.npmjs.com/package/uuid) can generate 36 digits string IDs. The implementation of uuid library is using some high distinction values (like DNS, local time, IP address etc) as the seed to randomly generate strings to reduce the chance of duplication. We can simply call the function `uuid()` to use this library.

Remember how did we generate character ID in last episode? We can do it in a very elegant way by using `default` keyword in `model`.

Open `src/controllers/character.controller.ts` and remove following code from `post /characters` API:

```ts
@post('/characters', {
  responses: {
    '200': {
      description: 'Character model instance',
      content: {'application/json': {schema: {'x-ts-type': Character}}},
    },
  },
})
async create(@requestBody() character: Character): Promise<Character> {
  /**remove this
  let characterId = 1;
  while(await this.characterRepository.exists(characterId)){
    characterId ++;
  }
  character.id = characterId;
  */
    return await this.characterRepository.create(character);
}
```

Open `src/models/character.model.ts`, and add follow import. This will import `uuid` so we can use it in our code.

```ts
import {v4 as uuid} from 'uuid';
```

Add following line to generate character ID as `default`:

```ts
  @property({
    type: 'string',
    id: true,
    //add this line
    default: () => uuid(),
  })
  id?: string;
```

That is how we generate UUID for `character`. We will use the same way to generate UUID for other models later.

### Model Relations

We will create `weapon`, `armor`, and `skill` models. One `character` may have one `weapon`, one `armor`, and one `skill`. It is [HasOne](https://loopback.io/doc/en/lb4/hasOne-relation.html) relationship.

![Models](/blog-assets/2019/05/my-first-api-p2-models.png)

In last episode, we built APIs for `character` in the order of model, datasource, repository, and controller. Now we will do it in the same way.

#### Model

First, we need to create `weapon` model. Is's very similar to what we did in last episode. Run `lb4 model` in project root.

```
wenbo:firstgame wenbo$ lb4 model
? Model class name: weapon
? Please select the model base class Entity (A persisted model with an ID)
? Allow additional (free-form) properties? No
Let's add a property to Weapon
Enter an empty property name when done

? Enter the property name: id
? Property type: string
? Is id the ID property? Yes
? Is it required?: No
? Default value [leave blank for none]:

Let's add another property to Weapon
Enter an empty property name when done

? Enter the property name: name
? Property type: string
? Is it required?: Yes
? Default value [leave blank for none]:

Let's add another property to Weapon
Enter an empty property name when done

? Enter the property name: attack
? Property type: number
? Is it required?: Yes
? Default value [leave blank for none]:

Let's add another property to Weapon
Enter an empty property name when done

? Enter the property name: defence
? Property type: number
? Is it required?: Yes
? Default value [leave blank for none]:
```
Do the same thing for `aromor` and `skill`.

Now let's add relationships for `character` to indicate that a `character` may has one `weapon`, `armor`, and `skill`. You can check [here](https://loopback.io/doc/en/lb4/Relations.html) for more details on model relationship. You can also take a look at the [TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial-model.html) to see how did it handle relationship.

Add following imports to the head of `character.model.ts`.

```ts
import {Armor} from './armor.model';
import {Weapon} from './weapon.model';
import {Skill} from './skill.model';
```

Then add following code into `character.model.ts` after those auto-generated properties. That means each `character` may have one `weapon`, `armor`, and `skill`.

```ts
  @hasOne(() => Armor)
  armor?: Armor;

  @hasOne(() => Weapon)
  weapon?: Weapon;

  @hasOne(() => Skill)
  skill?: Skill;
```

Next, we need to add relationship for `weapon.model.ts` as well. Add this import to the head.

```ts
import {Character} from './character.model';
import {v4 as uuid} from 'uuid';
```

Then add following code after those auto-generated properties.

```ts
  @belongsTo(() => Character)
    characterId: string;
```

This give `weapon` another property `characterId` means which character does this weapon belong to. It's similar to the foreign key in relational database.

Don't forget to generate UUID for `weapon`:

```ts
@property({
  type: 'string',
  id: true,
  //add this line
  default: () => uuid(),
})
id?: string;
```

Do the same thing for `armor.model.ts` and `skill.model.ts`. And our models are all set.

You can check my code for all models at [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part2/firstgame/src/models).

#### Datasource

No need to create new datasource. We can use the MongoDB we created in last episode.

#### Repository

Run `lb4 repository` in your project root.

```
? Please select the datasource MongoDatasource
? Select the model(s) you want to generate a repository Weapon
? Please select the repository base class DefaultCrudRepository (Legacy juggler bridge)
   create src/repositories/weapon.repository.ts
   update src/repositories/index.ts
```

Then create repositories for `armor` and `skill` in the same way.

Let's add relations for `character.repository.ts` first. Add following imports:

```ts
import {HasOneRepositoryFactory, juggler, repository} from '@loopback/repository';
import {Armor, Weapon, Skill} from '../models';
import {Getter} from '@loopback/core';
import {ArmorRepository} from './armor.repository';
import {WeaponRepository} from './weapon.repository';
import {SkillRepository} from './skill.repository';
```

Add follow code before ther constructor:
```ts
  public armor: HasOneRepositoryFactory<
    Armor,
    typeof Character.prototype.id
  >;

  public weapon: HasOneRepositoryFactory<
    Weapon,
    typeof Character.prototype.id
  >;

  public skill: HasOneRepositoryFactory<
    Skill,
    typeof Character.prototype.id
  >;
```

This means `character` may has one `weapon`, `armor`, and `skill` ID. Then we are able to find the correct entity by that ID.

Then change the constructor to this:

```ts
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
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
```

This can help you to assign `weapon`, `armor`, and `skill` to `character.`

On the other hand, what we need to do for the `weapon.repository.ts` is kind of the same. Instead of `HasOneRepositoryFactory`, we add `BelongsToAccessor` before constructor.

```ts
  public readonly character: BelongsToAccessor<
    Character,
    typeof Weapon.prototype.id
  >;
```

And change the constructor to this:

```ts
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('CharacterRepository')
    protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Weapon, dataSource);
    this.character = this.createBelongsToAccessorFor('character',characterRepositoryGetter);
  }
```

Don't forget to add imports at the head of `weapon.repository.ts`.

```ts
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {Character} from '../models';
import {inject} from '@loopback/core';
import {CharacterRepository} from './character.repository';
```
Then do the same thing for `armor.repository.ts` and `skill.repository.ts`. And our repositories are all set.

You can check my code for all repositories at [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part2/firstgame/src/repositories).

#### Controller

We are not going to cover controller today. Because there is a lot of work to do in controller and I will have a whole episode for that.

### Applying This to Your Own Project

In this episode, we used a third-party library to generate UUID. You can easily use any external library in you LoopBack 4 project. We also used two different databases. You can always choose different databases based on your project need.

On the other hand, we built relations between `character`, `weapon`, `aromr`, and `skill`. In a real world application, most of entities have relationship between each other. You can use LoopBack 4 to easily manage that in your project.

### What's Next?

In next episode, we will do a lot of coding in `controller` to create `weapon`, `armor`, `skill` and equip a character with them. Controller is where you achieve most of your project functions and business logic. I am sure we will have a lot of fun in next episode.

In the meantime, you can learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
