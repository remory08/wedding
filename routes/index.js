var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gross Wedding' });
});

router.get('/cabins', function(req, res, next) {
  res.render('cabins', {});
});

module.exports = router;
