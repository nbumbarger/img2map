function main(mapboxToken, geoJSON) {

  $(function() {
    // Initialize #image-dropzone form as uploader dropzone
    var imageDropzone = new Dropzone("#image-dropzone");
  })
  // Configure the uploader and define its callback behavior
  initUploader()
  // Configure map and associate with #map div
  var map = initMap()
  // Configure feature container and add to map
  var featureLayer = addFeatureLayer()
  // Load and center existing features, if applicable
  loadFeatures()

  // ---------------------------------------------------------------------
  // BEGIN uploader functions --------------------------------------------
  // ---------------------------------------------------------------------
    function initUploader() {
    // Prevent form in HTML from starting a default dropzone instance
    Dropzone.autoDiscover = false;
    // Set uploader options, suspend automatic processing of queue
    Dropzone.options.imageDropzone = {
      autoProcessQueue: false,
      uploadMultiple: false,
      acceptedFiles: 'image/jpeg,image/tiff',
      dictDefaultMessage: 'Drop images here to add to map',
      // Define callbacks for upload events
      init: function() {
        var imageDropzone = this;
        // When file is first added to the dropzone:
        imageDropzone.on("addedfile", function(file) {
          // (alert and abort if no GPS EXIF data. Not DRY- refactor when possible)
          EXIF.getData(file, function() {
            if (typeof EXIF.getTag(file, 'GPSLongitude') == 'undefined' &&
                typeof EXIF.getTag(file, 'GPSLatitude')  == 'undefined') {
              alert('This file does not include location metadata. Please ensure that your imaging device includes GPS functionality and that location sharing is enabled.')
              imageDropzone.removeAllFiles();
              return;
              // (if GPS EXIF data exists, start processing here)
            } else  {
              // Extract coords and convert to decimal using getCoords callback;
              getCoords(file, function(coords) {
                // Store calculated lat/lng in form before initiating POST;
                $('#lat').val(coords.lat);
                $('#lng').val(coords.lng);
                // Resume processing the image queue (POST the form data).
                imageDropzone.processQueue()
                // This POST asynchronously uploads image to the cloud and saves its
                // metadata to the database by way of the image#create controller and
                // the uploader. Image model functions and the image#index controller
                // together define the GeoJSON interface for the uploaded image data.
              });
            };
          })
        });
        // When image upload returns success:
        imageDropzone.on("success", function(file, responseText) {
          // Run function to append image to image-manager div;
          appendImage(file.name, responseText.file.url, responseText.id);
          // Run function to refresh the map contents;
          loadFeatures();
          // Fade out upload status/preview thumbnails;
          $(file.previewElement).fadeOut(2000);
          setTimeout(function() {
            // Remove all files from the upload area.
            imageDropzone.removeAllFiles();
          }, 2000);
        });
    }};
  };

  function getCoords(image, callback) {
    // Get EXIF data from image
    EXIF.getData(image, function() {
      console.log(image)
      // Extract raw GPS coordinate information from EXIF data
      var lngAry = EXIF.getTag(this, 'GPSLongitude');
      var latAry = EXIF.getTag(this, 'GPSLatitude');
      var lngRef = EXIF.getTag(this, 'GPSLongitudeRef');
      var latRef = EXIF.getTag(this, 'GPSLatitudeRef');
      // Convert coordinate information to decimal degrees
      var lngDec = convertExifCoordData(lngAry, lngRef);
      var latDec = convertExifCoordData(latAry, latRef);
      // Return decimal coordinate object
      callback({lat:latDec, lng:lngDec});
    });
  };

  function convertExifCoordData(coordAry, hemisphere) {
    // Convert coordinate arrays to degrees, minutes, seconds
    var degree = coordAry[0].numerator;
    var minute = coordAry[1].numerator / coordAry[1].denominator;
    var second = coordAry[2].numerator / coordAry[2].denominator;
    // Convert DMS to decimal degrees
    var decimalDegrees = degree + (minute / 60) + (second / 3600);
    // Extract hemisphere ID from binary data
    hemisphere = hemisphere.charAt(0);
    // Return negative decimals if W or S hemisphere, positive if E or W
    if (hemisphere === 'W' || hemisphere === 'S') {
      return -decimalDegrees;
    } else {
      return decimalDegrees;
    };
  };

  // Append image thumbnail to the image-manager following successfull upload
  var appendImage = function(imageName, imageUrl, imageId) {
    // Sub-function to format image name with capitalization and no extension
    function formatImgAlt(imageName) {
      var imageName = imageName.slice(0, -4);
      return imageName.charAt(0).toUpperCase() + imageName.slice(1);
    };
    // Build HTML for image thumbnail
    var imageMarkup = '<img alt="' + formatImgAlt(imageName) + '" src="' +
        imageUrl + '"/>' +'<input checked="checked" class="checkbox"' +
        'id="images_" name="images[]" type="checkbox" value="' +
        imageId + '"/>';
    // Append image thumbnail to the image-manager div, and fade it in
    $(imageMarkup).hide().appendTo(".saved-images").fadeIn(1500);
    // Enable the image manager's delete button, if previously disabled
    $("#delete").removeAttr('disabled');
  };
  // ---------------------------------------------------------------------
  // END uploader functions ----------------------------------------------
  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // BEGIN map functions -------------------------------------------------
  // ---------------------------------------------------------------------
  function initMap() {
    // Checkout the Mapbox API
    L.mapbox.accessToken = mapboxToken;
    // Initialize map frame with default zoom behavior disabled, center on DC
    var map = L.mapbox.map('map', 'mapbox.streets', {doubleClickZoom: false })
    .setView([38.895, -77.036], 5)
    // Add custom zoom behavior to map (pan to center of double-click event)
    .on('dblclick', function(e) {
      map.setView(e.latlng, map.getZoom() + 1);
    });
    return map;
  };

  function addFeatureLayer() {
    // Define Mapbox empty Mapbox feature container
    var featureLayer = L.mapbox.featureLayer();
    // Add HTML popup baloons to to each feature on add event
    featureLayer.on('layeradd', function(event) {
      addPopups(event);
    })
    // Add empty feature container to map frame
    .addTo(map);
    return featureLayer;
  }

  // Refresh featureLayer with latest features in the database
  function loadFeatures() {
    //  GET current snapshot of database
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: geoJSON})
    .done(function (geojson) {
      // On success, if not empty, load response GeoJSON into featureLayer
      if (geojson.length > 0) {
        featureLayer.setGeoJSON(geojson);
        // Fit map to bounding coordinates of features
        map.fitBounds(featureLayer.getBounds());
      };
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
  // ---------------------------------------------------------------------
  // END map functions ---------------------------------------------------
  // ---------------------------------------------------------------------
};
