// mount web app framework
const express = require("express");

const router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  res.redirect("/views/index.html");
});

module.exports = router;