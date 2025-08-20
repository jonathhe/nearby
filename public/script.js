const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let map;
let service;
let infowindow;

const getPlaceDetails = async (place) => {
  service.getDetails(place, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let placesWrapper = document.getElementById("places");
      placesWrapper.innerHTML += placeHtml(place);
    }
  });
};

const callback = async (results, status) => {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].rating > 4) {
        getPlaceDetails(results[i]);
        return;
      }
    }
  }
};

const success = (pos) => {
  const crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  let loc = {
    lat: crd.latitude,
    lng: crd.longitude,
  };

  let location = new google.maps.LatLng(loc.lat, loc.lng);

  map = new google.maps.Map(document.createElement("div"), {
    center: location,
    zoom: 15,
  });

  let requests = [
    {
      keyword: "restaurant",
      location: location,
      radius: "1000",
      type: ["restaurant"],
      openNow: true,
      maxprice: 3,
      minprice: 1,
    },
    {
      keyword: "bar",
      location: location,
      radius: "1000",
      type: ["bar"],
      openNow: true,
    },
    {
      keyword: "beach",
      location: location,
      radius: "1000",
      // type: ["tourist_attraction"],
      // openNow: true,
      // maxprice: 3,
      // minprice: 1,
    },
  ];

  service = new google.maps.places.PlacesService(map);
  requests.forEach((request) => {
    console.log(request);
    service.nearbySearch(request, callback);
  });
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}


function initMap() {

  navigator.geolocation.getCurrentPosition(success, error, options);

  
}

const placeHtml = (place) => {
  return `
    <li onclick="location.href = '${place.url}';" class="place">
      <img class="place-image" src=${place.photos[0].getUrl()}></img>
      <h1>${place.name}</h1>
    </li>`;
};
