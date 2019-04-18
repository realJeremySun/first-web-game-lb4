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
In last episode, we use a while loop to generate continuous character IDs. However, that could be disaster in a real world application. Because acquiring data from database is expensive. We don't want to do that hundreds times to just find a unique character id. On the other hand, we don't really need continuous IDs, we only need unique IDs to distinguish characters. So we will use a better approach to generate universally unique IDs (UUID).

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
