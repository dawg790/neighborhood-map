
// Using this object for the user to be able to change the map type
var allSettings = [
  {
  	"type": "Satellite"
  },
  {
  	"type": "Terrain"
  },
  {
  	"type": "Road"
  }
];

// Main application ViewModel
var ViewModel = function() {
	var self = this;
	self.map = null;

	// Click event for the list view
	self.selectPlace = function(clickedItem) {
		// Cycle through each marker, set animation to null so that with each click, the markers reset
		for (var i = 0; i < self.fsPlaces().length; i++) {
			self.fsPlaces()[i].marker.setAnimation(null)
			self.fsPlaces()[i].infowindow.close(); // Close all open infowindows that are properties of fsPlaces
			self.infowindow.close(); // Close the global var used in the marker click event
		};
		// Set the clicked marker to Bounce
		clickedItem.marker.setAnimation(google.maps.Animation.BOUNCE);
		// TODO: Set the other infowindows to close on click ******
		clickedItem.infowindow.open(self.map, this.marker);
		// This centers the map on the selected place
		self.map.setCenter(new google.maps.LatLng(clickedItem.location.lat, clickedItem.location.lng));
		self.map.setZoom(16);
		console.log(clickedItem);
	};

	// Click event for Map settings options
	self.settings = function(data) {
		if (data.type === "Satellite") {
			self.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		} else if (data.type === "Terrain") {
			self.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
		} else if (data.type === "Road") {
			self.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
		}
	};

	// Define ko array for our AJAX request
	self.fsPlaces = ko.observableArray([]);

	// Holding our lat longs for the map - with default starting points in Denver
	self.lat = ko.observable(39.738);
	self.lng = ko.observable(-104.993);

	// CATEGORIES
	// On page load set the Category to the current value
	self.chosenCategory = ko.observable($('#categoryChoices').val());

	// Function is run when category is choosen from the list, value (or cat ID) is pulled from the option
	self.setCategory = function() {
		self.chosenCategory($('#categoryChoices').val());
		self.initializeMap();
	}

	// USER ENTERED LOCATION
	// Setting a variable to hold the user entered city
	self.city = $('#city').val();
	// function to re-center the map over the user entered city
	self.setCity = function() {
		self.city = $('#city').val();
		// Using Google's geocoding API to get the lat/long values for the city entered
		$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + self.city + "&key=AIzaSyDEI4Gy79BBtuCAM5JNDZnteFf3-TdaQjU", function(data) {
			// Request pulls in data, stores the lat longs for the city into the observables and sets the map center
			self.lat(data.results[0].geometry.location.lat);
			self.lng(data.results[0].geometry.location.lng);
			self.map.setCenter({lat: self.lat(), lng: self.lng()});
		});
		// Have to run this again to add the markers in the new city
		self.initializeMap();
	};

	// MAP INITIALIZATION
	self.initializeMap = function() {
		// TODO: Category is set to 'Food', 'Museums' and 'Coffee Shops' with comma separated categoryId's
		$.getJSON("https://api.foursquare.com/v2/venues/search?client_id=MUKBUW43YPMWUS2HKDZQZW4VYLT5B1HHST20VR5K35WAKFVC&client_secret=5I1RMLBOLDC1QXU5IJN4VLC2E1N2G1JIGB3QUG5FTAZO4CFM&v=20130815&categoryId=" + self.chosenCategory() + "&radius=7600&near=" + self.city, function(data) {
		  self.fsPlaces(data.response.venues);
		  // This function within the request, allows us to use the data outside this scope.
		  setMarkers();
		});
		// Function is called above and places the markers into the fsPlaces array.
		this.setMarkers = function() {
			for (var i = 0; i < self.fsPlaces().length; i++) {
				self.fsPlaces()[i].marker = new google.maps.Marker({
				  position: new google.maps.LatLng(self.fsPlaces()[i].location.lat, self.fsPlaces()[i].location.lng),
				  title: self.fsPlaces()[i].name,
				  map: self.map,
				  animation: google.maps.Animation.DROP
			  });

				// I need the infowindow as a property of the fsPlaces so that my list view click will show the window
			  self.fsPlaces()[i].infowindow = new google.maps.InfoWindow({
	  		  content: self.fsPlaces()[i].name
			  });

			  // Declaring a global var for the infowindow, so I can close all open windows when I click on a marker
			  self.infowindow = new google.maps.InfoWindow();
			  // Utilizing a closure here to add event listeners to each Marker
			  google.maps.event.addListener(self.fsPlaces()[i].marker, 'click', (function(innerKey) {
	        return function() {
	        	self.infowindow.close();
	        	self.infowindow.setContent(self.fsPlaces()[innerKey].name);
	        	self.infowindow.open(self.map, this);
	        	// self.fsPlaces()[innerKey].infowindow.open(self.map, self.fsPlaces()[innerKey].marker);
	        }
	      })(i));
			}
		}

		// Using Google's Styled Map options. JSON below was built with Styled Map Wizard
		var styles = [
		  {"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#1080dd"}]},
		  {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffff5f"}]},
		  {"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#f09609"}]},
		  {"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#515151"}]},
		  {"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffff5f" }]}
		];

		var mapOptions = {
			// TODO: center object should not be hardcoded - it must pull from a variable that updates
	    center: { lat: self.lat(), lng: self.lng()},
	    zoom: 13,
	    mapTypeId: google.maps.MapTypeId.TERRAIN,
	    streetViewControl: false,
	    zoomControl: false,
	    panControl: false,
	    mapTypeControl: false
	  };

		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Adding the Bicycling layer
	  var bikeLayer = new google.maps.BicyclingLayer();
		bikeLayer.setMap(self.map);

		// Calling setOptions on the map and setting it to the styles array from above
		self.map.setOptions({styles: styles});
	};

	if (typeof google === 'object') {
		google.maps.event.addDomListener(window, 'load', this.initializeMap);
	} else {
		var errorStr = "Resource Google API did not load. Try again later.";
		document.body.innerHTML = errorStr;
	}

};

ko.applyBindings( new ViewModel() );


// var places = [
//   {
//   	"content": "Ski area",
//     "lat": 39.480742,
//     "long": -106.066891,
//     "title": "Breckenridge Ski Resort",
//     "animation": null,
//     "marker": null,
//     "infowindow": null
//   },
//   {
//   	"content": "Ski area resort and lodge",
//   	"lat": 39.484333,
//   	"long": -106.049904,
//     "title": "Mountain Thunder Lodge",
//     "animation": null,
//     "marker": null,
//     "infowindow": null
//   },
//   {
//   	"content": "Snowmobile adventures",
//   	"lat": 39.508813,
//   	"long": -105.945805,
//     "title": "Good Times Adventure",
//     "animation": null,
//     "marker": null,
//     "infowindow": null
//   },
//   {
//   	"content": "Local brews and burgers",
//   	"lat": 39.476205,
//   	"long": -106.043884,
//     "title": "Breckenridge Brewery and Pub",
//     "animation": null,
//     "marker": null,
//     "infowindow": null
//   }
// ];