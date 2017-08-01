var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Song = require('./song');

var AlbumSchema = new Schema( {
  name: String,
  artistName: String,
  releaseDate: String,
  genres: [String],
  songs: [Song.schema]
});

var Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
