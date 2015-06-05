function initMapView(mapboxToken) {

  L.mapbox.accessToken = mapboxToken;
  // Define map control, adding it to map div.
  var map = L.mapbox.map('map', 'mapbox.streets');

  // Define geocoder control
  var gc = L.mapbox.geocoderControl('mapbox.places',
    { position: 'topright', 
      keepOpen: false })
    .addTo(map)
};