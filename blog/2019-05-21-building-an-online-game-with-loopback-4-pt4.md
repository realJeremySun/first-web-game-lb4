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

You can check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part4/firstgame) for the code of this episode.

### Authentication Structure

LoopBack 4 provide us a build-in authentication package. This package has some basic authentication functions and an extension point for us to apply our own authentication strategies. Here is a diagram for the basic structure:

![structure](https://github.com/gobackhuoxing/first-web-game-lb4/blob/master/picture/Auth%20structure.png)

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

You can check [this tutorial](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html) or [this shopping example](https://github.com/strongloop/loopback4-example-shopping) for more information of LoopBack 4 Authentication package.

### Install `@loopback/authentication`

Simply run `npm install --save @loopback/authentication@2.0.3` in your project root.

Reminder: We are using `@loopback/authentication@2.0.3` in this project. If you want to use other version, you may need to change you code accordingly.

### Refactor Model

In previous episodes, we used UUIDs as our `character` IDs. But UUIDs are 36 digits string IDs. We can not let user use UUIDs to login. So we will use email instead of UUID.

In `src/controllers/character.models`, add email and password properties.

```ts
@property({
  type: 'string',
  id: true,
  required: true,
})
email?: string;

@property({
  type: 'string',
  required: true,
})
password: string;
```

Besides, we need to add user permission to `character` model.

```ts
import {PermissionKey} from '../authorization';
```

```ts
@property.array(String)
permissions: PermissionKey[];
```

`permissions` is an array of `PermissionKey`s. We will create `PermissionKey` later.

### Self-Defined Authentication Component

Let's first create a folder 'authorization' in `src` to hold everything in this episode.

I will show you how to create everything step by step. You can also check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part4/firstgame/src/authorization) for my `authorization` folder.

#### `PermissionKey.ts`

Create `PermissionKey.ts` in `src/authorization`.

```ts
export const enum PermissionKey {
  // For accessing own (logged in user) profile
  ViewOwnUser = 'ViewOwnUser',
  // For creating a user
  CreateUser = 'CreateUser',
  // For updating own (logged in user) profile
  UpdateOwnUser = 'UpdateOwnUser',
  // For deleting a user
  DeleteOwnUser = 'DeleteOwnUser',

  //admin
  // For updating other users profile
  UpdateAnyUser = 'UpdateAnyUser',
  // For accessing other users profile.
  ViewAnyUser = 'ViewAnyUser',
  // For deleting a user
  DeleteAnyUser = 'DeleteAnyUser',
}
```
Those are the users privileges. `ViewOwnUser`, `CreateUser`, `UpdateOwnUser`, `DeleteOwnUser` are for regular users. `UpdateAnyUser`, `ViewAnyUser`, `DeleteAnyUser` are for admins only.

#### `types.ts`

Create `types.ts` in `src/authorization`. Here is where we put all of our interfaces and types.

```ts
import {PermissionKey} from './permission-key';

export interface UserPermissionsFn {
  (
    userPermissions: PermissionKey[],
    requiredermissions: PermissionKey[],
  ): boolean;
}

export interface MyUserProfile  {
  id: string;
  email: string;
  password: string;
  name: string;
  permissions: PermissionKey[];
}

export const UserProfileSchema = {
  type: 'object',
  required: ['email', 'password', 'name'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    name: {type: 'string'},
  },
};

export const UserRequestBody = {
  description: 'The input of create user function',
  required: true,
  content: {
    'application/json': {schema: UserProfileSchema},
  },
};

export const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
```

`MyUserProfile` is the format of our user profile. That is the necessary information we need to do authentication.

`UserProfileSchema` and `CredentialsSchema` are the format of request input. We will use them to validate request input in `controller`.

#### `keys.ts`

Create `keys.ts` in `src/authorization`. This is the self-defined component that we need to bind to `application.ts`.

```ts
import {BindingKey} from '@loopback/context';
import {UserPermissionsFn} from './types';
import {TokenService} from '@loopback/authentication';
/**
 * Binding keys used by this component.
 */
export namespace MyAuthBindings {
  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn>(
    'userAuthorization.actions.userPermissions',
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}
```

#### Providers

Create folder `providers` in `src`, then inside `providers`, create `user-permissions.provider.ts`. This is how we deal with user permissions.

```ts
import {Provider} from '@loopback/context';
import {PermissionKey} from '../permission-key';
import {UserPermissionsFn} from '../types';
import {intersection} from 'lodash';

export class UserPermissionsProvider implements Provider<UserPermissionsFn> {
  constructor() {}

  value(): UserPermissionsFn {
    return (userPermissions, requiredPermissions) =>
      this.action(userPermissions, requiredPermissions);
  }

  action(
    userPermissions: PermissionKey[],
    requiredPermissions: PermissionKey[],
  ): boolean {
    return intersection(userPermissions, requiredPermissions).length
          === requiredPermissions.length;
  }
}
```

It will compare user's permissions and required permissions and allow user get access only if this user has all of required permissions.

#### Strategies

First, run `npm install jsonwebtoken` in your project root to install JWT package.

Create folder `strategies` in `src`, then inside `strategies`, create `JWT.strategy.ts`. This is our self defined authentication strategy.

```ts
import {Request, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {AuthenticationStrategy,
        AuthenticationMetadata,
        AuthenticationBindings,
        TokenService,
} from '@loopback/authentication';
import {MyUserProfile,
        UserPermissionsFn,} from '../types';
import {MyAuthBindings,} from '../keys';
import {PermissionKey} from '../permission-key';

export const JWT_SECRET = 'jwtsecret';

export class JWTStrategy implements AuthenticationStrategy{
  name: string = 'jwt';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject(MyAuthBindings.USER_PERMISSIONS)
    protected checkPermissons: UserPermissionsFn,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    protected tokenService: TokenService,
  ) {}
  async authenticate(request: Request): Promise<MyUserProfile | undefined> {
    let token = request.query.access_token || request.headers['authentication'];
    if (!token) throw new HttpErrors.Unauthorized('No access token found!');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    try {
      const user = await this.tokenService.verifyToken(token);
      const requiredPermissions = this.metadata.options;
      if(!this.checkPermissons(
        (user as MyUserProfile).permissions ,
        requiredPermissions as PermissionKey[]
      )){
        throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
      }
      return user as MyUserProfile;
    } catch (err) {
      Object.assign(err, {
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      });
      throw err;
    }
  }
}
```

You can also create your own authentication strategy. Or you can even use multiple strategies in one project.

#### Services

Create folder `services` in `src`, then inside `services`, create `JWT.services.ts`. This is our self defined authentication strategy.

```ts
import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {MyUserProfile} from '../types';
import {repository} from '@loopback/repository';
import {CharacterRepository} from '../../repositories';
import * as _ from 'lodash';
import {toJSON} from '@loopback/testlab';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
  ) {}

  async verifyToken(token: string): Promise<MyUserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    const decryptedToken = await verifyAsync(token, 'jwtsecret');
    let userProfile = _.pick(decryptedToken, ['id', 'email', 'password', 'name', `permissions`]);
    return userProfile;
  }

  async generateToken(userProfile: MyUserProfile): Promise<string> {
    const foundUser = await this.characterRepository.findOne({
      where: {email: userProfile.email},
    });
    if (!foundUser) {
      throw new HttpErrors['NotFound'](
        `User with email ${userProfile.email} not found.`,
      );
    }

    if (userProfile.password != foundUser.password) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    // Generate a JSON Web Token
    const currentUser = _.pick(toJSON(foundUser), ['email', 'name', 'permissions']);
    const token = await signAsync(currentUser, 'jwtsecret', {
      expiresIn: 300,
    });

    return token;
  }
}
```

### Applying This to Your Own Project

In this episode, we covered the how to customize APIs. You can always implement your own amazing idea in your LoopBack 4 project.

### What's Next?

In next episode, we will add user authentication and role-based access control to this project.

In the meantime, you can learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
