// mount web app framework
const express = require("express");

// create new router object
const router = express.Router();

// add GET home page
router.get('/', (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

module.exports = router;