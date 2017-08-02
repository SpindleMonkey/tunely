// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

var db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    //documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://localhost:3000",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"},
      {method: "GET", path: "/api/albums/:id", description: "get a single album by id"},
      {method: "POST", path: "/api/albums", description: "add a new album"},
      {method: "POST", path: "/api/albums/:album_id/songs", description: "add a new song to an album"},
      {method: "DELETE", path: "/api/albums/:album_id", description: "delete an album by id"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res) {
  db.Album.find({}, function(err, albums) {
    if (err) res.status(404).send('albums not found. sorry.');
    res.json(albums);
  });
});

app.get('/api/albums/:id', function album_show(req, res) {
  db.Album.findById(req.params.id, function(err, album) {
    if (err) res.status(404).send('could not find that album. sorry.');
    res.json(album);
  });
});

app.post('/api/albums', function album_post(req, res) {
  console.log('adding new album');
  //console.log(req.body.genres);
  req.body.genres = req.body.genres.split(', ');
  //console.log(genres);

  db.Album.create(req.body, function(err, album) {
    if (err) res.status(503).send('could not add new album. sorry');
    res.json(album);
  });
});

app.post('/api/albums/:album_id/songs', function album_add_song(req, res) {
  db.Album.find(req.params.album_id, function(err, album) {
    if (err) res.status(404).send('could not find album for new song. sorry.');
    db.Song.create(req.body, function(err, song) {
      if (err) res.status(503).send('could not add new song. sorry.');
      db.Album.update({_id: req.params.album_id}, { $push: {songs: song} }, function(err, album) {
        if (err) res.status(503).send('could not add song to album. sorry.');
        res.json(album);
      });
    });
  });
});

app.delete('/api/albums/:album_id', function album_delete(req, res) {
  db.Album.remove({_id: req.params.album_id}, function(err, album) {
    if (err) res.status(503).send('ERROR:' + err);
    res.status(200).send('album');
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
