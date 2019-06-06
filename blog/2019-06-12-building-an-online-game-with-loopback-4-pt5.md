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

In this series, I'm going to help you learn LoopBack 4 and how to easily build your own API and web project with it. We'll do so by creating a new project I'm working on: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game also allows multiple players to log in and play with their friends.

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

Docker image is lightweight, portable, self-sufficient. Once you create a Docker image, you can run it almost everywhere. On the other hand, Kubernetes will handle those high level concepts such as storage, network and scale-up.

You can check [here](https://github.com/gobackhuoxing/first-web-game-lb4/tree/part5/firstgame) for the code of this episode.

### Prerequisites

* [Docker](https://www.docker.com/)
* [Kubernetes](https://kubernetes.io/)
* Sign up for [IBM Cloud](https://www.ibm.com/cloud/)

You don't have to fully understand those concepts. I will show you how to use them step by step.

[The Illustrated Children's Guide to Kubernetes](https://www.youtube.com/watch?v=4ht22ReBjno) is a wonderful video on YouTube that can give you a clear idea of Kubernetes.

[Deploying to Kubernetes on IBM Cloud](https://loopback.io/doc/en/lb4/deploying_to_ibm_cloud_kubernetes.html#prerequisite) is a tutorial on LoopBack 4 official website. What we are going to do is a little different from it. Because our project is using MongoDB, we need to setup MongoDB on cloud as well and connect our project to it.

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
Successfully built 0b2c1ff52a2e
Successfully tagged firstgame:latest
```

Run this command to show all images:

```
docker image ls
```

You should see two images like this:

```
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
firstgame           latest              0b2c1ff52a2e        44 seconds ago       430MB
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

Sign up for [IBM Cloud](https://cloud.ibm.com/login) and install [IBM Cloud CLI](https://cloud.ibm.com/docs/cli/reference/ibmcloud?topic=cloud-cli-ibmcloud-cli#ibmcloud-cli).

Run this command to login IBM Cloud.

```
ibmcloud login
```

If logged in successfully, you will see something like:

```
API endpoint:      https://cloud.ibm.com
Region:            us-east
User:              wenbo.sun@ibm.com
Account:           IBM (114e44f826b74008a2afbf099e6b3561)
Resource group:    Default
CF API endpoint:
Org:
Space:
```

Login IBM Cloud Container Registry. This is where we store our Docker image.

```
ibmcloud cr login
```

If success, you will see something like:

```
Logging in to 'us.icr.io'...
Logged in to 'us.icr.io'.
```

This is the container registry region you logged into.

After logged in, let's create a new namespace for our project.

```
ibmcloud cr namespace-add my-lb4-namespace
```

You can run `ibmcloud cr namespace-list` to show all of your namespaces.

Run this command to tag the local docker image with the IBM Cloud container registry.

```
docker tag <image_name>:<tag> <container_registry_region>/<my_namespace>/<new_image_repo>:<new_tag>
```

In my case, this command will looks like this:

```
docker tag firstgame:latest us.icr.io/my-lb4-namespace/firstgame-repo:1.0
```

Then push the local image to the container registry.

```
docker push us.icr.io/my-lb4-namespace/firstgame-repo:1.0
```

You will see something like this:

```
The push refers to repository [us.icr.io/my-lb4-namespace/firstgame-repo]
8f77245a867e: Pushed
f3f824dbea6d: Pushed
637a53e1e6ed: Pushing [==============================>                    ]  144.1MB/236.6MB
69d1baa1ae3c: Pushed
30cea096009e: Pushed
344e2d688289: Pushed
61cb38befba5: Pushed
aa5a12ea4279: Pushed
6270adb5794c: Pushed
```

When it is done, run the following command to show images on your container registry.

```
ibmcloud cr image-list
```

You should see this:

```
REPOSITORY                                     TAG   DIGEST         NAMESPACE             CREATED      SIZE     SECURITY STATUS
us.icr.io/my-lb4-namespace/firstgame-repo      1.0   3c853b97ffec   my-lb4-namespace      1 hour ago   144 MB   No Issues
```

The `SECURITY STATUS` shows `No Issues`. If you get issues here, you may want to check [Managing image security with Vulnerability Advisor](https://cloud.ibm.com/docs/services/va?topic=va-va_index#va_index) for more related information.

Lastly, run this command to build Docker image on the container registry. Don't forget the ` .` at the end.

```
ibmcloud cr build -t us.icr.io/my-lb4-namespace/firstgame-repo:1.0 .
```

### Creating Kubernetes Cluster

If you don't have a Kubernetes Cluster yet, login to your IBM Cloud in browser and go to https://cloud.ibm.com/kubernetes/catalog/cluster/create to create a free cluster. It may take a while.

When it is done, run this command to point to Kubernetes cluster. My cluster name is `firstgame-cluster`.

```
ibmcloud cs cluster-config <Cluster Name>
```

You will see something like this. Copy and run the last line.

```
OK
The configuration for firstgame-cluster was downloaded successfully.

Export environment variables to start using Kubernetes.

export KUBECONFIG=/Users/xiaocase/.bluemix/plugins/container-service/clusters/firstgame-cluster/kube-config-hou02-firstgame-cluster.yml
```

Run this command to verify your cluster.

```
kubectl get nodes
```

You should see something like this.

```
NAME          STATUS    ROLES     AGE       VERSION
10.47.84.60   Ready     <none>    5d        v1.13.6+IKS
```

Now you cluster is ready to use.

### Setting up MongoDB and Deploying our Project to Kubernetes

Because our project is using MongoDB, we need to set up a MongoDB container and our project container in one Kubernetes [pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/). A Kubernetes pod is a group of one or more containers. Containers in the same pod will share storage and network.

Let's first create a file called `first-game.yaml` in our project root. We will use this `yaml` file to specify containers and pod.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: firstgame
spec:
  replicas: 1
  template:
    metadata:
      labels:
        run: firstgame
    spec:
      containers:
        - name: fg
          image: us.icr.io/my-lb4-namespace/firstgame-repo:1.0
          ports:
            - containerPort: 3000
        - name: db
          image: mongo
          ports:
            - containerPort: 27017
```

Run this command to use the `yaml` file to create containers and pod.

```
kubectl create -f first-game.yaml
```

You will see something like this.

```
deployment.extensions "firstgame" deleted
wenbo:firstgame wenbo$ kubectl create -f first-game.yaml
deployment.extensions "firstgame" created
```

Run this command to verify our pod is running.

```
kubectl get pods
```

If success, you will see this.

```
NAME                         READY     STATUS    RESTARTS   AGE
firstgame-85ccbd5496-6nmvt   2/2       Running   0          1m
```

Now our application is running on Kubernetes. Next step is to expose it to public.

```
kubectl expose deployment firstgame --type=NodePort --port=3000 --name=firstgame-service --target-port=3000
```

You should see this.

```
service "firstgame-service" exposed
```

Run this command to get NodePort for this service.

```
kubectl describe service firstgame-service
```

You should see:

```
Name:                     firstgame-service
Namespace:                default
Labels:                   run=firstgame
Annotations:              <none>
Selector:                 run=firstgame
Type:                     NodePort
IP:                       172.21.16.4
Port:                     <unset>  3000/TCP
TargetPort:               3000/TCP
NodePort:                 <unset>  30604/TCP
Endpoints:                172.30.246.14:3000
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

In my case, the NodePort is `30604`.

The last thing we need is the IP address of our cluster.

```
ibmcloud ks workers firstgame-cluster
```

You will get something like this:

```
ID                                                 Public IP         Private IP    Machine Type   State    Status   Zone    Version
kube-hou02-pa572a9bc002c7487989c712a80af241cc-w1   184.172.229.128   10.47.84.60   free           normal   Ready    hou02   1.13.6_1522*

```

My cluster IP address is `184.172.229.128`.

Now we should be able to access to our application via http://184.172.229.128:30604

### Applying This to Your Own Project

In this episode, we covered how to deploy our project with Docker and Kubernetes on IBM Cloud. Once you create a Docker image, you can run it almost everywhere. You can also push your own project image to other cloud like AWS, Azure, and Google Cloud. It should be very easy.

### What's Next?

In next episode, we will deploy this project to cloud.

In the meantime, you can learn more about LoopBack in [past blogs](https://strongloop.com/strongblog/tag_LoopBack.html).
