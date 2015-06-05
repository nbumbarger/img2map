function initMain(mapboxToken, geoJSON) {

  $(function() {
    var mediaDropzone;
    // Initialize upload dropzone
    mediaDropzone = new Dropzone("#media-dropzone");
    // When file is dropped, extract coordinates from image and convert to DD
    mediaDropzone.on("addedfile", function(file) {
      getCoords(file, function(coords) {
      // Store converted lat/long in hidden fields
      $('#lat').val(coords.lat);
      $('#lng').val(coords.lng)
      })
    });
    // When upload succeeds...
    mediaDropzone.on("success", function(file, responseText) {
      // ...append image to image manager
      appendImage(responseText.file.url, responseText.id);
      setTimeout(function(){
        // reload JSON into the map
        loadFeatures();
        // Remove upload status files
        $(file.previewElement).fadeOut(2000)
        }, 1000);
    });
  });

  // Convert a coordinate in degrees, minutes seconds format to decimal
  function exifCoordToDec(exifCoord) {
    var degreeDec = exifCoord[0].numerator
    var minuteDec = exifCoord[1].numerator / (60 * exifCoord[1].denominator)
    var secondDec =  exifCoord[2].numerator / (3600 * exifCoord[2].denominator)
    return degreeDec + minuteDec + secondDec
  };

  // Get coordinates from the GPSLat and Long EXIF attributes of the image
  function getCoords(image, callback) {
    EXIF.getData(image, function() {
      var lng = EXIF.getTag(this, 'GPSLongitude');
      var lat = EXIF.getTag(this, 'GPSLatitude');
      var lngDec = exifCoordToDec(lng)
      var latDec = exifCoordToDec(lat)
      callback({lat:latDec, lng:lngDec})
    });
  };

  // Append uploaded images to image manager 
  var appendImage = function(imageUrl, mediaId) {
    var imageMarkup = '<img src="' + imageUrl + '"/>' +
      '<input id="media_contents_" name="media_contents[]" value="' + mediaId +'" type="checkbox" class="checkbox">'
    $(imageMarkup).hide().appendTo(".saved-images").fadeIn(1500)
  };
  
  L.mapbox.accessToken = mapboxToken;
  // Initialize map frame with default zoom behavior disabled
  var map = L.mapbox.map('map', 'mapbox.streets', {doubleClickZoom: false})
    // Add custom zoom behavior (pan to center of double-click event)
    .on('dblclick', function(e) {
      map.setView(e.latlng, map.getZoom() + 1)
    });
  // Add empty feature layer to map frame
  var featureLayer = L.mapbox.featureLayer()
    featureLayer.on('layeradd', function(e){
      addPopups(e)
    })
    .addTo(map)

  // Load features from GeoJSON server
  function loadFeatures() {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: geoJSON})
    .done(function (geojson) { 
      // Load response GeoJSON into feature layer
      featureLayer.setGeoJSON(geojson);
      // Fit map to bounding coordinates of features
      map.fitBounds(featureLayer.getBounds(), map.getZoom() - 10);
    });
  };

  // Add HTML to map popup baloons
  function addPopups(e) {
      var marker = e.layer;
      var feature = marker.feature;
        marker.bindPopup(feature.properties.popup_html, {
          closeButton: false
    });
  };
}

// getCoords (HTTP Request version). I may need this later.
// function getCoords(imageUrl) {
//   var http = new XMLHttpRequest();
//   http.open("GET", imageUrl, true);
//   http.responseType = "blob";
//   http.onload = function(e) {
//     if (this.status === 200) {
//       var image = new Image();
//       image.onload = function() {
//         EXIF.getData(image, function() {
//           var lng = EXIF.getTag(this, 'GPSLongitude');
//           var lat = EXIF.getTag(this, 'GPSLatitude');
//           var lngDec = exifCoordToDec(lng)
//           var latDec = exifCoordToDec(lat)
//           console.log(lngDec)
//           console.log(latDec)
//           $('#lat').val(latDec);
//           $('#lng').val(lngDec)
//         });
//       };
//       image.src = URL.createObjectURL(http.response);
//     }
//   };
//   http.send();
// };