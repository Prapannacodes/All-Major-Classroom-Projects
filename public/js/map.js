
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    // accessToken: mapToken,
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinate, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

console.log(coordinate);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinate)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h6>${Listing.title}</h6><p>Exact Location will be provided after booking</p>`))
    .addTo(map);