$(function() {
  var mediaDropzone;
  mediaDropzone = new Dropzone("#media-dropzone");
  mediaDropzone.on("addedfile", function(file) {
    getCoords(file, function(coords) {
    $('#lat').val(coords.lat);
    $('#lng').val(coords.lng)
    // alert("added to hidden field: "+coords.lat+" "+coords.lng )
    })
  });
  mediaDropzone.on("sending", function(file, xhr, formData) {
    getCoords(file, function(coords) {
    // alert("attempting to append to formData: "+coords.lat+" "+coords.lng )
    formData.append("coords", coords);
    })
  });
  mediaDropzone.on("success", function(file, responseText) {
  // alert("This event should fire last")
  appendImage(responseText.file.url, responseText.id);
  setTimeout(function(){
    $(file.previewElement).fadeOut(2000)
    }, 1000);
  });
});

function exifCoordToDec(exifCoord) {
  var degreeDec = exifCoord[0].numerator
  var minuteDec = exifCoord[1].numerator / (60 * exifCoord[1].denominator)
  var secondDec =  exifCoord[2].numerator / (3600 * exifCoord[2].denominator)
  return degreeDec + minuteDec + secondDec
};

function getCoords(image, callback) {
  EXIF.getData(image, function() {
    var lng = EXIF.getTag(this, 'GPSLongitude');
    var lat = EXIF.getTag(this, 'GPSLatitude');
    var lngDec = exifCoordToDec(lng)
    var latDec = exifCoordToDec(lat)
    callback({lat:latDec, lng:lngDec})
  });
};

var appendImage = function(imageUrl, mediaId) {
  var imageMarkup = '<img src="' + imageUrl + '"/>' +
    '<input id="media_contents_" name="media_contents[]" value="' + mediaId +'" type="checkbox" class="checkbox">'
  $(imageMarkup).hide().appendTo(".saved-images").fadeIn(1500)
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