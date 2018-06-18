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
    // console.log(locations);
    // console.log(locations[0]);
    // console.log(locations.length);

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
    {maxZoom: 22, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
   
    console.log(markerCluster);
    clusterclick(map, markerCluster);
    
    // var temp = markerCluster.clusters_;
    // console.log(temp);
    // console.log(temp[0]);
    // console.log(temp.length);
    
// Map events
    map.addListener('click', function(event) {
        var data = {};
        console.log(event);
        data.lat = event.latLng.lat();
        data.lng = event.latLng.lng();
        // console.log("Longitude: "+ data.lng);
        // console.log("Latitidue: "+ data.lat);
        // placeMarker(map, data);
    });

    //Handles Marker Click events
    for (i=0; i<marker.length; i++){
        markerclick(map, marker[i], false);
    }
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
async function clusterclick (map, markerCluster){
    var names = await getNames();
    google.maps.event.addListener(markerCluster, 'clusterclick', async function(cluster) {
        // var size = cluster.getSize();
        // console.log("clustersize", size);
        var marks = cluster.getMarkers();
        // console.log("markers", marks);

        var array = [];
        for (i = 0; i < marks.length; i++) {
            array.push(marks[i].label - 1);
        }

        var infoWindow = new google.maps.InfoWindow({
            content:"Hello World!"
        });

        var infonames = "";

        for (i = 0; i < array.length; i++) {
            infonames += `${names[array[i]]}, `;
        }
        infonames = infonames.slice(0, -2);
        console.log(infonames);

        if (map.getZoom() > 15) {
            infoWindow.setContent(array.length + " markers <br>" + infonames);
            infoWindow.setPosition(cluster.getCenter());
            infoWindow.open(map);
        }

        var info = [];
        var menuinfo = [];
        for (i = 0; i < marks.length; i++) {
            var truckobj = await getInfo("food_truck", "id", marks[i].label);
            info.push(truckobj);
            var menu = await getInfo("truck_menu", "truck_id", marks[i].label);
            menuinfo.push(menu);
        }
        // console.log(info);
        // console.log(menuinfo);

        for (i = 0; i < marks.length; i++) {
            $('#truck-name').append(`<h4><b><strong> ${info[i][0].foodtruck_name} </b></strong></h4> ${info[i][0].descr}<br>${info[i][0].contact}`);

            // if (menuinfo.length > 1){
                // $("#truck-name").append("<b> <br> \n Menu Highlights</b>");
            // }
            //get the menu info and add it to maps.html
            
            for(var j = 0; j < menuinfo[i].length; j++){
                var menuitem = "<li>" + menuinfo[i][j].menu_item + " -- "
                                    + menuinfo[i][j].menu_description + " -- $"
                                    + menuinfo[i][j].price
                                    + "</li>"
                $("#truck-name").append(menuitem);
            }
            $("#truck-name").append("<hr>");
        }
    });
}

//Listener for marker clicks
function markerclick (map, marker){
    google.maps.event.addListener(marker,'click', async function() {
        var name = await getNames();
        $('#menulist').empty();
       
        // console.log("NAME:", name);
        console.log(marker);
        // console.log(truckinfo);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        // console.log(marker.getPosition());
        var index = marker.label;
    
        var info = await getInfo("food_truck", "id", index);

        //print the truck info to maps.html
         $('#truck-name').html("<b>" + info[0].foodtruck_name + "</b><hr>");
         $('#descr').text(info[0].descr);
         $('#contact').text(info[0].contact);

         //get the menu info and add it to maps.html
         var menuinfo = await getInfo("truck_menu", "truck_id", index);
        //  console.log("menu info: " + menuinfo[0].menu_item);
         if(menuinfo.length > 1){
            //  $("#menulist").html("<b>Menu Highlights</b><hr>");
         }
         else{
            $("#menulist").text("");
         }
         for(var i = 0; i<menuinfo.length; i++){
             
             var menuitem = "<li>" + menuinfo[i].menu_item + " -- "
                                   + menuinfo[i].menu_description + " -- $"
                                   + menuinfo[i].price
                                   + "</li>"
             $("#menulist").append(menuitem);
         }
        
         console.log(name[index-1]);
        var infowindow = new google.maps.InfoWindow({
            content: name[index-1]//truckinfo
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

function getNames(){
    var promise = $.ajax("/data", {
        type: "GET"
        }).then(
        function(data) {
            var promises = [];
          
            for(var i = 0; i < data.length; i++){
                promises[i] = data[i].foodtruck_name;
            }
            // console.log(promises);
            
            return new Promise(resolve => {
                resolve(promises);
            });
        }
     );
     return promise;
}

async function getInfo(table, col, id){

    var promise = await $.ajax("/data/" + table + "/"  + col + "/" + id, {
     type: "GET"
     }).then(
     function(data) {
         var promises = [];
       
         for(var i = 0; i < data.length; i++){
             promises[i] = data[i];
 
         }
        //  console.log("data from get info" + promises);
         
         return new Promise(resolve => {
             resolve(promises);
         });
     }
 );
//  console.log("from getinfo: " + promise);
 return promise;
 }
initMap();
