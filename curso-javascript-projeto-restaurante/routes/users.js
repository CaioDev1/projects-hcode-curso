var express = require('express');
var router = express.Router();

var connection = require('../inc/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM tb_users ORDER BY name', (err, results) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.send(results)
    }
  })
});

module.exports = router;
