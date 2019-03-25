# Teleprompter
A small website to communicate with a telepromter from remote. 

## Requirements
To run the telepromter app you need [node](https://nodejs.org/en/download/) on your machine. 

## Install
```bash
# clone the repo
git clone git@github.com:neue-welt/teleprompter.git
# go into directory
cd telepromter
# install dependencies
npm install
```

## Start server
```bash
# start the server
npm run start
```
Open a browser and navigate to [http://localhost:3030](http://localhost:3030).  There you will se the primary user interface

## dockerized
We run the project in a k8 cluster. To build the correspondig docker container run 
## Origin & Credits
The project mainly base on the [feather-js chat demo](https://github.com/feathersjs/feathers). We use mongo instead of netDB and changed the behaviour of the frontend. But most of the credits goes to [feathersjs](https://github.com/feathersjs)
