# My First Web Game with LoopBack4
## Part 1


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
```
