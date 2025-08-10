const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let map;
let loc;
let places = [];

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

  nearbySearch();
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

async function initMap() {
    navigator.geolocation.getCurrentPosition(success, error, options)
}

async function nearbySearch() {
    //@ts-ignore
    console.log("Nearby Search");
    console.log(loc);
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');
    // Restrict within the map viewport.
    let center = new google.maps.LatLng(loc.lat, loc.lng);
    const request = {
        textQuery: 'food',
        // required parameters
        fields: ['displayName', 'googleMapsURI', 'photos'],
        
        locationBias: {
            center: center,
            radius: 5000,
        },
        // optional parameters
        maxResultCount: 3,
        minRating: 4,
        rankPreference: SearchNearbyRankPreference.RELEVANCE
    };
    //@ts-ignore
    const { places } = await Place.searchByText(request);
    if (places.length) {
        console.log(places);
        let placesWrapper = document.getElementById("places");
        // Loop through and get all the results.
        places.forEach((place) => {
            placesWrapper.innerHTML += placeHtml(place);
        });
    }
    else {
        console.log("No results");
    }
}

const placeHtml = (place) => {

  return `
    <li onclick="location.href = '${place.googleMapsURI}';" class="place">
      <img class="place-image" src=${place.photos[0].getURI({maxHeight: 100})}></img>
      <h1>${place.displayName}</h1>
    </li>`;
};


