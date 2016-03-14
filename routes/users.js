var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
mongoose.connect(process.env.MONGOLAB_URI, options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
});

var Schema = mongoose.Schema;
var rsvpSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    rehearsalDinner: Boolean,
    wedding: Boolean
});

var Guest = mongoose.model('Guest', rsvpSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('rsvp', {})
});

router.post('/', function(req, res, next ) {
  var guest = req.body;
  guest.fullName = req.body.firstName + " "+  req.body.lastName;
  console.log(guest);
  Guest.findOne({ 'fullName': guest.fullName }, 'firstName lastName fullName rehearsalDinner wedding', function (err, found) {
    if (err) return handleError(err);
    if (found) {
      console.log(found.fullName + ' was found in the database!');
      res.render('guest', {guest: found})
    } else {
      console.log('no doc! let us insert it now');
      var newGuest = new Guest({ firstName: guest.firstName, lastName: guest.lastName, fullName: guest.fullName, rehearsalDinner: guest.rehearsalDinner, wedding: guest.wedding });
      newGuest.save(function (err, newGuest) {
        if (err) return console.error(err);
      });
    }
    // console.log('%s %s is a %s.', guest.firstName, guest.lastName, guest.rehearsalDinner, guest.wedding) // Space Ghost is a talk show host.
    res.render('yay', {guest: guest})
  })
})



router.get('/all', function (req, res, next) {
  Guest.find(function (err, guests) {
    if (err) return console.error(err);
    console.log(guests);
    res.render('all', {guests: guests})
  })
})



module.exports = router;
