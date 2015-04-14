var map; // Global map variable

// Model: an array that holds each of the markers data.
// TODO: this probably needs to be added to an observableArray
var markers = [
  {
    "lat": 39.387976,
    "long": -105.275417,
    "title": "Buffalo Creek Trailhead"
  },
  {
  	"lat": 39.388863,
  	"long": -105.272982,
    "title": "Forest Service Work Station"
  },
  {
  	"lat": 39.375362,
  	"long": -105.308821,
    "title": "Baldy Peak"
  }
];


var ViewModel = function() {
	// Simple test to check bindings
	this.num = ko.observable(0);

};

ko.applyBindings( new ViewModel() );



// Initialize the Map
function initializeMap() {
	// Using Google's Styled Map options. JSON below was built with Styled Map Wizard
	var styles = [
	  {
	    "featureType": "water",
	    "elementType": "geometry",
	    "stylers": [
	      { "visibility": "on" },
	      { "color": "#1080dd" }
	    ]
	  },{
	    "featureType": "road.arterial",
	    "elementType": "geometry.stroke",
	    "stylers": [
	      { "color": "#515151" }
	    ]
	  },{
	    "featureType": "road.arterial",
	    "elementType": "geometry.fill",
	    "stylers": [
	      { "color": "#ffff5f" }
	    ]
	  }
	];

	var mapOptions = {
  	// 39.4530627,-105.4143336,16z - Will o Wisp coordinates
    center: { lat: 39.373, lng: -105.314},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Adding the Bicycling layer
  var bikeLayer = new google.maps.BicyclingLayer();
	bikeLayer.setMap(map);

	// Calling setOptions on the map and setting it to the styles array from above
	map.setOptions({styles: styles});

	// Markers
	// TODO: Can this live here - or does this need to be in our ViewModel?
	for (var i = 0; i < markers.length; i++) {
		var marker = new google.maps.Marker({
	    position: new google.maps.LatLng(markers[i].lat, markers[i].long),
	    map: map,
	    title: markers[i].title
		});
	}
}

window.addEventListener('load', initializeMap);