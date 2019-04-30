---
layout: post
title: Building an Online Game With LoopBack 4 (Part 2)
date: 2019-04-24
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt2/
categories:
  - How-To
  - LoopBack
published: false  
---

## Part 2: Generating Universally Unique ID and Managing Models Relationships

### Previously on Building an Online Game With LoopBack 4

In previous episode, we have created a foundation for our project. Now we have some basic APIs to create, edit, and delete character.

Here is the previous episode:
* [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)

<!--more-->

### In this episode

First, we will use a third-party library in our LoopBack 4 project to generate unique character IDs. Then we will create `weapon`, `armor`, and `skill` models and build relationships between those models. Loopback 4 support three relations for now:

* [HasMany](https://loopback.io/doc/en/lb4/HasMany-relation.html)
* [BelongsTo](https://loopback.io/doc/en/lb4/BelongsTo-relation.html)
* [HasOne](https://loopback.io/doc/en/lb4/hasOne-relation.html)

We will use `HasOne` in this episode.

You can check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part2) for the code of this episode.

### Universally Unique ID (UUID)

In the last episode, we use a while loop to generate continuous character IDs. However, that could be disaster in a real world application. Because fetching data from database is expensive. We don't want to do that hundreds times to just find a unique character id. On the other hand, we don't really need continuous IDs, we only need unique IDs to distinguish characters. So we will use a better approach to generate universally unique IDs (UUID).

We are going to use a third-party library called [uuid](https://www.npmjs.com/package/uuid). Run `npm install uuid` in your project root to install it.

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

The [uuid](https://www.npmjs.com/package/uuid) can generate 36 digits IDs. But we still need to check if that ID already exists. We will keep all existed IDs in memory so that we don't need to fetch them from database.

LoopBack4 support in-memory database. There are two advantages to store our IDs in in-memory database:

* It's in memory. So it's fast to fetch data.
* We can specify a json file to hold data. So when we reboot the application, we can recover the in-memory database from the json file.

The only drawback of this is it will need more time to start the application. This application is like a game server and we don't reboot a server very often, so this drawback is acceptable.

Let's create a model to hold IDs. Run `lb4 model` in your project root.

```
wenbo:firstgame wenbo$ lb4 model
? Model class name: idSet
? Please select the model base class Entity (A persisted model with an ID)
? Allow additional (free-form) properties? No
Let's add a property to IdSet
Enter an empty property name when done

? Enter the property name: id
? Property type: string
? Is id the ID property? Yes
? Is it required?: Yes
? Default value [leave blank for none]:
```

Then create another datasource. We will choose `In-memory db` and specify `./src/data/idSet.json` as the file to hold data.

```
wenbo:firstgame wenbo$ lb4 datasource
? Datasource name: idSet
? Select the connector for idSet: In-memory db (supported by StrongLoop)
? window.localStorage key to use for persistence (browser only):
? Full path to file for persistence (server only): ./src/data/idSet.json
   create src/datasources/id-set.datasource.json
   create src/datasources/id-set.datasource.ts
   update src/datasources/index.ts

Datasource idSet was created in src/datasources/
```
We need to create an empty json file called `idSet.json` in `src/data` manually.

Then create a repository for `idSet` model. We will choose `IdSetDatasource` as datasource.

```
wenbo:firstgame wenbo$ lb4 repository
? Please select the datasource IdSetDatasource
? Select the model(s) you want to generate a repository IdSet
? Please select the repository base class DefaultCrudRepository (Legacy juggler bridge)
   create src/repositories/id-set.repository.ts
   update src/repositories/index.ts
```

Now we have an In-memory database for IDs. Let's make some changes to controller.

Open `src/controllers/character.controller.ts` and add following imports :

```ts
import {IdSet} from '../models';
import {IdSetRepository} from '../repositories';
import {v4 as uuid} from 'uuid';
```

The first two lines will import the `idSet` model and repository so that the `characterController` can find them. The third line will import `uuid`, so we can use it in our code.

Add following two lines into constructor to indicate this controller is associated with `IdSetRepository` as well:

```ts
constructor(
  @repository(CharacterRepository)
  public characterRepository : CharacterRepository,
  //add following two lines
  @repository(IdSetRepository)
  public idSetRepository : IdSetRepository,
) {}
```

Then in the `post /characters' API:

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
  /** The old way we used in last episode
    let characterId = 1;
    while(await this.characterRepository.exists(characterId)){
      characterId ++;
    }
  */

    //the new way
    //generate unique characterId with in-memory database
    let characterId: string = uuid();
    while(await this.idSetRepository.exists(characterId)){
      characterId = uuid();
    }
    character.id = characterId;
    let uId : Partial<IdSet> = {};
    uId.id = characterId;
    await this.idSetRepository.create(uId);
    return await this.characterRepository.create(character);
}
```
We create a character ID by calling `uuid()`. Then we will check the in-memory database to make sure this ID is unique. If it's unique, we store it into the in-memory database.

Don't forget to remove ID in `delete /characters/{id}`.

```ts
@del('/characters/{id}', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('id') id: string
  ): Promise<void> {
    //add this line to remove id from in-memory database
    this.idSetRepository.deleteById(id);
    await this.characterRepository.deleteById(id);
  }
```

### Model Relations

We will create `weapon`, `armor`, and `skill` models. One `character` may have one `weapon`, one `armor`, and one `skill`. It is [HasOne](https://loopback.io/doc/en/lb4/hasOne-relation.html) relationship.

![Models](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/models.png)

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
Do the same thing for `aromr` and `skill`.

Now let's add relationships for `character` to indicate a `character` may has one `weapon`, `armor`, and `skill`. You can check [here](https://loopback.io/doc/en/lb4/Relations.html) for more details on model relationship. You can also take a look at [TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial-model.html) to see how does it handle relationship.

Add following imports at the head of `character.model.ts`.

```ts
import {Armor} from './armor.model';
import {Weapon} from './weapon.model';
import {Skill} from './skill.model';
```

Then add following code into `character.model.ts` after those auto-generated properties. That means each `character` may has one `weapon`, `armor`, and `skill`.

```ts
  @hasOne(() => Armor)
  armor?: Armor;

  @hasOne(() => Weapon)
  weapon?: Weapon;

  @hasOne(() => Skill)
  skill?: Skill;
```

Next, we need to add relationship for `weapon.model.ts` as well. Add import to the head.

```ts
import {Character} from './character.model';
```

Then add following code after those auto-generated properties.

```ts
  @belongsTo(() => Character)
    characterId: number;
```
This give `weapon` another property `characterId` means which character does this weapon belong to. It's similar to the foreign key in relational database.

Do the same thing for `armor.model.ts` and `skill.model.ts`. And our models are all set.

You can check my code for all model at [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part1/firstgame/src/models).

#### Datasource

No need to create new datasource. We can use the one we created in last episode.

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

This means `character` may has one `weapon`, `armor`, and `skill` ID.

Then change the constructor to this:

```ts
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDataSource,
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

That can help you to assign `weapon`, `armor`, and `skill` to `character.`

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
    @inject('datasources.mongoDB') dataSource: MongoDataSource,
    @repository.getter('CharacterRepository')
    protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Weapon, dataSource);
    this.character = this.createBelongsToAccessorFor('character',characterRepositoryGetter);
  }
```

Don't forget to add imports at the head.

```ts
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {Character} from '../models';
import {inject} from '@loopback/core';
import {CharacterRepository} from './character.repository';
```
Do the same thing for `armor.repository.ts` and `skill.repository.ts`. And our repositories are all set.

You can check my code for all repositories at [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part1/firstgame/src/repositories).

#### Controller

We are not going to cover controller today. Because there is a lot of work to do in controller and this episode is long enough. We will do it in next episode.

### Applying This to Your Own Project

In this episode, we used a third-party library to generate UUID. LoopBack 4 project is extendable. You can easily use any external library in you project.

On the other hand, we built relations between `character`, `weapon`, `aromr`, and `skill`. In a real world application, most of entities have relationship between each other. You can use LoopBack 4 to manage that in your project.

### What's Next?

In next episode, we will do a lot of coding in `controller` to create `weapon`, `armor`, `skill` and equip a character with them.

In the meantime, you can learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
