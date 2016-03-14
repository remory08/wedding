var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGOLAB_URI);
// var db = mongoose.connection;

var songSchema = mongoose.Schema({
  songID: String,
  songName: String,
  songLink: String
});

var Song = mongoose.model('Song', songSchema);

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_ID,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri : 'http://localhost:3000/callback'
});

/* GET songs page. */
router.get('/', function(req, res, next) {
  res.render('tracks', {});
});

router.get('/searchTrack', function(req,res, next) {
  spotifyApi.searchTracks(req.query.trackQuery)
  .then(function(data) {
    var tracks = data.body.tracks.items;
    res.render('tracks', {tracks: tracks});
  }, function(err) {
    console.error(err);
  });
});

router.get('/searchArtistTracks', function(req,res,next) {
  spotifyApi.searchTracks('artist:'+req.query.artistTrackQuery)
  .then(function(data) {
    var aTracks = data.body.tracks.items;
    res.render('tracks', {aTracks: aTracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

router.post('/request', function(req, res, next) {
  var song = req.body
  Song.findOne({'songName': song.songName }, 'songName songId songLink', function (err, found) {
    if (err) return handleError(err);
    if (found) {
      console.log(found.songName + ' was found in the database!');
      res.render('yay', {song: found})
    } else {
      console.log('no doc! let us insert it now');
      var newSong = new Song({ songName: song.songName, songId: song.songId, songLink: song.songLink });
      newSong.save(function (err, newSong) {
        if (err) return console.error(err);
      });

    }
      res.render('yay', {song: song})
  })

})

module.exports = router;
