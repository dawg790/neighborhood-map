/* Neighborhood Map App
 *
 * Loads Google Map and Foursquare 'venues' from asynch AJAX requests
 * Allows user to change city, select different categories of venues and see more info for each venue on click events
 *
 */
var GOOGLE_KEY = "AIzaSyDEI4Gy79BBtuCAM5JNDZnteFf3-TdaQjU";
var CLIENT_ID = "MUKBUW43YPMWUS2HKDZQZW4VYLT5B1HHST20VR5K35WAKFVC";
var CLIENT_SECRET = "5I1RMLBOLDC1QXU5IJN4VLC2E1N2G1JIGB3QUG5FTAZO4CFM";

// Listing of categories from foursquare
var fsCategories = [
  { "name": "Restaurants",
  	"id" : "4d4b7105d754a06374d81259"
  },{
  	"name": "Airport",
  	"id": "4bf58dd8d48988d1ed931735"
  },{
  	"name": "Coffee",
  	"id": "4bf58dd8d48988d1e0931735"
  },{
  	"name": "Food Trucks",
  	"id": "4bf58dd8d48988d1cb941735"
  },{
  	"name": "Breweries",
  	"id": "50327c8591d4c4b30a586d5d"
  },{
  	"name": "Museums",
  	"id": "4bf58dd8d48988d181941735"
  },{
  	"name": "Universities",
  	"id": "4d4b7105d754a06372d81259"
  },{
  	"name": "Hotel",
  	"id": "4bf58dd8d48988d1fa931735"
  },{
  	"name": "Outdoors",
  	"id": "4d4b7105d754a06377d81259"
  },{
  	"name": "Stadiums",
  	"id": "4bf58dd8d48988d184941735"
  },{
  	"name": "Shopping",
  	"id": "4d4b7105d754a06378d81259"
  },{
  	"name": "Zoo",
  	"id": "4bf58dd8d48988d17b941735"
  }
];

// Global var to hold the places request data returned from Foursquare
var placesModel = [];

// Main Neighborhood Map app ViewModel
var MapViewModel = function() {
	var self = this;

	// Setting the map as a global MapViewModel variable to be used outside the initializeMap function
	self.map = null;

	// Define ko array for our AJAX request - push the data from the Model into our ViewModel
	self.fsPlaces = ko.observableArray([]);

	// Holding the lat longs for the map - with default starting points in Denver
	self.lat = ko.observable(39.750);
	self.lng = ko.observable(-104.999);

	// Search Places and filter list view and markers - runs on keyup
	self.search = function() {
		var value = $('#searchTerm').val();
		// Found this replace function online to convert search term to Capital cased
		value = value.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    // Cycle through each <li> element and hide it or show it based on the search term
		$('.markerList > li').each(function() {
			if ($(this).text().search(value) > -1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});

		// Cycle through the markers now and set the marker's visible property accordingly
		for (var i = 0; i < self.fsPlaces().length; i++) {
			if (self.fsPlaces()[i].marker.title.search(value) > -1) {
				self.fsPlaces()[i].marker.setMap(self.map);
			} else {
				self.fsPlaces()[i].marker.setMap(null);
			}
		};
	}

	// The List View Click event
	self.selectPlace = function(clickedItem) {
		// Set all marker animations to null
		self.clearMarkerAnimation();

		// Close all open infowindows, set the content to clickedItem, then open it
		self.infowindowToggle(clickedItem.marker.html, clickedItem.marker);

		// Set the clicked marker to Bounce
		clickedItem.marker.setAnimation(google.maps.Animation.BOUNCE);

		// This centers the map on the selected place
		self.map.setCenter(new google.maps.LatLng(clickedItem.location.lat, clickedItem.location.lng));
		self.map.setZoom(17);
		console.log(clickedItem);
	};

	// TODO: Places photos

	// Map Settings - user defined within the app
	self.mapType = ko.observable();

	// Checking that we have the google object before instantiating new objects.
	if (typeof google !== "undefined") var bikeLayer = new google.maps.BicyclingLayer();

	// Click event for Map settings options - allows user to select type of base map
	self.settings = function(data) {
		if (!bikeLayer.setMap(null)) bikeLayer.setMap(self.map);
		if (self.mapType()[0] === "Satellite") self.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		if (self.mapType()[0] === "Terrain") self.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
	  if (self.mapType()[0] === "Road") self.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
		if (self.mapType()[0] === "Bike") bikeLayer.setMap(self.map);
		if (self.mapType()[0] === "Hybrid") self.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
	};

	/* Declaring a global var for the infowindow, so that all open windows can be closed when a marker is clicked.
	 * Script checks that the google object is available before instantiating new objects.
	 */
	if (typeof google !== "undefined") self.infowindow = new google.maps.InfoWindow();
	// Function is called in our Marker Click and List Item Click events
	self.infowindowToggle = function(content, marker) {
		for (var i = 0; i < self.fsPlaces().length; i++) {
		  self.infowindow.close();
  	  self.infowindow.setContent(content);
  	  self.infowindow.open(self.map, marker);
		};
	};

	// Function to set all markers animation to none
	self.clearMarkerAnimation = function() {
		for (var i = 0; i < self.fsPlaces().length; i++) {
  		self.fsPlaces()[i].marker.setAnimation(null);
  	};
	};

	/* CATEGORIES
   * Create an array of all the category id's, then join the items to make a comma separated string,
   * then pass that string into the self.chosenCategoryID() to get passed to the JSON Request
   */
	var categoryIdArray = [];
	for (var i = 0; i < fsCategories.length; i++) {
		categoryIdArray.push(fsCategories[i].id);
	};
	var ids = categoryIdArray.join(",");

	self.chosenCategoryID = ko.observable(ids);

	// Store the selected choice in the drop down to display dynamically in the DOM - use starter value
	self.catChoice = ko.observable();

	/* setCategory is run when a category is choosen from the list. Check the selected option
	 * against the fsCategories object and update the id to use in the JSON request.
	 */
	self.setCategory = function() {
		for (var i = 0; i < fsCategories.length; i++) {
			if (self.catChoice()[0] === fsCategories[i].name) {
				self.chosenCategoryID(fsCategories[i].id);
			}
		};
		// Run initialize again to reset the markers for the new category
		self.initializeMap();
	}

	// USER ENTERED LOCATION
	// Setting a variable to hold the user entered city
	self.city = ko.observable($('#city').val());

	// function to re-center the map over the user entered city
	self.setCity = function() {
		var cityValue = $('#city').val();

		// This variable is used to display the user entered city in the Map Options headings.
		// TODO: Could do some case formatting on the input value, so that the displayed city name is properly cased.
		self.city(cityValue);

		// Using Google's geocoding API to get the lat/long values for the city entered
		$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + self.city() + "&key=" + GOOGLE_KEY, function(data) {
			// Request pulls in data, stores the lat longs for the city into the global observables and sets the map center
			self.lat(data.results[0].geometry.location.lat);
			self.lng(data.results[0].geometry.location.lng);
			self.map.setCenter({lat: self.lat(), lng: self.lng()});
		// Error handling below is if the Geocode service is down. Google seems to handle incorrect typing on city names pretty well.
		}).error(function() {
			$('#error').text("Google Geocode is not responding. Please try again later.").show();
			console.log("Google Geocode API error");
		});

		// Run again to add the markers in the new city
		self.initializeMap();

		// Clear out the text input field
		$('#city').val("");
	};

	// MAP INITIALIZATION
	self.initializeMap = function() {
		// Foursquare AJAX request for places
		$.getJSON("https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID +
			"&client_secret=" + CLIENT_SECRET +
			"&v=20130815&limit=50&categoryId=" + self.chosenCategoryID() +
			"&radius=6000&near=" + self.city(), function(data) {

		  // Store the places request data in a global variable
		  placesModel = data.response.venues;

		  // Push the global variable results into the ViewModel observable
		  self.fsPlaces(placesModel);
	  	console.log("Foursquare successfully loaded places");

	  	// This function, within the request, allows the data to be used outside this scope.
	  	setMarkers();
	  	$('#error').hide();
	  // Error handling for if the Foursquare service is unreachable or if the user types in an unrecognizable search term
		}).error(function() {
			$('#error').text("Foursquare can not retrieve places at this time. Please try again later or refine your search term.").show();
			console.log("Foursquare API error");
		});

		// Function is called in the JSON request to Foursquare and places the markers into the fsPlaces array.
		this.setMarkers = function() {
			for (var i = 0; i < self.fsPlaces().length; i++) {
				// Storing some variables here for easier use later
				var place = self.fsPlaces()[i];
				var placePhone = place.contact.formattedPhone;
				var placeAddress = place.location.address;
				var placeCity = place.location.city;
				var placeState = place.location.state;
				var placeZip = place.location.postalCode;
				var placeWeb = place.url;

				// Format any undefined fields for the infowindow
				if (placePhone === undefined) placePhone = "N/A";
				if (placeAddress === undefined) placeAddress = "";
				if (placeCity === undefined) placeCity = "";
				if (placeState === undefined) placeState = "";
				if (placeZip === undefined) placeZip = "";
				if (placeWeb === undefined) placeWeb = "No Website";

				// This is updating an old URI from Foursquare for icon images.
				// TODO: I can't figure out how to get the proper URL from the request.
				var fsIconRaw = place.categories[0].icon.prefix + "bg_32" + place.categories[0].icon.suffix;
				var fsIcon = fsIconRaw.replace("https://ss3.4sqi.net", "https://foursquare.com");

				place.marker = new google.maps.Marker({
				  position: new google.maps.LatLng(place.location.lat, place.location.lng),
				  title: place.name,
				  map: self.map,
				  animation: google.maps.Animation.DROP,
				  icon: fsIcon,
				  html: '<div>' +
			      '<h2 class="infoTitle">' + place.name +
			      '</h2><h4 class="infoCategory">' + place.categories[0].name +
			      '</h4><p class="infoPhone">Phone: ' + placePhone +
			      '<p class="infoAddress">Address: ' + placeAddress + ' ' + placeCity + ', ' + placeState + ' ' + placeZip +
			      '</p><p class="infoWeb"><a href="' + placeWeb + '">'+
			      '' +  placeWeb + '</a> '+
			      '</p></div>'
			  });

			  // Utilizing a closure here to add event listeners to each Marker
			  google.maps.event.addListener(place.marker, 'click', (function(innerKey) {
	        return function() {
	        	// On marker click, set all other markers animation to null
	        	self.clearMarkerAnimation();

	        	// Toggle the infowindow to display, center map on marker, set animation to bounce
	        	self.infowindowToggle(self.fsPlaces()[innerKey].marker.html, this);
	        	self.map.setCenter(new google.maps.LatLng(self.fsPlaces()[innerKey].location.lat, self.fsPlaces()[innerKey].location.lng));
	        	self.fsPlaces()[innerKey].marker.setAnimation(google.maps.Animation.BOUNCE);
	        }
	      })(i));
			}
		}

		// Using Google's Styled Map options. JSON below was built with Styled Map Wizard
		var styles = [
		  {"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#1080dd"}]},
		  {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffff5f"}]},
		  {"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#f09609"}]},
		  {"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#dddddd"}]},
		  {"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffff5f" }]},
		  {"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]}
		];

		var mapOptions = {
	    center: { lat: self.lat(), lng: self.lng()},
	    zoom: 15,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    streetViewControl: false,
	    zoomControl: true,
	    panControl: false,
	    mapTypeControl: false
	  };

		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Adding the Bicycling layer - but setting it to null, so that users can add it from the Map Settings options
		bikeLayer.setMap(null);

		// Calling setOptions on the map and setting it to the styles array from above
		self.map.setOptions({styles: styles});
	};

	/* ERROR HANDLING for Google Maps
   *
	 * Check for the google object when the app launches
	 */
	if (typeof google === "undefined") {
		var errorStr = "Resource API (Google Maps) did not load. Please try again later.";
		$('#error').text(errorStr).show();
		console.log("Failed to load Google Maps");
	} else {
		$('#error').hide();
		google.maps.event.addDomListener(window, 'load', this.initializeMap);
		console.log("Google Maps successfully loaded");
	}
};

ko.applyBindings( new MapViewModel() );