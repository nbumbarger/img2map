function initMain(mapboxToken, geoJSON) {

  // Start uploader section --------------------
  $(function() {
    // Initialize upload dropzone
    var imageDropzone = new Dropzone("#image-dropzone");
    // When file is first dropped...
    imageDropzone.on("addedfile", function(file) {
      // ...extract coordinates from image and convert to decimal
      getCoords(file, function(coords) {
      // ... Store converted lat/lng in hidden fields
      $('#lat').val(coords.lat);
      $('#lng').val(coords.lng);
      });
    });
    // When upload succeeds...
    imageDropzone.on("success", function(file, responseText) {
      // ...append image to image manager
      appendImage(file.name, responseText.file.url, responseText.id);
      setTimeout(function(){
        // ...run the map refresh routine 
        loadFeatures();
        // ..fade out upload status/preview thumbnails
        $(file.previewElement).fadeOut(2000);
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

  // Get coordinates from the GPSLat and GPSLong EXIF attributes of the image
  function getCoords(image, callback) {
    EXIF.getData(image, function() {
      var lng = EXIF.getTag(this, 'GPSLongitude');
      var lat = EXIF.getTag(this, 'GPSLatitude');
      var lngDec = exifCoordToDec(lng);
      var latDec = exifCoordToDec(lat);
      callback({lat:latDec, lng:lngDec});
    });
  };

  // Append uploaded images to image manager
  var appendImage = function(imageName, imageUrl, imageId) {
    // Little function to cap and remove ext from img name
    function formatImgAlt(imageName) {
      var imageName = imageName.slice(0, -4);
      return imageName.charAt(0).toUpperCase() + imageName.slice(1);
    };
    var imageMarkup = '<img alt="' + formatImgAlt(imageName) + '" src="' + imageUrl + '"/>' +'<input checked="checked" class="checkbox" id="images_" name="images[]" type="checkbox" value="' + imageId + '"/>';
    $(imageMarkup).hide().appendTo(".saved-images").fadeIn(1500);
    $("#delete").removeAttr('disabled');
  };
  // End uploader section ----------------------

  // Start map section -------------------------
  L.mapbox.accessToken = mapboxToken;
  // Initialize map frame with default zoom behavior disabled
  var map = L.mapbox.map('map', 'mapbox.streets', {doubleClickZoom: false})
    // Add custom zoom behavior (pan to center of double-click event)
    .on('dblclick', function(e) {
      map.setView(e.latlng, map.getZoom() + 1);
    });
  // Define feature layer
  var featureLayer = L.mapbox.featureLayer();
  // Add HTML popups to each feature
  featureLayer.on('layeradd', function(e){
    addPopups(e);
  })
  // Add empty feature layer to map frame
  .addTo(map);

  // Get latest GeoJSON
  function loadFeatures() {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: geoJSON})
    .done(function (geojson) {
      // Load response GeoJSON into feature layer
      featureLayer.setGeoJSON(geojson);
      // Fit map to bounding coordinates of current features
      map.fitBounds(featureLayer.getBounds());
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
  // End map section ---------------------------

};

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