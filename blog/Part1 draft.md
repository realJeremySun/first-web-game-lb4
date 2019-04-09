# My First Web Game with LoopBack4
## Part 1


### Instruction
In this series, I am going to create a API web game by using LoopBack4. This game is an online web Text-based Adventure Game.In this game, users can create their own characters, fight with monsters and find treasures. User can
control their character by calling specific APIs. Their actions may include attack enemy, cast spell, defeat enemy and get loot.\
I don't have any background on web or game development. I graduated from college last year. The main purpose of this series is to show you how to learn LoopBack4 and how to use LoopBack4 to easily build your own API and web project.
I am sure most of you have better understanding than me on those fields. If I can do this, you can do better.

### Before we start
There are some prerequisite knowledge you may want to catch before we start.
* Basic concept of [Javascript](https://www.w3schools.com/js/) and [Node.js](https://www.w3schools.com/nodejs/nodejs_intro.asp)
* [Install LoopBack4](https://loopback.io/doc/en/lb4/Getting-started.html)
* I highly recommend you to check those two examples: [Todo tutorial](https://loopback.io/doc/en/lb4/todo-tutorial.html) and [TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial.html). This episode is base on thise examples. You don't have to understand how does that work. Just keep in mind what function we can achieve. We will dig deep into that later.

## Features:
1. Create a character.
2. Create a weapon, armor, or skill.
3. Equip character.
4. Update attack and defence
5. Change weapon, armor and skill.
6. Levelup character.

* Model
  * character
    * id : number
    * name : string
    * level : number
    * maxHealthPoint : number
    * currentHealthPoint : number
    * nextLevelExp : number
    * currentExp
    * maxMana : number
    * currentMana : number
    * attack : number
    * defence : number
    * armor : {armor}
    * weapon : {weapon}
    * skill : {skill}

  * armor
    * id : number
    * name : string
    * attack : number
    * defence : number
    * characterId : number


  * weapon
    * id : number
    * name : string
    * attack : number
    * defence : number
    * characterId : number
    
    
  * skill
    * id : number
    * name : string
    * attack : number
    * cost : number
    * characterId : number

![Models](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/models.png)
