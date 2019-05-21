---
layout: post
title: Building an Online Game With LoopBack 4 - User Authentication and Role-Based Access Control (Part 4)
date: 2019-05-21
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt4/
categories:
  - How-To
  - LoopBack
published: false  
---

## Part 4: User Authentication and Role-Based Access Control

### Introduction

In this series, I'm going to help you learn LoopBack 4 and how to easily build your own API and web project with it. We'll do so by creating a new project I'm working on: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game should also allow multiple players to log in and play with their friends.

### Previously on Building an Online Game With LoopBack 4

In last episode, we created customized APIs to manage `weapon`, `armor`, and `skill` for `character`.

Here are the previous episodes:

* [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)
* [Part 2: Generating Universally Unique ID and Managing Models Relationships](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt2/)
* [Part 3: Customizing APIs in Controller](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt3/)



<!--more-->

### In This Episode

We already have some APIs that allow user to customize characters. But a user should not get access to other character. So in this episode, we will add user authentication and role-based access control to this project.

### Authentication Structure

LoopBack 4 provide us a build-in authentication package. This package has some basic authentication functions and an extension point for us to apply our own authentication strategies. Here is a diagram for the basic structure:

[!structure]()

#### `@loopback/authentication` Package

The one in the middle is the `@loopback/authentication` package. It has three main components:

* Providers:
  * AuthMetadataProvider: this will read all metadata from `@authenticate` decorators.
  * AuthenticateActionProvider: this holds the business logic for authentication action.
  * AuthenticationStrategyProvider: this is the extension point for you to add your own authentication strategies. I will show you how to do that later.

* Services: all services in this package are interfaces. You can your own services as well.
  * TokenService: an interface for generating and verifying an authentication token.
  * UserService: an interface for performing the login action in an authentication strategy. To keep this project as simple as possible, I am not going to use this interface. I will integrate this to the TokenService.

* Decorators: `@authenticate`. Put this before those APIs that need authentication. You can create you own decorators if necessary.

#### User-defined Authentication

The one in the bottom left is our self-defined authentication. It has three components:

* Providers:
  * UserPermissionsProvider: this will check user's permission. We will create different user permissions for different users.

* Strategies: this is where we add our own authentication strategies.
  * JWTStrategy: we are going to use [JSON Web Token](https://jwt.io/) as our authentication strategy.

* Services:
  * JWTService: a service associate with JWTStrategy to generate and verify JWT.

#### `application.ts`, `sequence.ts` and `controller`

In order to use the all of above in our project, we have three more steps to do:   

 * Binding everything in `application.ts`. `application.ts` is like the main function of LoopBack project.
 * Adding authenticate action into `sequence.ts`. `sequence.ts` is where we specify how to response a request.
 * Put `@authenticate` before your APIs.



### Applying This to Your Own Project

In this episode, we covered the how to customize APIs. You can always implement your own amazing idea in your LoopBack 4 project.

### What's Next?

In next episode, we will add user authentication and role-based access control to this project.

In the meantime, you can learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
