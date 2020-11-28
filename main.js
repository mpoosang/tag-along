'use strict';

// Global Variables
let map;
let infoWindow;
// let autocomplete;

let mapState = {
    latitude: 34.061491, 
    longitude: -118.311730,
    map: null
};

// creates new map
function initMap() {
    $("#map").empty();
    // $("#map").show();

    mapState.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: mapState.latitude, lng: mapState.longitude },
        zoom: 14
    });
}

const searchUrl = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getListings(userType, inputLocation) {
    // creates the Yelp query parameters
    const params = {
        term: 'dogs+allowed',
        location: inputLocation,
        categories: userType,
        open_now: true,
        sort_by: 'distance'
    };

    // creates a string with the new url
    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;

    console.log(url);

    // Yelp authorization
    const options = {
        headers: new Headers({
          "authorization": "Bearer 9VZsJlF_-akxVbaOqQWAa-67XBBCr__qfKm95OIbKTbvGtdts3533Kv7xLPJZJYD5BOAkdT98pZMnU_n85yRGCuvR1DRqcumeHuaAZx8gHl-0STQLII2i6mV6Zm9X3Yx"})
    };

    fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
    let bizNames = [];
    let bizInfo = [];
    let bizId = 0;
    let markers = [];

    console.log(responseJson);
    // if there are previous results, remove them
    $('#results-list').empty();
    // iterate through the array, stopping at the max number of results
    for (let i = 0; i < responseJson.businesses.length; i++) {
        // for each object in the array, add a list item to the results
        $('#results-list').append(
            `<li><h3><a href="${responseJson.businesses[i].url}">${responseJson.businesses[i].name}</a></h3>
            <div class='biz-food'><span class='biz-rating'>${responseJson.businesses[i].rating}</span> / <span class='biz-type'>${responseJson.businesses[i].categories[0].title}</span></div>
            <div class='biz-address'>${responseJson.businesses[i].location.display_address}</div>
            <div class='biz-address'>${responseJson.businesses[i].display_phone}</div>
            </li>
            `
        )

        let bizLat = responseJson.businesses[i].coordinates.latitude;
        let bizLng = responseJson.businesses[i].coordinates.longitude;

        bizId = bizId + 1;
        bizNames.push(responseJson.businesses[i].name);

        // add marker
        let marker = new google.maps.Marker({
            position: {lat: bizLat, lng: bizLng},
            map: mapState.map
        });

        // business info for map info window
        markers.push(marker);
        let bizInfo = '<div><h4 class="bizHeading">' + responseJson.businesses[i].name + '</h4></div>' + '<div>' + responseJson.businesses[i].location.display_address + '</div>';
        addBizBox(marker, bizInfo);

        mapState.latitude = responseJson.region.center.latitude;
        mapState.longitude = responseJson.region.center.longitude;
        mapState.map.setCenter({lat: mapState.latitude, lng: mapState.longitude});
        mapState.map.setZoom(12);

    }
    // //display the results section 
    $('main').removeClass('hidden');
}

// create info window for each business on the map
function addBizBox(marker, bizInfo) {
    var infoWindow = new google.maps.InfoWindow({
        content: bizInfo
    });

    marker.addListener('click', function() {
        infoWindow.open(marker.get('map'), marker);
    });
}

function handleSubmit() {
    $('form').submit(event => {
        event.preventDefault();
        let userType = $('#js-type').val();
        let inputLocation = $('#user-location').val();
        getListings(userType, inputLocation);
    });
}

$(handleSubmit);




// autocomplete location name in form
// function activatePlacesSearch() {
//     let options = {
//         types: ['(regions)']
//     };
//     let input = document.getElementById('search-term');
//     let autocomplete = new google.maps.places.Autocomplete(input, options);
// }


// Reset search results when user clicks on logo
// $('').click((event) => {
//     event.preventDefault();
//     // Remove all relevant values
//     $('#location').val('');
//     $('.searchResults').remove();
//     window.searchText = '';
// });