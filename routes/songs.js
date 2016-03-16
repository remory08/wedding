var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var mongoose = require('mongoose');
//var dbal = require('../middlewares/db.js');
var db = mongoose.connection;

var songSchema = mongoose.Schema({
  songID: String,
  songName: String,
  songLink: String,
  songUri: String,
  songArtists: Array,
  songLead: String,
  songPreview: String,
});

var Song = mongoose.model('Song', songSchema);

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_ID,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri : process.env.REDIRECT_URI
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
  Song.findOne({'songName': song.songName }, 'songName songId songLink songUri songArtists songPreview', function (err, found) {
    if (err) return handleError(err);
    if (found) {
      console.log(found.songName + ' was found in the database!');
      res.render('yay', {song: found})
    } else {
      console.log('no doc! let us insert it now');
      var newSong = new Song({ songName: song.songName, songId: song.songId, songLink: song.songLink, songUri: song.songUri, songPreview: song.songPreview, songArtists: song.songArtists, songLead: song.songLead });
      newSong.save(function (err, newSong) {
        if (err) return console.error(err);
      });
    }
      res.render('yay', {song: song})
  })

})

module.exports = router;
