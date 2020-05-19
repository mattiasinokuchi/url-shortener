// mount web app framework
const express = require("express");

// create new router object
const router = express.Router();

// mounts middleware function for shortened URL's
router.get("/api/shorturl/:urlId", (req, res) => {
  const { urlId } = req.params;
  // find URL in database...
  MongooseModel.find({ short_url: urlId }, (err, data) => {
    if (err) return console.log(err);
    // ...and redirect accordingly
    res.redirect(data[0].href);
  });
});




module.exports = router;