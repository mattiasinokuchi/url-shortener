// avoid unsafe syntax, silent errors and make web app faster
"use strict";

// mount web app framework
const express = require("express");

// mount database
const mongo = require("mongodb");

// mount database framework
const mongoose = require("mongoose");

// mount module to allow verification by FCC
const cors = require("cors");

// mount module for validation of URL
const dns = require("dns");

// mount module to parse POST bodies
const bodyParser = require("body-parser");

// create web server
const app = express();

// define a port for the web server to listen to
const port = process.env.PORT || 3000;

// connect and set up database
mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

// set up web server with path for static files
app.use("/public", express.static(process.cwd() + "/public"));

// set up routing for web page
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// set up module for verification of the project by FCC
app.use(cors());

// set up module to parse POST bodies
app.use(bodyParser.urlencoded({ extended: false }));

// define schema (constructor) for MongoDB documents
const mongooseSchema = new mongoose.Schema({
  original_url: String,
  short_url: String,
  href: String
});

// define model (class) for MongoDB documents
const MongooseModel = mongoose.model("MongooseModel", mongooseSchema);

// POST a URL...
app.post("/api/shorturl/new", (req, res) => {
  let url = new URL(req.body.url);
  // ...check if the URL is valid...
  dns.lookup(url.hostname, err => {
    if (err) {
      // ...respond with an error or...
      console.error(err);
      res.json({
        error: "invalid URL"
      });
    } else {
      // count URL's in database...
      let urlCounts = 0;
      MongooseModel.estimatedDocumentCount({ }, (err, count) => {
        if (err) return console.error(err);
        urlCounts = count;
        console.log(urlCounts);
        let mongodbDocument = new MongooseModel({
          original_url: url.hostname,
          short_url: urlCounts,
          href: url.href
        });
        mongodbDocument.save((err, data) => {
          if (err) return console.error(err);
          res.json({
            original_url: data.original_url,
            short_url: data.short_url
          });
        });
      });
      // ...save URL in database and respond
    }
  });
});

// get input from client...
app.get("/api/shorturl/:urlId", (req, res) => {
  const { urlId } = req.params;
  // ...find URL in database...
  MongooseModel.find({ short_url: urlId }, (err, data) => {
    if (err) return console.log(err);
    // ...and redirect accordingly
    res.redirect(data[0].href);
  });
});

// count documents in database
/*MongooseModel.estimatedDocumentCount({ }, (err, count) => {
  if (err) return console.error(err);
  console.log('there are %d documents', count);
});

// log all documents in database
MongooseModel.find((err, doc) => {
  if (err) return console.error(err);
  console.log(doc);
});*/

app.listen(port, () => {
  console.log("Node.js listening ...");
});
