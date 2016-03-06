var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

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

module.exports = router;
