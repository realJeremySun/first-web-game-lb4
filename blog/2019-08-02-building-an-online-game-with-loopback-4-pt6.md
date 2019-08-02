---
layout: post
title: Building an Online Game With LoopBack 4 - Front-end with React (Part 6)
date: 2019-08-02
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt6/
categories:
  - How-To
  - LoopBack
published: false
---

## Part 6: Front-end with React

### In This Episode

Now our project is on IBM CLoud. But you may notice there is not anything that we can actually play with. It's just some APIs. How can we call it a game without front-end?

In this episode, I will build signup, login, and home pages with [React](https://reactjs.org/).

You can check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part6/firstgame) for the code from this episode.

<!--more-->

### Introduction

In this series, I’m going to help you learn LoopBack 4 and how to use it to easily build your own API and web project. We’ll create a new project I’ve been thinking about: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game also allows multiple players to log in and play with their friends.

### Previously on Building an Online Game With LoopBack 4

In last episode, we covered how to run our project in Docker and push it to Kubernetes cluster on IBM Cloud.

Here are the previous episodes:

- [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)
- [Part 2: Generating Universally Unique ID and Managing Models Relationships](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt2/)
- [Part 3: Customizing APIs in Controller](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt3/)
- [Part 4: User Authentication and Role-Based Access Control](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/)
- [Part 5: Deploying our Application to Kubernetes on IBM Cloud](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt5/)

### Prerequisites

I am completely new to front-end world. So I took some online courses.
If you don't have any front-end experience like me, you should spend some time on the basic knowledge before moving on.

- [Javascript 30 days](https://javascript30.com/)
- [Learn React - React Crash Course](https://www.youtube.com/watch?v=Ke90Tje7VS0)

You don't need to finish them all. Watching online courses is boring. You can start to write code whenever you think you are ready.

I will also use some other libraries.

- [axios](https://www.npmjs.com/package/axios)
- [bootstrap](https://www.npmjs.com/package/bootstrap)
- [react-bootstrap](https://www.npmjs.com/package/react-bootstrap)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)

You don't have to fully understand how to use them before we start. I will show you how to use them step by step.

### Initializing React Project

Install `create-react-app`

```
npm i create-react-app
```

Then run this to create a new react project:

```
create-react-app <your_project_name>
```

If you go the the project you just created and run `npm start`, you will see a page like this:

![default_page](/blog-assets/2019/08/building-online-game-pt6-react-default.jpg)

### structure Designing

Before we start, we need to spend some time on project structure.

In a React project, everything is [component](https://reactjs.org/docs/react-component.html). Your pages, navigation bar, input form, or even a button, all of them could be components. All of those components are organized in a tree structure. Here is my project structure.

![default_page](/blog-assets/2019/08/building-online-game-pt6-structure.jpg)

And here is my directory structure:

![default_page](/blog-assets/2019/08/building-online-game-pt6-directory-structure.jpg)

### Applying This to Your Own Project

In this episode, we covered how to deploy our project with Docker and Kubernetes on IBM Cloud. Once you create a Docker image, you can run it almost everywhere. You can also push your own project image to other cloud like AWS, Azure, and Google Cloud. It should be very easy.

### What's Next?

Next time, we will create a simply front-end UI for our project and do a quick demo.

In the meantime, learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
