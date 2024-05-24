/*Script Athallah*/

let map = L.map('map').setView([-7.95403, 112.61449], 19);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let mainMarker = {
    marker: null,
    id: 301924,
    isSet: false
};

/*if (localStorage.getItem("mainMarker") === null) {
    mainMarker = {
        marker: null,
        id: 301924,
        isSet: false
    };
    localStorage.setItem("mainMarker", JSON.stringify(mainMarker));
} else {
    mainMarker = JSON.parse(localStorage.getItem("mainMarker"));
    if (mainMarker.isSet === true) {
        mainMarker.marker.addTo(map);
    }
}*/

map.addEventListener("click", (e) => {
    if (mainMarker.isSet === false) {
        mainMarker.marker = L.marker([-7.95403, 112.61449], {
            draggable: true
        }).addTo(map);
        mainMarker.isSet = true;

        mainMarker.marker.addEventListener("drag", (e) => {
            mainMarker.marker.bindPopup(createPopUpContent(e.latlng.lat, e.latlng.lng), {closeButton: false}).openPopup();
        })
    } else {
        mainMarker.marker.setLatLng([e.latlng.lat, e.latlng.lng]);
    }
    mainMarker.marker.bindPopup(createPopUpContent(e.latlng.lat, e.latlng.lng), {closeButton: false}).openPopup();
})

function createPopUpContent(lat, lng) {
    return `
        <label class="form-label mb-1" style="font-size: .75rem">Latitude</label>
        <p class="form-control form-control-sm mt-0 border-dark-subtle" style="margin-bottom: .75em" id="latitude-col">${lat}</p>
        <label class="form-label mb-1" style="font-size: .75rem">Longitude</label>
        <p class="form-control form-control-sm mt-0 border-dark-subtle mb-3">${lng}</p>
        <button id="add-button" class="btn btn-primary btn-sm w-100" style="font-size: .8rem">Add</button>`;
}

let addButton = document.querySelector("button#add-button");
addButton.addEventListener("click", (e) => {
    let data = {
        latitude: mainMarker.marker.getLatLng().lat,
        longitude: mainMarker.marker.getLatLng().lng,
        name: ,
        description:
    }
    fetch(
        'Controller.php', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        }
    ).then(

    )
})

/*Script ...*/
/*Script ...*/
/*Script ...*/
