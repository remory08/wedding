var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/guests');
var rsvp = db.get('rsvp');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('rsvp', {})
});

router.post('/', function(req, res, next ) {
  var guest = req.body;
  guest.guest_full_name = req.body.guest_first_name + " "+  req.body.guest_last_name;
  rsvp.findOne({guest_full_name: guest.guest_full_name}, function (err, doc) {
    if (err) throw err;
    if (doc) {
      console.log(doc);
      res.render('guest', {guest: doc})
    } else {
      console.log('no doc! let us insert it now');
      rsvp.insert(guest, function (err, guest) {
        if (err) throw err;
      })
      res.render('yay', {guest: guest})
    }
  })
})

router.get('/all', function (req, res, next) {
  rsvp.find({}, function (err, docs) {
    console.log(docs);
    res.render('all', {guests: docs})
  })
})



module.exports = router;
