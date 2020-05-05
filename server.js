// avoid unsafe syntax, silent errors and make web app faster
'use strict';

// mount web app framework
const express = require('express');

// mount database
const mongo = require('mongodb');

// mount database framework
const mongoose = require('mongoose');

// mount module for verification of the project by FCC 
const cors = require('cors');

// mount module for validation of URL
const dns = require("dns");

// mount module to parse POST bodies
const bodyParser = require("body-parser");

// create web server
const app = express();

// define a port for the web server to listen to 
const port = process.env.PORT || 3000;

// connect database
mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

// set web server with path for static files
app.use('/public', express.static(process.cwd() + '/public'));

// set routing for web page
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// enable module for verification of the project by FCC
app.use(cors());

// enable module to parse POST bodies
app.use(bodyParser.urlencoded({extended: false}));

// define schema (constructor) for MongoDB documents
const mongooseSchema = new mongoose.Schema ({
  original_url: {
    type: String,
    unique: false
  },
});

// define model (class) for MongoDB documents 
const MongooseModel = mongoose.model ("MongooseModel", mongooseSchema);
  
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
        original_url: url.hostname
      });
      mongodbDocument.save((err, data) => {
        if (err) return console.error(err);
      });
      MongooseModel.findOne({original_url: url.hostname}, (err, data) => {
        if (err) return console.log(err);
        res.json({
          original_url: "hej",
          short_url: "hej"
        });
      });
    }
  });
});

// get input from client
app.get("/:urlId", (req, res) => {
  const { urlId } = req.params;
  res.json({echo: urlId});
});

// log all documents in database
MongooseModel.find((err, doc)=> {
  if (err) return console.error(err);
  console.log(doc);
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});