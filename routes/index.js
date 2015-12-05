var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Gross Wedding' });
});

router.get('/cabins', function(req, res, next) {
  res.render('cabins', {});
});

router.get('/lodging', function(req, res, next) {
  res.render('lodging', {});
})

router.get('/todo', function(req, res, next) {
  res.render('todo', {});
})

router.get('/getting', function(req, res, next) {
  res.render('getting', {});
})

module.exports = router;
