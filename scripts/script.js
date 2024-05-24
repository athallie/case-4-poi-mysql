/*Script Athallah*/
let geocodeCache;
let debounceTimeout;
let mainMarker = {
    marker: null,
    id: 301924,
    isSet: false,
    location: null,
    address: null
};

let map = L.map('map').setView([-7.2458381, 112.7378687], 19);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

if (!localStorage.getItem("geocodeCache")) {
    geocodeCache = {};
    localStorage.setItem("geocodeCache", JSON.stringify(geocodeCache));
} else {
    geocodeCache = JSON.parse(localStorage.getItem("geocodeCache"));
}

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
        mainMarker.marker = L.marker([e.latlng.lat, e.latlng.lng], {
            draggable: true
        }).addTo(map);
        mainMarker.isSet = true;
        // updateMarkerPopup(e.latlng.lat, e.latlng.lng, false);
        updateMarkerPopup(-7.2458381,112.7378687, false);

        mainMarker.marker.addEventListener("dragend", (e) => {
            let latlng = e.target.getLatLng();
            updateMarkerPopup(latlng.lat, latlng.lng, false);
        })
    } else {
        updateMarkerPopup(e.latlng.lat, e.latlng.lng, true);
    }
})

document.addEventListener("click", (e) => {
    let element = e.target;
    if (element.id === "add-button") {
        console.log("clicked")
        let data = {
            latitude: mainMarker.marker.getLatLng().lat,
            longitude: mainMarker.marker.getLatLng().lng,
            name: mainMarker.location,
            description: mainMarker.address,
            method: "create"
        }
        console.log(data)
        fetch(
            `${getBaseUrl()}/public/entry.php`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            }
        ).then(
            data => data.text()
        ).then(
            data => {
                console.log(data);
            }
        )
    }
})

function createPopUpContent(lat, lng, name, description) {
    return `
        <label class="form-label mb-1" style="font-size: .75rem">Latitude</label>
        <p class="form-control form-control-sm mt-0 border-dark-subtle" style="margin-bottom: .75em" id="latitude-col">${lat}</p>
        <label class="form-label mb-1" style="font-size: .75rem">Longitude</label>
        <p class="form-control form-control-sm mt-0 border-dark-subtle mb-3">${lng}</p>
        <label class="form-label mb-1" style="font-size: .75rem">Location</label>
        <p class="form-control form-control-sm mt-0 border-dark-subtle mb-3">${name}</p>
        <label class="form-label mb-1" style="font-size: .75rem">Description</label>
        <p class="form-control form-control-sm mt-0 border-dark-subtle mb-3">${description}</p>
        <button id="add-button" class="btn btn-primary btn-sm w-100" style="font-size: .8rem">Add</button>`;
}

async function reverseGeocoding(lat, lng) {
    let key = `${lat},${lng}`;
    if (geocodeCache[key]) {
        return Promise.resolve(geocodeCache[key]);
    }
    let data = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    ).then(
        data => {
            return data.json()
        }
    )
    geocodeCache[key] = data;
    localStorage.setItem("geocodeCache", JSON.stringify(geocodeCache));
    return data;
}

function updateMarkerPopup(lat, lng, setLatLng) {
    if (setLatLng) {
        mainMarker.marker.setLatLng([lat, lng]);
    }
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        reverseGeocoding(lat, lng).then(
            data => {
                mainMarker.marker.bindPopup(createPopUpContent(lat, lng, data.name, data.display_name), {closeButton: false}).openPopup();
                [mainMarker.location, mainMarker.address] = [data.name, data.display_name];
            }
        )
    }, 1000)
}

function getBaseUrl () {
    let url = new URL(window.location.href);
    let urlParts = url.pathname.split('/');
    if (urlParts.length > 2) {
        let projectRoot = urlParts[1];
        if (projectRoot.trim() !== "") {
            return url.origin + `/${projectRoot}`;
        }
    }
    return url.origin;
}

/*Script ...*/
/*Script ...*/
/*Script ...*/
