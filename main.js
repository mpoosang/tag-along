'use strict';

// Global Variables
let map;
let infoObj = [];

let mapState = {
    latitude: 34.061491, 
    longitude: -118.311730,
    map: null
};

// creates new map
function initMap() {
    $("#map").empty();

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
        radius: 8000,
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
    for (let i = 0; i < responseJson.businesses.length; i++) {
        // for each object in the array, add a list item to the results
        $('#results-list').append(
            `<li><h3 class='bizHeading'><a href="${responseJson.businesses[i].url}" target="_blank">${responseJson.businesses[i].name}</a></h3>
            <div class='biz-list-info'>
            <div class='biz-food'><span class='biz-rating'>${responseJson.businesses[i].rating}</span> / <span class='biz-type'>${responseJson.businesses[i].categories[0].title}</span></div>
            <div class='biz-address'>${responseJson.businesses[i].location.display_address}</div>
            <div class='biz-phone'>${responseJson.businesses[i].display_phone}</div>
            </div>
            </li>
            `
        )

        let bizLat = responseJson.businesses[i].coordinates.latitude;
        let bizLng = responseJson.businesses[i].coordinates.longitude;

        bizId = bizId + 1;
        bizNames.push(responseJson.businesses[i].name);

        // add marker
        let image = 'photos/favicon.png';
        let marker = new google.maps.Marker({
            position: {lat: bizLat, lng: bizLng},
            map: mapState.map,
            icon: image
        });

        // business info for map info window
        markers.push(marker);
        let bizInfo = '<div><h4 class="bizInfoHeading">' + responseJson.businesses[i].name + '</h4></div>' + '<div>' + responseJson.businesses[i].location.display_address + '</div>';
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
    var infowindow = new google.maps.InfoWindow({
        content: bizInfo
    });

    marker.addListener('click', function() {
        closeOtherInfo();
        // opens info window for the clicked marker
        infowindow.open(map, marker);
        infoObj[0] = infowindow;
    });
}

// closes info window
function closeOtherInfo() {
    if (infoObj.length > 0) {
        infoObj[0].set('marker', null);
        infoObj[0].close();
        infoObj[0].length = 0;
    }
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
