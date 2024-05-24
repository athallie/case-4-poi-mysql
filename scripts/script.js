let map = L.map('map').setView([-7.95403, 112.61449], 19);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.addEventListener("click", (e) => {

})

let marker = L.marker([-7.95403, 112.61449], {
    draggable: true
}).addTo(map);

marker.addEventListener("click", (e) => {
    marker.bindPopup(
        `Latitude: ${e.latlng.lat}<br>Longitude: ${e.latlng.lng}`
    ).openPopup();
})
marker.addEventListener("drag", (e) => {
    marker.bindPopup(
        `Latitude: ${e.latlng.lat}<br>Longitude: ${e.latlng.lng}`
    ).openPopup();
})
