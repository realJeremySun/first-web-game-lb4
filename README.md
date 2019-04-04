## My first web game with LoopBack4

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

## feature:
1. create a character.
2. create a weapon.
3. equip character with that sword
4. update attack and defence
5. change weapon


## demo:
1. create a character with init config:
![create character](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/1.png)


2. equip character with a sword:
![sword](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/2.png)


3. Because the sword's attack is 2 and defence is 1, So character's attack is 20+2 and defence is 5+1;
![update](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/3.png)


4. equip character with a long sword:
![long sword](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/4.png)



5. Now attack is 20+4 and defence is 5+2;
![sword](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/1.png)
