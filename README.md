# IMG2MAP
## What it is
img2map is a proof-of-concept application which demonstrates a very easy-to-use method for mapping imagery (the theoretical easiest?). It takes advantage of the GPS metadata added to imagery by most modern smartphones and cameras to automatically determine image capture location, then maps image locations using the [Mapbox.js API](https://www.mapbox.com/mapbox.js/api/v2.1.9/).

As a usability experiment in addition to a mapping tool, this application features asynchronous, desktop-to-browser-to-cloud drag-and-drop uploading functionality through use of the [Dropzone.js library](http://www.dropzonejs.com/), which is interrupted mid-process to insert location extraction and calculation. Location-enabled images are served as geoJSON from the root URL of the application, and are loaded asynchronously into the Mapbox.js map control.

## Demonstration
To check it out, either clone a private version of the img2map repository using the instructions below, or visit the public demo at [img2map.herokuapp.com](http://img2map.herokuapp.com/). The image database is open and unmoderated, so please don't include private or inappropriate images (and prepare for the worst when visiting).
####Installation:
```sh
-   git clone git@github.com:nbumbarger/img2map.git #clone project
-   cd img2map #move to project directory
-   bundle install #install project dependencies
-   rake db:create db:migrate #initialize database
-   rails s #start rails server
```
While being served, the site will be accessible in browsers at http://localhost:3000/

##Application context
This application is an exercise in usability and a proof-of-concept for automatic mapping of images based on their metadata. As such, the hosted demonstration is not adequate for persistent, personalized map development by itself. Developers are encouraged to use the concept and code in their own mapping projects.

[PlacemarkStory.com](https://github.com/nbumbarger/placemark_story/) is a mapping tool by the developer of the img2map concept, which attempts to provide the easiest possible interface for creating and sharing interactive slippy maps using the Mapbox.js API. As of 06/28/15, it integrates GPS metadata extraction as a third option for defining point locations, joining geo-coding and manual reticule placement.