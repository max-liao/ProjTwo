//Google Maps initialization
var googlemapskey = "AIzaSyACZMGscEwWMY3TJblK-NuIwhIRsoEaAnI";

// Create an array used to label the markers.
var labels = [];
for (l = 1; l< 100; l++){
    labels.push(String(l));
}

//Map Locations
var atlanta = {lat: 33.748995, lng: -84.387982};
var uluru = {lat: -25.344, lng: 131.036};
var locations = [atlanta, uluru];

//Display Maps
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: atlanta
    });

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var marker = locations.map(function(location, i) {
      return new google.maps.Marker({
        position: location,
        label: labels[i % labels.length]
      });
    });

    // Map events
    var data;
    map.addListener('click', function(event) {
        data.lat = event.latLng.lat();
        data.lng = event.latLng.lng();
        console.log("Longitude: "+ data.lng);
        console.log("Latitidue: "+ data.lat);
      });

    google.maps.event.addListener(map, 'click', function(event) {
        console.log("map click");
        placeMarker(map, event.latLng);
        });

    var infowindow = new google.maps.InfoWindow({
        content:"Hello World!"
    });
    
    // console.log(marker[0].getPosition());

    // Add a marker clusterer to manage the markers.
    // var markerCluster = new MarkerClusterer(map, marker,
    //     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }

  function placeMarker(map, location) {
    // var marker = new google.maps.Marker({
    //   position: location,
    //   map: map
    // });
    var infowindow = new google.maps.InfoWindow({
      content: 'Latitude: ' + location.lat() +
      '<br>Longitude: ' + location.lng()
    });
    infowindow.open(map,marker);
  } 

// Import from database all the names of the trucks and put them into namesarray
//function import(db)
//returns namesarray

var namesarray = [];
// The submit button grabs the user input and converts it into coordinates
$("#submit").on("click", function(event) {
    event.preventDefault();
    
    var location = $("#location-input").val().trim();
    var geocodeQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + googlemapskey;

    var repeat = repeatCheck(namesarray,location);
    if (location == ""){
        console.log("no Input");
    } else if (repeat === true){
        console.log("name repeat");
    } else {
        mapQuery(adrr);
        //add marker here
    }

});  

function repeatCheck(array, location){
    var repeat = false;
    for (k=0; k<array.length; k++){
        if (array[k] == location){
            repeat = true;
            break;
        } else {
            console.log("not a repeat");
        }
    }
    return repeat;
}

// Grabs id into coordinates and saves to database
  var truckLocations = [];
  function mapQuery(addr) {
    var mapquery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=" + googlemapskey;
    $.ajax({
        url: mapquery,
        method: "GET",
    }).then(function (response) {
        //Google maps api takes input -> lat, lng, address
        var latit = response.results[0].geometry.location.lat;
        var longi = response.results[0].geometry.location.lng;
        var add = response.results[0].formatted_address;
        var coordinates = {lat: latit, lng: longi};

        //create a local truckLocations array with coordinates saved
        var coord = JSON.stringify(coordinates);
        truckLocations[id] = coordinates;

        // Save coordinates to truck
        // database.ref(trucks[id].set({
        //     location: coordinates,
        //     timeupdated automatically updated
        // });
    });
}

initMap();








// function ArrtoObject(arr) {
//     var rv = {};
//     for (var i = 0; i < arr.length; ++i)
//       if (arr[i] !== undefined) rv[i] = arr[i];
//     return rv;
//   }

// function showbrews(city) {
//     // console.log(breweryInfo.breweryLocation.length);
//     brewsobj = breweryInfo.breweryLocation;
//     console.log(brewsobj.length);
    
//     for (i=0;i<brewsobj.length;i++){
//         // var breweryaddress = (breweryInfo.breweryLocation[i].address + " " + cities[i]);
//         var breweryaddress = brewsobj[i].address +""+ city;
//         brewQuery(brewsobj[i].name, breweryaddress , i);    
//     }
    
//     locations = Object.keys(brewerylocs).map(function(key) {
//         // return [Number(key), locationsobj[key]];
//         return brewerylocs[key];
//       });

//     initMap();
// }