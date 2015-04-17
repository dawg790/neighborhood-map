### Nick's Neighborhood Map

## Get Started

Similar to cat clicker project just without the map

* Add full screen Google map to the screen - DONE
* Add Map Markers for a number of location I am interested in in this neighborhood
* Implement a Search Bar
	* search and filter the map markers I add
	* add a filtering function on markers that already show up
	* The search bar will filter my model as I type: model holds both list view and marker details
	* The search will provide the result that you will use to show the markers. Not actually searching the markers themselves.
	* JS Libraries for string pattern matching - don't use the google places auto-complete
* Add a list view of the identified locations
* Add additional functionality to the markers using another API - AJAX requests here
	* when map marker, search result, or list item is clicked:
		* Yelp business reviews
		* Wikipedia/NYT articles
		* Streetview
		* Foursquare API

## Rubric

* Use Knockouts MVVM pattern for separation of concerns
	* Do not update the DOM manually, use observables instead
	* Model is where you data/content resides - separate class
	* View is whatever the user sees in the app: map, list view, search. Just HTML file.
	* ViewModel interacting between model and view classes.
		* Data manipulation, or updating view, pulling data to render in view should be done in VM
* Use asynchronous requests to get third party data
	* In case of failed requests, errors are handled gracefully - see the Intro to AJAX course
* Map markers are presented in useful and responsive way.
	* Different markers are styled in different ways - depending on type (restaurants, parks, etc)
	* When clicked, markers change styling to show 'selected' state
* Functonality is added to show additional information about each location
* Search bar functionality
	* auto-complete, keyboard shortcuts, etc for extra credit
* List view, or some other way besides search is provided to browse the content

Model that we build is only for the map markers that we put on the map
  - Location included in model
  - Data will be used to place the markers on the map.
The map div and creating the map, don't try and 'put' that into knockout...
Use Google code as is, use knockout.js for the markers


## Steps taken to run the appvbg