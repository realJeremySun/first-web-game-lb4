---
layout: post
title: Creating My First API with LoopBack 4 (part 2)
date: 2019-04-24
author: Wenbo Sun
permalink: /strongblog/my-first-API-with-loopback-4-(part-2)/
categories:
  - How-To
  - LoopBack
published: false  
---

## Part 1: Managing Models Relationship

### Previously on My First API

In previous episode, we have created a foundation for our project. Now we have some basic APIs to create, edit, and delete character.

<!--more-->

### In this episode

First, we will use a third-party library in our LoopBack 4 project to generate unique character IDs. Then we will create `weapon`, `armor`, and `skill` models and build relationships between those models. Loopback 4 support three relations for now:

* [HasMany](https://loopback.io/doc/en/lb4/HasMany-relation.html)
* [BelongsTo](https://loopback.io/doc/en/lb4/BelongsTo-relation.html)
* [HasOne](https://loopback.io/doc/en/lb4/hasOne-relation.html)

We will use `HasOne` in this episode.

### Universally unique id (UUID)
In last episode, we use a while loop to generate continuous character IDs. However, that could be disaster in a real world application. Because fetching data from database is expensive. We don't want to do that hundreds times to just find a unique character id. On the other hand, we don't really need continuous IDs, we only need unique IDs to distinguish characters. So we will use a better approach to generate universally unique IDs (UUID).

We are going to use a third-party library called [uuid](https://www.npmjs.com/package/uuid). Run `npm install uuid` in your project root to install it.

Then go back to `src/models/character.model.ts` and change the type of `id` to string. Because string has better distinction than number.

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

The [uuid](https://www.npmjs.com/package/uuid) will generate a 36 digits ID. But we still need to check if that ID already exsit. We will use keep all exsited IDs in memory so that we don't need to fetch them from database.

You can find `applications.ts` in `src`. `applications.ts` is the start point of your project. We will create a `Set<string>` at here to hold all exsited IDs. Open `src/applications.ts` and add following line before constructor:

```ts
export class FirstgameApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  //add this line
  static characterSet: Set<string> = new Set<string>();

  constructor(options: ApplicationConfig = {}) {
  ...
```
Open `src/controllers/character.controller.ts` and add two lines at the very beginning:

```ts
import {FirstgameApplication as app} from '../';
import {v4 as uuid} from 'uuid';
```

The first line will import the `applications.ts` so that the `characterController` can find the `Set<string>` we just created. Second line will import `uuid`, so we can use it in our code.
  
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
  /** the approach we used in last episode
    let characterId = 1;
    while(await this.characterRepository.exists(characterId)){
      characterId ++;
    }
  */
  
    //generate characterId without fetching database
    let characterId: string = uuid();
    while(app.characterSet.has(characterId)){
      characterId = uuid();
    }
    app.characterSet.add(characterId);
    character.id = characterId;

    return await this.characterRepository.create(character);
  }
```

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
    //add this line
    app.characterSet.delete(id);
    await this.characterRepository.deleteById(id);
  }
```
### Model Relations

We will create `weapon`, `armor`, and `skill` models. One `character` may have one `weapon`, one `armor`, and one `skill`. It is [HasOne](https://loopback.io/doc/en/lb4/hasOne-relation.html) relationship.

![Models](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/models.png)

