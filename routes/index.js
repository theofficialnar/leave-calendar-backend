var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('<h1>Nothing to do here.</h1>')
});

module.exports = router;
