
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [longi(E), lat(N)]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
console.log(listing.geometry.coordinates)
const marker = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(listing.geometry.coordinates)//here coordinates is array came from shows.ejs di <script> as we cannot access them directly in piblic folder
    .setPopup(new mapboxgl.Popup({offset: 25})  .setHTML(`<h1>${listing.title}</h1> <p> Exact Location Will Be Shared After Booking </p>`))
    .addTo(map);
