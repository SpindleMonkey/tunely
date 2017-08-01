/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */

$(document).ready(function() {
  console.log('app.js loaded!');

  $.ajax({
    method: 'GET',
    url: '/api/albums',
    success: handleSuccess,
    error: handleError
  });

function handleSuccess(json) {
  console.log(json);
  //var albums = JSON.parse(json);
  json.forEach(function(album) {
    renderAlbum(album);
  });
}

function handleError() {
  console.log('failed to get albums');
  $('#albums').text('failed to get albums. sorry.');
}


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  //console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" + buildSongsHtml(album.songs) +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <div class='panel-footer'>" +
  "                  <button class='btn btn-primary add-song'>Add Song</button>" +
  "                </div>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $('#albums').append(albumHtml);
}

function buildSongsHtml(songs) {
  //console.log(songs);
  var songList = "";
  for (var i = 0; i < songs.length; i++) {
    songList = songList + " &mdash; (" + songs[i].trackNumber + ") " + songs[i].name;
  }
  //console.log(songList);

  var songHtml = 
  "<li class='list-group-item'>" +
  "<h4 class='inline-header'>Songs:</h4>" +
  "<span> " + songList + " &mdash; </span>" +
  "</li>";

  //console.log(songHtml);

  return songHtml;
}

$("form").on('submit', function(event) {
  event.preventDefault();
  var str = $(this).serialize();
  //console.log(str);

  $.ajax({
    method: 'POST',
    url: '/api/albums',
    data: str,
    success: handlePostSuccess,
    error: handlePostError
  });

  // clear the form
  $(this)[0].reset();
});

function handlePostSuccess(json) {
  //console.log(json);
  renderAlbum(json);
}

function handlePostError() {
  console.log('failed to add new album. sorry.');
}

$('#albums').on('click', '.add-song', function(event) {
  //event.preventDefault();
  var id = $(this).parents('.album').data('album-id');
  //console.log('id: ' + id);
  $('#songModal').data('album-id', id);
  $('#songModal').modal();
});

//saveSong
$('#saveSong').on('click', function(event) {
  handleNewSongSubmit();
});

function handleNewSongSubmit() {
  var url = '/api/albums/' + $('#songModal').data('album-id') + '/songs';
  //console.log(url);

  // get the data from the modal
  var newSong = {
    name: $('#songName').val(),
    trackNumber: $('#trackNumber').val() 
  };
  //console.log(newSong);

  $.ajax({
    method: 'POST',
    url: url,
    data: newSong,
    success: handleNewSongSuccess,
    error: handleNewSongError
  });
}

function handleNewSongSuccess(json) {
  var url = '/api/albums/' + $('#songModal').data('album-id');
  //console.log(url);

  // get the new album info
  $.ajax({
    method: 'GET',
    url: url,
    success: handleUpdatedAlbumSuccess,
    error: handleUpdatedAlbumError
  });
}

function handleNewSongError() {
  console.log('failed to add new song. sorry.');
}

function handleUpdatedAlbumSuccess(json) {
  //onsole.log(json);
  // need to find the right div
  var $albumDiv = $("div").find("[data-album-id='" + json._id + "']");
  //console.log($albumDiv);
  // remove the current contents
  $albumDiv.remove();
  //console.log($albumDiv);

  // write out the new contents
  renderAlbum(json);

  $('#songModal').modal('hide');

}

function handleUpdatedAlbumError() {
  console.log('failed to get update album. sorry.');
}


});

