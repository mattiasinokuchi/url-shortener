// mount web app framework
const express = require("express");

// create route handler
const router = express.Router();

// GET home page
router.get('/', (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

module.exports = router;