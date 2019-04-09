# My First Web Game with Loopback4
API web game is an online web Text-based Adventure Game powered by LoopBack 4. In this
game, users can create their own characters, fight with monsters and find treasures. User can
control their character by calling specific APIs. Their actions may include chose enemy to fight,
attack enemy, defeat enemy and get loot.

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
