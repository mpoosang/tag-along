'use strict';

// Global Variables
let geocoder;
let map;
// infoWindow: google.maps.InfoWindow;

function handleApp() {

}

// creates new map 
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
}





function getListings(type, inputLocation) {
    
}


$('form').submit(event => {
    event.preventDefault();
    let type = $('#js-type').val();
    let inputLocation = $('#location').val();
    getListings(type, inputLocation);
    $('#map').show();
});




// $('#js-type option:selected').text();


// Reset search results when user clicks on logo
// $('').click((event) => {
//     event.preventDefault();
//     // Remove all relevant values
//     $('#location').val('');
//     $('.searchResults').remove();
//     window.searchText = '';
// });