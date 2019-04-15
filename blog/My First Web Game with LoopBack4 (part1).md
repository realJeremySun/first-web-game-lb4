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
