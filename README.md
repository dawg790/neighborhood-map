### Nick's Neighborhood Map

## Steps taken to run the app

* Index.html loads jQuery, Knockout, and the Google map
* app.js sets up the knockout data bindings to connect the view to my ViewModel.
* app.js initially sets the map to center on Denver, and to load places from Foursquare for that city.
* Requests are sent to Google for lat longs when a user enters a city, those lat longs are then used to center the map.
* Places, or venues, are retreived from Foursquare on load, and when the user changes the city.