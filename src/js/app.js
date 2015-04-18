// Model: an array that holds each of the markers data.
var places = [
  {
  	"content": "Ski area",
    "lat": 39.480742,
    "long": -106.066891,
    "title": "Breckenridge Ski Resort",
    "animation": null,
    "marker": null,
    "infowindow": null
  },
  {
  	"content": "Ski area resort and lodge",
  	"lat": 39.484333,
  	"long": -106.049904,
    "title": "Mountain Thunder Lodge",
    "animation": null,
    "marker": null,
    "infowindow": null
  },
  {
  	"content": "Snowmobile adventures",
  	"lat": 39.508813,
  	"long": -105.945805,
    "title": "Good Times Adventure",
    "animation": null,
    "marker": null,
    "infowindow": null
  },
  {
  	"content": "Local brews and burgers",
  	"lat": 39.476205,
  	"long": -106.043884,
    "title": "Breckenridge Brewery and Pub",
    "animation": null,
    "marker": null,
    "infowindow": null
  }
];
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

// This is the proper model format for data,
var Model = function(data) {
	// AJAX request here???
};

var ViewModel = function() {
	var self = this;
	self.map = null;

	// Click event for the list view
	self.selectPlace = function(clickedItem) {
		// Cycle through each marker, set animation to null so that with each click, the markers reset
		for (var i = 0; i < self.fsPlaces().length; i++) {
			self.fsPlaces()[i].marker.setAnimation(null)
		};
		// Set the clicked marker to Bounce
		clickedItem.marker.setAnimation(google.maps.Animation.BOUNCE);
		// TODO: Set the other infowindows to close on click
		// clickedItem.infowindow.open(self.map, this.marker);
		// This centers the map on the selected place
		self.map.setCenter(new google.maps.LatLng(clickedItem.location.lat, clickedItem.location.lng));

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

	self.initializeMap = function() {
		// TODO: Hardcoding city should be removed and come from either input or settings
		var city = "Breckenridge,CO";
		$.getJSON("https://api.foursquare.com/v2/venues/search?client_id=MUKBUW43YPMWUS2HKDZQZW4VYLT5B1HHST20VR5K35WAKFVC&client_secret=5I1RMLBOLDC1QXU5IJN4VLC2E1N2G1JIGB3QUG5FTAZO4CFM&v=20130815&near=" + city, function(data) {
		  self.fsPlaces(data.response.venues);
		  // This function within the request, allows us to use the data outside this scope.
		  setMarkers();
		});
		// Function is called above and places the markers into the fsPlaces array.
		function setMarkers() {
			for (var i = 0; i < self.fsPlaces().length; i++) {
				self.fsPlaces()[i].marker = new google.maps.Marker({
				  position: new google.maps.LatLng(self.fsPlaces()[i].location.lat, self.fsPlaces()[i].location.lng),
				  title: self.fsPlaces()[i].name,
				  map: self.map,
				  animation: google.maps.Animation.DROP,
				  // TODO: need the InfoWindows now
			  });
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
	    center: { lat: 39.481, lng: -106.041},
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

		// Add Markers & Infowindows
		// for (var i = 0; i < self.allPlaces().length; i++) {
		// 	self.allPlaces()[i].marker = new google.maps.Marker({
		// 	  position: new google.maps.LatLng(self.allPlaces()[i].lat, self.allPlaces()[i].long),
		// 	  title: self.allPlaces()[i].title,
		// 	  map: self.map,
		// 	  animation: google.maps.Animation.DROP,
		// 	  html: self.allPlaces()[i].content,
		// 	  infowindow: self.allPlaces()[i].infowindow
		//   });

		//   self.allPlaces()[i].infowindow = new google.maps.InfoWindow({
  // 		  content: self.allPlaces()[i].marker.html
		//   });
		//   // Utilizing a closure here to add event listeners to each Marker
		//   // TODO: Need a close() event to close other infowindows on click
		//   google.maps.event.addListener(self.allPlaces()[i].marker, 'click', (function(innerKey) {
  //       return function() {
  //       	self.allPlaces()[innerKey].infowindow.open(self.map, self.allPlaces()[innerKey].marker);
  //       }
  //     })(i));
		// }

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