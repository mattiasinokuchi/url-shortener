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
    unique: true
  },
  short_url: {
    type: String,
    unique: true
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
  
// short URL generator
let urlCount = 0;
MongooseModel.find({urlCount}, (err, count) => {
  if (err) return console.error(err);
  urlCount = count;
});

/*    // searches for duplicate URL in the database
      MongooseModel.find({ original_url: url}, (err, docs) => {
        if (err) return console.error(err);
      });
*/

// POST a URL
app.post("/api/shorturl/new", (req, res) => {
  let url = new URL(req.body.url);
  // Check if the URL is valid
  dns.lookup(url.hostname, (err, address, family) => {
    if (err) {
      console.error(err);
      res.json({
        error: "invalid URL"
      });
    } else {
      let mongodbDocument = new MongooseModel({
        original_url: req.body.url,
        short_url: documentCount
      });
      mongodbDocument.save((err, data) => {
        if (err) return console.error(err);
      });
      res.json({
        original_url: req.body.url,
        short_url: documentCount});
    }
  });
  
});

// log documents in database
MongooseModel.find((err, documents)=> {
  if (err) return console.error(err);
  console.log(documents);
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});