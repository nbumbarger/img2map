function initMapView(mapboxToken, geoJSON) {

  L.mapbox.accessToken = mapboxToken;
  // Initialize map frame with default zoom behavior disabled
  var map = L.mapbox.map('map', 'mapbox.streets', {doubleClickZoom: false})
    // Add custom zoom behavior (pan to center of double-click event)
    .on('dblclick', function(e) {
      map.setView(e.latlng, map.getZoom() + 1)
    });
  // Add empty feature layer to map frame
  var featureLayer = L.mapbox.featureLayer()
    .on('ready', run())
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

  function addPopups(e) {
      var marker = e.layer;
      var feature = marker.feature;
        marker.bindPopup(feature.properties.popup_html, {
          closeButton: false
    });
  };

  function run() {
    window.setInterval(function() {
        loadFeatures();
        console.log("loaded")
    }, 2000);
}


//   L.mapbox.accessToken = mapboxToken;
//   // Define map control, adding it to map div.
//   var map = L.mapbox.map('map', 'mapbox.streets');

//   // Define geocoder control
//   var gc = L.mapbox.geocoderControl('mapbox.places',
//     { position: 'topright', 
//       keepOpen: false })
//     .addTo(map)
// };

// var featureLayer = L.mapbox.featureLayer()
//     .loadURL('https://wanderdrone.appspot.com/')
//     // Once this layer loads, we set a timer to load it again in a few seconds.
//     .on('ready', run)
//     .addTo(map);

// function run() {
//     featureLayer.eachLayer(function(l) {
//         map.panTo(l.getLatLng());
//     });
//     window.setTimeout(function() {
//         featureLayer.loadURL('https://wanderdrone.appspot.com/');
//     }, 2000);
// }

}