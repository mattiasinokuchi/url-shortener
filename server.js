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

// set up web server with path for static files
app.use('/public', express.static(process.cwd() + '/public'));

// set up routing for web page
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// set up module for verification of the project by FCC
app.use(cors());

// set up module to parse POST bodies
app.use(bodyParser.urlencoded({extended: false}));

// define schema (constructor) for MongoDB documents
const mongooseSchema = new mongoose.Schema ({
  original_url: {
    type: String,
    unique: false
  },
  href: {
    type: String,
    unique: false
  }
});

// define model (class) for MongoDB documents 
const MongooseModel = mongoose.model ("MongooseModel", mongooseSchema);
  
// POST a URL...
console.log("POST a URL...");
app.post("/api/shorturl/new", (req, res) => {
  console.log("...pick up URL...");
  let url = new URL(req.body.url);
  // ...check if the URL is valid...
  console.log("...check if the URL is valid...");
  dns.lookup(url.hostname, (err) => {
    if (err) {
      console.log("...respond with an error or...");
      // ...respond with an error or...
      console.error(err);
      res.json({
        error: "invalid URL"
      });
    } else {
      console.log("...save document with URL in database...");
      // ...save document with URL in database...
      let mongodbDocument = new MongooseModel({
        original_url: url.hostname,
        href: url.href
      });
      mongodbDocument.save((err, data) => {
        if (err) return console.error(err);
        console.log(data);
      });
      console.log("...find and respond with URL and object ID");
      // ...find and respond with URL and object ID
/*      MongooseModel.find({original_url: url.hostname}, (err, data) => {
        if (err) return console.log(err);
        res.json({
          original_url: data[0].original_url,
          short_url: data[0]._id
        });
      });*/
    }
  });
});

// get input from client...
app.get("/:urlId", (req, res) => {
  const { urlId } = req.params;
  // ...find document with URL with object ID...
  MongooseModel.find({_id: urlId}, (err, data) => {
    if (err) return console.log(err);
    // ...and redirect to URL
    res.redirect(data[0].href);
  });
});

// log all documents in database
MongooseModel.find((err, doc)=> {
  if (err) return console.error(err);
  console.log(doc);
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});