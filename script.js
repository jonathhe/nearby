const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let map;
let loc;
let time;
let places = [];

const success = async (pos) => {
  const crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  time = new Date().getHours();

  loc = {
    lat: crd.latitude,
    lng: crd.longitude,
  };

  nearbySearch();
};

function generateRequest(text, SearchNearbyRankPreference, center) {
  return {
    textQuery: text,
    // required parameters
    fields: ["displayName", "googleMapsURI", "photos"],
    locationBias: {
      center: center,
      radius: 2000,
    },
    isOpenNow: true,
    // optional parameters
    maxResultCount: 3,
    minRating: 4,
    rankPreference: SearchNearbyRankPreference.DISTANCE,
  };
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

async function initMap() {
  navigator.geolocation.getCurrentPosition(success, error, options);
}

async function nearbySearch() {
  //@ts-ignore
  console.log("Nearby Search");
  console.log(loc);
  let center = new google.maps.LatLng(loc.lat, loc.lng);

  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary(
    "places"
  );
  const breakfastRequest = generateRequest(
    "breakfast",
    SearchNearbyRankPreference,
    center
  );
  const lunchRequest = generateRequest(
    "lunch",
    SearchNearbyRankPreference,
    center
  );
  const restaurantRequest = generateRequest(
    "restaurant",
    SearchNearbyRankPreference,
    center
  );
  const drinksRequest = generateRequest(
    "drinks",
    SearchNearbyRankPreference,
    center
  );

  let requestToPerform;

  console.log("Time: " + time);
  console.log("Is right:", 15 < time && time < 21);

  if (time > 5 && time <= 11) {
    requestToPerform = breakfastRequest;
  } else if (time > 11 && time <= 15) {
    requestToPerform = lunchRequest;
  } else if (time > 15 && time <= 21) {
    requestToPerform = restaurantRequest;
  } else {
    requestToPerform = drinksRequest;
  }

  const { places } = await Place.searchByText(requestToPerform);
  if (places.length) {
    console.log(places);
    let placesWrapper = document.getElementById("places");
    places.forEach((place) => {
      placesWrapper.innerHTML += placeHtml(place);
    });
  } else {
    console.log("No results");
  }
}

const placeHtml = (place) => {
  return `
    <li onclick="location.href = '${place.googleMapsURI}';" class="place">
      <img class="place-image" width="100" height="100" src=${
        place.photos[0].getURI({
          width: 100,
        }) ?? "public/icon.svg"
      }></img>
      <h1>${place.displayName}</h1>
    </li>`;
};
