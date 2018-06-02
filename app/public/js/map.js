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

//Locations contains marker coordinates
// var locations = [atlanta, uluru];
var locations = [];

//POPULATE LOCATIONS FROM SQL DB
async function init(){
    var promise = await $.ajax("/locations", {
        type: "GET"
    }).then(
        function(data) {
            var promises = [];
            // console.log("test");
            for(var i = 0; i < data.length; i++){
               promises[i] = mapQuery(data[i].location, i);
            }
            // console.log(promises);
            
            return new Promise(resolve => {
                resolve(promises);
            });
        }
    );
    return promise;
}

//Display Maps
async function initMap() {
    var test = await init();
    var locations = [];
    
    for (i=0; i<test.length; i++){
        await test[i].then(function(value){
            // console.log(value);
            locations.push(value);
        });
    }
    console.log(locations);
    // console.log(locations[0]);
    console.log(locations.length);

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: atlanta
    });
    
    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.{
    var marker = locations.map(function(data, i) {
        // console.log(data);
        // console.log(i);
      return new google.maps.Marker({
        position: data,
        label: labels[i % labels.length],
        // animation: google.maps.Animation.BOUNCE,
//         // icon:"./images/food-truck.png"        
      });
    });
    
    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, marker,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
    console.log(markerCluster);
    var temp = markerCluster.clusters_;
    console.log(temp);
    console.log(temp.length);
    
// Map events
    map.addListener('click', function(event) {
        var data = {};
        console.log(event);
        data.lat = event.latLng.lat();
        data.lng = event.latLng.lng();
        console.log("Longitude: "+ data.lng);
        console.log("Latitidue: "+ data.lat);
        // placeMarker(map, data);
    });


    //Handles Marker Click events
    for (i=0; i<marker.length; i++){
        markerclick(map, marker[i]);
    }
    //Handles Cluster Click events
    // for (i=0; i<marker.length; i++){
    //     markerclick(map, marker[i]);
    // }
}

//Places a new temporary marker
function placeMarker(map, location) {
    var marker = new google.maps.Marker({
    position: location,
    map: map
    });
    var infowindow = new google.maps.InfoWindow({
        content: 'Latitude: ' + location.lat +
        '<br>Longitude: ' + location.lng
    });
    infowindow.open(map,marker);
} 

//Listener for marker clicks
//markerCluster.clusters_
function clusterclick (map, marker, truckinfo){
    google.maps.event.addListener(marker,'click',function() {
        console.log(marker);
        // console.log(truckinfo);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        // console.log(marker.getPosition());
        var infowindow = new google.maps.InfoWindow({
            content:"Hello World!"//truckinfo
        });
        infowindow.open(map, marker);
        });
}

function markerclick (map, marker, truckinfo){
    google.maps.event.addListener(marker,'click',function() {
        console.log(marker);
        // console.log(truckinfo);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        // console.log(marker.getPosition());
        var infowindow = new google.maps.InfoWindow({
            content:"Hello World!"//truckinfo
        });
        infowindow.open(map, marker);
        });
}

// Grabs coordinates and saves to database
// var truckLocations = [];
async function mapQuery(addr, i) {
    var test;
    var mapquery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=" + googlemapskey;
    var promise = await $.ajax({
        url: mapquery,
        method: "GET",
    }).then(function (response) {
        //Google maps api takes input -> lat, lng, address
        var latit = response.results[0].geometry.location.lat;
        var longi = response.results[0].geometry.location.lng;
        var add = response.results[0].formatted_address;
        var coordinates = {lat: latit, lng: longi};

        // console.log(coordinates);
        locations[i] = coordinates;
        
        //create a local truckLocations array with coordinates saved
        var coord = JSON.stringify(coordinates);
        
        // truckLocations[id] = coordinates;
        // Save coord to truck in database
        // database.ref(trucks[id].set({
        //     location: coordinates,
        //     timeupdated automatically updated
        // });
        return new Promise(resolve => {
              resolve(coordinates);
          });
    });
    // console.log(promise);
    return promise;
}
initMap();

// var namesarray = [];
// // Import from database all the names of the trucks and put them into namesarray
// //function import(db)
// //returns namesarray


// // The submit button grabs the user input and converts it into coordinates
// $("#submit").on("click", function(event) {
//     event.preventDefault();
    
//     var location = $("#location-input").val().trim();
//     var geocodeQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + googlemapskey;

//     var repeat = repeatCheck(namesarray,location);
//     if (location == ""){
//         console.log("no Input");
//     } else if (repeat === true){
//         console.log("name repeat");
//     } else {
//         mapQuery(adrr);
//         //add marker here
//     }

// });  