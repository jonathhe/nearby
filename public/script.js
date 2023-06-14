const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let loc;
let map;
let service;
let infowindow;
let places = [];

const getPlaceDetails = (place) => {
  service.getDetails(place, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      places.push(place);
      console.log(place);
    }
  });
};

const callback = (results, status) => {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log(results[0]);
    for (let i = 0; i < results.length; i++) {
      if (results[i].rating > 3.5) {
        getPlaceDetails(results[i]);
        return;
      }
    }
  }
};

const success = async (pos) => {
  const crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  loc = {
    lat: crd.latitude,
    lng: crd.longitude,
  };
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

function initMap() {
  let location = new google.maps.LatLng(loc.lat, loc.lng);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.createElement("div"), {
    center: location,
    zoom: 15,
  });

  let request = {
    keyword: "restaurant",
    location: location,
    radius: "1000",
    type: ["restaurant"],
    openNow: true,
    maxprice: 3,
    minprice: 1,
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}
