# My First Web Game with LoopBack4
## Part 1

### Instruction
In this series, we are going to create a API web game by using LoopBack4. This game is an online web Text-based Adventure Game. 

In this game, users can create their own account and characters, fight with monsters and find treasures. User can
control their character to take actions like attack enemy, cast spell, defeat enemy and get loot. This game should also allow multiple players login and play with their friends.

I don't have any background on web or game development. I graduated from college last year. The main purpose of this series is to show you how to learn LoopBack4 and how to use LoopBack4 to easily build your own API and web project.
I am sure most of you have better understanding than me on those fields. If I can do this, you can do better.

### Why LoopBack4
LoopBack4 is a open source framework that can help you build REST API. You can use LB4 to automatically generate simple APIs in couple of minutes without any coding. You can even easily connect your project to many popular databses. In this series, I will use MongoDB as my databse. I don't even need to know how to use MongoDB as LB4 will handle everyting for me. Isn't this like magic?

Another great advantage of LB4 is extensible. The auto-generated APIs are just some basic CRUD functions. You can add your own programing logic to those functions and customize your project on the top of the auto-generated APIs. You don't need to worry about any environment configuration and database connection. 

### Project plan
In this series I hope to achieve following goals:
* Users can create their own character and customize their character.
* Users can equip their character with weapon, armor, and skill.
* Basic function for game: attack, defence, and cast spell.
* User authorization and role-based access control.
* Multiple users login and play at the same time.
* UI.
* Deployment on cloud like: IBM cloud, AWS, Google Cloud or Azure.

### In this episode
I will start from the easiest thing: auto-generate APIs for users to create character and connect to MongoDB. 

### Before we start
There are some prerequisite knowledge you may want to catch before we start.
* Basic concept of [Javascript](https://www.w3schools.com/js/) and [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp)
* [Install LoopBack4](https://loopback.io/doc/en/lb4/Getting-started.html)
* I highly recommend you to check those two examples: [Todo tutorial](https://loopback.io/doc/en/lb4/todo-tutorial.html) and [TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial.html). This episode is base on thise examples. You don't have to understand how does that work. Just keep in mind what function we can achieve. We will dig deep into that later.

### Itializing scaffolding
LB4 provide CLI(command line interface) to help create your project. Simply Run `lb4 app` in in a folder you want to use the CLI.

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
There are four important components in a LB4 project: Model, Datasource, Repository, and Controller. Let's create them one by one.

### Model
Model is like the class in Java or a table in relational database. It is a entity with one or more properties. A model may also has relationship with other models. For example, a `student` model could has properties like `studentID`, `name`, and `GPA`. It may also has one or more entity of `course` model and belong to a `school` model.

We will handle the model relationship in next blog. In this episode let't simply create a `character` model first. `character` model has following properties:
* id: number
* name: string
* level: number
* nextLevelExp: number
* maxExp: number
* maxHealth: number
* currentHealth: number
* maxMana: number
* currentMana: number
* attack: number
* defence: number

Run `lb4 model` in the project folder we just created by using CLI.
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

...
```
* The first property is `id`. It's like the prime key in relational database. We don't need user to specify `id` and we will auto generate `id` for them.
* The second property is `name`. That is the only thing we need user to specify.
* All of other properties like `level`, `attack` and `defence` are default. We will not nee user to specify.
We can create `weapon`, `armor`, and `skill` models in the same way.

If you go to `/src/models`, you will see `character.model.ts`. We don't need to do anything about it at this point. We will come back in following episode.

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
You will find `character.repository.ts` in `src/repositories`. It's all we need at this point.

### Controller
Controller is the most important component. It contain the code for all of your project functions and handle all business logics. In this series We will spend the majority of our time on controller.

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
This will generate all basic APIs for `character`, include `post`, `get`, `patch`, `put`, and `delete`.

### API explorer
LB4 has a build-in API explorer for you to play and test your API.

To start your project, run `npm start` in the project root.
```
wenbo:firstgame wenbo$ npm start

> firstgame@1.0.0 prestart /Users/xiaocase/Documents/learnlb/MyAPI/firstgameDemo/firstgame
> npm run build


> firstgame@1.0.0 build /Users/xiaocase/Documents/learnlb/MyAPI/firstgameDemo/firstgame
> lb-tsc es2017 --outDir dist


> firstgame@1.0.0 start /Users/xiaocase/Documents/learnlb/MyAPI/firstgameDemo/firstgame
> node .

Server is running at http://[::1]:3000
Try http://[::1]:3000/ping
```
Go to http://[::1]:3000 and open explorer. You will see this:
[explorer](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/b1-api-explorer.png)
That are thoes basic APIs we just created.

Let's try to create a character. Open `post /character` and click "try it out". Only input a name for character and leave others blank.
[post](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/b1-post-character.png)

Then we can try to get information for the character. Open `get /character/{id}` and click "try it out". Input "1" as character Id.
[get](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/b1-get-character.png)

### What you can apply on your own project.
In this episode, we covered the how to create simple APIs. You can do the same for your own project as a start point.

### To be continue
In next episode, we will add `weapon`, `armor`, `skill` model and handle the relationship between models.
