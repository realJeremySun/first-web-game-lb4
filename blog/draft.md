# My First Web Game with LoopBack4


### Instruction
In this series, I am going to create a API web game by using LoopBack4. This game is an online web Text-based Adventure Game.In this game, users can create their own characters, fight with monsters and find treasures. User can
control their character by calling specific APIs. Their actions may include attack enemy, cast spell, defeat enemy and get loot.

I don't have any background on web or game development. I graduated from college last year. The main purpose of this series is to show you how to learn LoopBack4 and how to use LoopBack4 to easily build your own API and web project.
I am sure most of you have better understanding than me on those fields. If I can do this, you can do better.

### Before we start
There are some prerequisite knowledge you may want to catch before we start.
* Basic concept of [Javascript](https://www.w3schools.com/js/) and [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp)
* [Install LoopBack4](https://loopback.io/doc/en/lb4/Getting-started.html)
* I highly recommend you to check those two examples: [Todo tutorial](https://loopback.io/doc/en/lb4/todo-tutorial.html) and [TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial.html). This episode is base on thise examples. You don't have to understand how does that work. Just keep in mind what function we can achieve. We will dig deep into that later.

### In this episode
I will implement following features:
1. Create a character.
2. Create a weapon, armor, or skill.
3. Equip character.
4. Change weapon, armor and skill.
5. Update character information.
6. Levelup character.

There are four important components in a LB4 project: Model, Datasource, Repository, and Controller. Let's create them one by one.

First, let's create a LB4 project.
Run `lb4 app` in in a folder you want. This will create a new LB4 project.

Disable "Docker" when it ask you to "Select features to enable in the project"
```
wenbo:firstgameDemo wenbo$ lb4 app
? Project name: firstgame
? Project description: firstgameDemo
? Project root directory: firstgame
? Application class name: FirstgameApplication
? Select features to enable in the project Enable tslint, Enable prettier,
Enable mocha, Enable loopbackBuild, Enable vscode, Enable repositories, Ena
ble services
```

### Models
Then we need to create models. Model is like the class in Java or a table in relational database. It is a entity with one or more properties. A model may also has relationship with other models. For example, a `student` model could has properties like `studentID`, `name`, and `GPA`. It may also has one or more entity of `course` model and belong to a `school` model.

In this game, we want to let user create their own characters and equip their characters with weapons, armors, and skills. So models will looks like this.

![Models](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/models.png)

Run `lb4 model` in your project folder.
```
? Model class name: character
? Please select the model base class Entity (A persisted model with an ID)
? Allow additional (free-form) properties? No
Let's add a property to Character
Enter an empty property name when done

? Enter the property name: id
? Property type: number
? Is id the ID property? Yes
? Is it required?: No
? Default value [leave blank for none]:

Let's add another property to Character
Enter an empty property name when done

? Enter the property name: name
? Property type: string
? Is it required?: Yes
? Default value [leave blank for none]:

Let's add another property to Character
Enter an empty property name when done

? Enter the property name: level
? Property type: number
? Is it required?: No
? Default value [leave blank for none]: 1
```
* The first property is `id`. It's like the prime key in relational database. We don't need user to specify `id` and we will auto generate `id` for them.
* The second property is `name`. That is the only thing we need user to specify.
* All of other properties like `level`, `attack` and `defence` are default. We will not nee user to specify.
We can create `weapon`, `armor`, and `skill` models in the same way.

Then if you go to `/src/models`, you will see `character.model.ts`, `weapon.model.ts`, `armor.model.ts`, and `skill.model.ts`.
Now open `character.model.ts` with your favourite editer, we are going handle the models relationship.

The language we use in LB4 is Typescript. It's very similar to Javascript. Don't worry if you did't use it before. LB4 already generate the most of code for you. We only need to add or edit few lines of code as needed.

If you take a look at `character.model.ts`, you will find it's very easy to understand.
```ts
  @property({
    type: 'number',
    id: true,
  })
  id?: number;
```
This means the type of `id` property is `number`, and it is a `id property`, like the prime key in relational database.

```ts
  @property({
    type: 'string',
    required: true,
  })
  name: string;
```
This means the type of `name` property is `string`, and it is required.
You can easily add or edit properties.

Now, we want to add relationships for `character` to indicate a `character` may has one `weapon`, `armor`, and `skill`. You can check [here](https://loopback.io/doc/en/lb4/Relations.html) for more details on model relationship. Or you can also take look at [TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial-model.html) to see how does it handle relationship.

We add following imports into the head of `character.model.ts`.
```ts
import {Armor} from './armor.model';
import {Weapon} from './weapon.model';
import {Skill} from './skill.model';
```
Then we add following code into `character.model.ts`.
```ts
  @hasOne(() => Armor)
  armor?: Armor;

  @hasOne(() => Weapon)
  weapon?: Weapon;

  @hasOne(() => Skill)
  skill?: Skill;
```
That means each `character` may has one `weapon`, `armor`, and `skill`.


Next, we need to add relationship for `weapon.model.ts` as well. Add import to the head.
```ts
import {Character} from './character.model';
```
Then
```ts
  @belongsTo(() => Character)
    characterId: number;
```
This give `weapon` another property `characterId` means which character does this weapon belong to. It's similar to the foreign key in relational database. 

Do the same thing for `armor.model.ts` and `skill.model.ts`. And our models are all set.

### Datasource
Datasource is how we connect to database in LB4. LB4 support alomst all of the popular databases. In this series I will use [MongoDB](https://www.mongodb.com/). You don't need to know how to use MongoDB. LB4 will take care everything for you. You only need to [install mongoDB](https://docs.mongodb.com/manual/administration/install-community) first.

After installation, run `lb4 datasource` in you project root. 
```
wenbo:firstgame wenbo$ lb4 datasource
? Datasource name: mongo
? Select the connector for mongo: MongoDB (supported by StrongLoop)
? Connection String url to override other settings (eg: mongodb://username:password@hostna
me:port/database):
? host: localhost
? port: 27017
? user:
? password: [hidden]
? database: mongo
```
Fill `host` with `localhost` and `port` with `27017`.

This will build a connection between your project and MongoDB.

### Repository
Repository is like a translator between databse and API operations. One of it's job is like database injecter and extracter, when you call some APIs, repository will help you inject data into database or extract data from databse.

Run `lb4 repository` in your project root.
```
wenbo:firstgame wenbo$ lb4 repository
? Please select the datasource MongoDatasource
? Select the model(s) you want to generate a repository Character
? Please select the repository base class DefaultCrudRepository (Legacy juggler bridge)
   create src/repositories/character.repository.ts
   update src/repositories/index.ts
```
Then create repository for `weapon`, `armor`, and `skill` in the same way.

Let's take a look at the `character.repository.ts` that LB4 generated for you.
```ts
import {DefaultCrudRepository} from '@loopback/repository';
import {Character} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CharacterRepository extends DefaultCrudRepository<
  Character,
  typeof Character.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Character, dataSource);
  }
}
```
Add this before ther constructor:
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
This means `character` may has one `weapon`, `armor`, and `skill`.

Then change the constructor to this:
```ts
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
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
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('CharacterRepository')
    protected characterRepositoryGetter: Getter<CharacterRepository>,
  ) {
    super(Weapon, dataSource);

    this.character = this.createBelongsToAccessorFor('character',characterRepositoryGetter);
  }
```
Do the same thing for `armor.repository.ts` and `skill.repository.ts`.
  
You can check my code for repositories at [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/master/firstgame/src/repositories)
  
### Controller
Controller is the most important component. It contain the code for all of your project functions and handle all business logics. We will spend the majority of our time on controller.

Run `lb4 controller` in your project root to create default controller.
```
wenbo:firstgame wenbo$ lb4 controller
? Controller class name: character
? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? Character
? What is the name of your CRUD repository? CharacterRepository
? What is the type of your ID? number
? What is the base HTTP path name of the CRUD operations? /characters
   create src/controllers/character.controller.ts
   update src/controllers/index.ts
```

(to be continue)
  
  
  
### Test
