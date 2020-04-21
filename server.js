'use strict';

const express = require('express');

//mounts the database
const mongo = require('mongodb');

//mounts the　database framework
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

//definition of the constructor for MongoDB documents
const mongooseSchema = new mongoose.Schema ({
  original_url: {
    type: String,
    unique: false
  },
  short_url: {
    type: String,
    unique: false
  }
});

//definition of the class (working copy of the constructor) for MongoDB documents 
const MongooseModel = mongoose.model ("MongooseModel", mongooseSchema);

//creates, saves and finds a MongoDB test document
let testDocument = new MongooseModel({
  original_url: "Hello World!",
  short_url: "Hello World!"
});

testDocument.save((err, testDocument) => {
  if (err) return console.error(err);
});

MongooseModel.find((err, documents)=> {
  if (err) return console.error(err);
  console.log(documents);
});

let removeManyPeople = (done) => {
  let nameToRemove = "Mary";
  MongooseModel.remove(
    { name: nameToRemove },
    (err, data) => {
      if (err) return console.log(err);
      done (null, data);
    }
  );
}

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});