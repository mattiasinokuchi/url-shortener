'use strict';

const express = require('express');

//mounts the database
const mongo = require('mongodb');

//mounts the　database framework
const mongoose = require('mongoose');

const cors = require('cors');

//mounts the dns module
const dns = require("dns");

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

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// count documents in the database
let documentCount = 0;
MongooseModel.countDocuments((err, count) => {
  if (err) return console.error(err);
  documentCount = count+1;
});

// dns lookup
dns.lookup("www.freecodecamp.org", (err, address, family) => {
  if (err) return console.error(err);
  console.log('address: %j family: IPv%s', address, family);
});

// POST and saves documents
app.post("/api/shorturl/new", (req, res) => {
  dns.lookup(req.body.url, (err, address, family) => {
    if (err) return console.error(err);
    console.log('address: %j family: IPv%s', address, family);
  });
  let mongodbDocument = new MongooseModel({
    original_url: req.body.url,
    short_url: documentCount
  });
  mongodbDocument.save((err, data) => {
    if (err) return console.error(err);
  });
  res.json({original_url: req.body.url,
    short_url: documentCount});
});

// log documents in database
MongooseModel.find((err, documents)=> {
  if (err) return console.error(err);
  console.log(documents);
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});