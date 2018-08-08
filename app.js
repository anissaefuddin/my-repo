'use strict';
// [START datastore_quickstart]
// Imports the Google Cloud client library
const Datastore = require('@google-cloud/datastore');

// Your Google Cloud Platform project ID
const projectId = 'dimans2018-212506';

// import express, { Router, Request } from 'express';
const express = require('express');
//import router express (routing)
const router = express.Router();
//import json body parsing
const bodyParser= require('body-parser');
//init app from express()
const app = express();
app.use(bodyParser.json());

// Creates a client
const datastore = new Datastore({
    projectId: projectId,
  });


// The kind for the new entity
const kind = 'Task';
// The name/ID for the new entity
const name = 'sampletask1';
// The Cloud Datastore key for the new entity
const taskKey = datastore.key([kind, name]);

// Prepares the new entity
const task = {
  key: taskKey,
  data: {
    description: 'Buy milk',
  },
};  


app.get("/jajal", function(req, res) {
    // here we will have logic to return all users
    res.send('Okeey');
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});











// Saves the entity
datastore
  .save(task)
  .then(() => {
    console.log(`Saved ${task.key.name}: ${task.data.description}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
// [END datastore_quickstart]
