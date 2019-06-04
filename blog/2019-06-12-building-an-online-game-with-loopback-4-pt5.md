---
layout: post
title: Building an Online Game With LoopBack 4 - Deploying our Application to Kubernetes on IBM Cloud (Part 5)
date: 2019-06-12
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt5/
categories:
  - How-To
  - LoopBack
published: false  
---

## Part 5: Deploying our Application to Kubernetes on IBM Cloud

### Introduction

In this series, I'm going to help you learn LoopBack 4 and how to easily build your own API and web project with it. We'll do so by creating a new project I'm working on: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game should also allow multiple players to log in and play with their friends.

### Previously on Building an Online Game With LoopBack 4

In last episode, we covered how to combine your self-defined authorization strategies and services with `@loopback/authentication` and how to apply it to your API.

Here are the previous episodes:

* [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)
* [Part 2: Generating Universally Unique ID and Managing Models Relationships](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt2/)
* [Part 3: Customizing APIs in Controller](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt3/)
* [Part 4: User Authentication and Role-Based Access Control](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/)



<!--more-->

### In This Episode

Now, this project has some basic features that allow us to create our own characters and login. It is time to deploy it to cloud!

In this episode we will first run our project in Docker. Then we will push it to Kubernetes cluster on IBM Cloud.

You can check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part5/firstgame) for the code of this episode.

### Prerequisites

* [Docker](https://www.docker.com/)
* [Kubernetes](https://kubernetes.io/)
* Sign up for [IBM Cloud](https://www.ibm.com/cloud/)

You don't have to fully understand those concepts. I will show you how to use them step by step.

[The Illustrated Children's Guide to Kubernetes](https://www.youtube.com/watch?v=4ht22ReBjno) is a wonderful video on YouTube that can give you a clear idea of Kubernetes.

[Deploying to Kubernetes on IBM Cloud](https://loopback.io/doc/en/lb4/deploying_to_ibm_cloud_kubernetes.html#prerequisite) is a tutorial on LoopBack 4 official website. What we are going to do is a little different from it, because our project is using MongoDB. So we need to setup MongoDB on cloud as well and connect our project to it.

### Adding Docker Feature

In [episode 1](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/), we disabled Docker when created our project. Now we need to manually add Docker feature.

In your project root, create a file called `Dockerfile`.

```
# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]
```

Then create a file called `.dockerignore`.

```
node_modules
npm-debug.log
/dist
```

Open `package.json`, add two lines under `scripts`. Those are the command lines to build and run Docker image.

```
"docker:build": "docker build -t firstgame .",
"docker:run": "docker run -p 3000:3000 -d firstgame",
```

### Building Docker Image

Install [Docker](https://www.docker.com/get-started) if you haven't.

Run this command:

```
npm run docker:build
```

If it success, you will see:

```
Successfully built 2fc1837ccd8e
Successfully tagged firstgame:latest
```

Run this command to show all images:

```
docker image ls
```

You should see two images like this:

```
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
firstgame           latest              2fc1837ccd8e        About a minute ago   385MB
node                10-slim             a41b78200d6f        6 days ago           148MB
```

Our image is ready to run.

```
npm run docker:run
```

Run this command to show all running containers. Container is a running instance of an image.

```
docker ps
```

You will see:

```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                    NAMES
88cc8acfbeea        firstgame           "node ."            5 minutes ago       Up 5 minutes        0.0.0.0:3000->3000/tcp   friendly_archimedes
```

Because we didn't specify container's name, Docker randomly assigned one for it.

Run this command to see the log output of your container. Replace `<container id>` with your container id. In my case, it is `88cc8acfbeea`.

```
docker logs <container id>
```

You should see something like this:

```
Server is running at http://127.0.0.1:3000
Try http://127.0.0.1:3000/ping
```

Now, you should be able to open the API explorer: http://127.0.0.1:3000/explorer/

If everything is fine. Run this command to stop the image.

```
docker stop <container id>
```

Our Docker image is all set.

### Pushing Docker image to IBM Cloud.

Sign up for [IBM Cloud](https://cloud.ibm.com/login) if you haven't.

Install [IBM Cloud CLI](https://cloud.ibm.com/docs/cli/reference/ibmcloud?topic=cloud-cli-ibmcloud-cli#ibmcloud-cli).









### Applying This to Your Own Project

In this episode, we covered how to combine your self-defined authorization strategies and services with `@loopback/authentication` and how to apply it to your API.

You can always design your own strategies and services based on your project need. For example, you may want to have a password hashing service, so that you don't directly save a user's raw password in the database. [Here](https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/hash.password.bcryptjs.ts) is an example of how to implement a password hashing service.

### What's Next?

In next episode, we will deploy this project to cloud.

In the meantime, you can learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
