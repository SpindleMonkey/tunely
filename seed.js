// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var albumsList =[];

albumsList.push({
              artistName: 'the Old Kanye',
              name: 'The College Dropout',
              releaseDate: '2004, February 10',
              genres: [ 'rap', 'hip hop' ]
            });
albumsList.push({
              artistName: 'the New Kanye',
              name: 'The Life of Pablo',
              releaseDate: '2016, Febraury 14',
              genres: [ 'hip hop' ]
            });
albumsList.push({
              artistName: 'the always rude Kanye',
              name: 'My Beautiful Dark Twisted Fantasy',
              releaseDate: '2010, November 22',
              genres: [ 'rap', 'hip hop' ]
            });
albumsList.push({
              artistName: 'the sweet Kanye',
              name: '808s & Heartbreak',
              releaseDate: '2008, November 24',
              genres: [ 'r&b', 'electropop', 'synthpop' ]
            });

var sampleSongs = [];

sampleSongs.push({ name: 'Famous',
                   trackNumber: 1
});
sampleSongs.push({ name: "All of the Lights",
                   trackNumber: 2
});
sampleSongs.push({ name: 'Guilt Trip',
                   trackNumber: 3
});
sampleSongs.push({ name: 'Paranoid',
                   trackNumber: 4
});
sampleSongs.push({ name: 'Ultralight Beam',
                   trackNumber: 5
});
sampleSongs.push({ name: 'Runaway',
                   trackNumber: 6
});
sampleSongs.push({ name: 'Stronger',
                   trackNumber: 7
});

console.log('well, i am here');
db.Album.remove({}, function(err, albums){
  console.log('album.remove');
  if (err) { return console.log('ERROR::' + err); }
  albumsList.forEach(function(albumData) {
    console.log('inside forEach');
    var newAlbum = new db.Album({
      artistName: albumData.artistName,
      name: albumData.name,
      releaseDate: albumData.releaseDate,
      genres: albumData.genres,
      songs: sampleSongs
    });
    newAlbum.save(function(err, theAlbum) {
       if (err) { return console.log('ERROR::' + err); }
       console.log('saved ' + theAlbum);
     });
  });
});

