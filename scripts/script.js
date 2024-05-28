/*Script Athallah*/
// let editModal = new bootstrap.Modal(document.querySelector("div#editModal"));
let geocodeCache;
let debounceTimeout;
let mainMarker = {
    marker: null,
    id: 301924,
    isSet: false,
    location: null,
    address: null
};

let map = L.map('map').setView([-7.2458381, 112.7378687], 17);
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

map.addEventListener("click", (e) => {
    if (mainMarker.isSet === false) {
        mainMarker.marker = L.marker([e.latlng.lat, e.latlng.lng], {
            draggable: true
        }).addTo(map);
        mainMarker.isSet = true;
        updateMarkerPopup(e.latlng.lat, e.latlng.lng, false);

        mainMarker.marker.addEventListener("dragend", (e) => {
            let latlng = e.target.getLatLng();
            updateMarkerPopup(latlng.lat, latlng.lng, false);
        })
    } else {
        updateMarkerPopup(e.latlng.lat, e.latlng.lng, true);
    }
    map.setView([e.latlng.lat, e.latlng.lng], 19);
})

document.addEventListener("click", (e) => {
    let element = e.target;
    if (element.id === "add-button") {
        let data = {
            latitude: mainMarker.marker.getLatLng().lat,
            longitude: mainMarker.marker.getLatLng().lng,
            name: mainMarker.location,
            description: mainMarker.address,
            method: "create"
        }

        let addButton = document.querySelector("#add-button");
        addButton.disabled = true;
        addButton.textContent = "";

        let spinner = document.createElement("span");
        spinner.classList.add("spinner-border", "spinner-border-sm");
        addButton.appendChild(spinner);

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
                fetchData();
                setTimeout(() => {
                    addButton.disabled = false;
                    addButton.textContent = "Add";
                    setTimeout(() => {
                        alert(data);
                    }, 100)
                }, 500)
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
    mainMarker.marker.bindPopup(createLoaderPopUp()).openPopup();
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

function createLoaderPopUp() {
    return L.popup({
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false,
        className: 'loading-popup'
    }).setContent('<div class="container-fluid h-100 d-flex justify-content-center align-items-center"><div id="popup-spinner" class="spinner-border" role="status"></div></div>');
}

function createMarkers(points) {
    points.forEach(point => {
        let marker = L.marker([point.latitude, point.longitude], {draggable: true}).addTo(map);
        marker.bindPopup(createPopUpContent(point.latitude, point.longitude, point.name, point.description), { closeButton: false });

        marker.on('contextmenu', function () {
            showDeleteModal(point.latitude, point.longitude, marker);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

function fetchData() {
    fetch(
        `${getBaseUrl()}/public/entry.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ method: "read" })
        }
    ).then(
        response => response.json()
    ).then(
        data => {
            createMarkers(data);
        }
    );
}

/* Zahrina Arij*/
function showDeleteModal(lat, lng, marker) {
    let modalContent = `
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Delete Point</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this point?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteButton">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalContent);
    let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    document.getElementById('confirmDeleteButton').onclick = function() {
        deletePoint(lat, lng, marker);
        deleteModal.hide();
    };
}

/*Function to delete point*/
function deletePoint(lat, lng, marker) {
    fetch(`${getBaseUrl()}/public/entry.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ method: "delete", latitude: lat, longitude: lng })
    })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            map.removeLayer(marker);
        });
}

/*Update*/
/*function showEditModal(data) {
    document.querySelector("#latitude-input").value = data.latitude;
    document.querySelector("#longitude-input").value = data.longitude;
    document.querySelector("#name-input").value = data.name;
    document.querySelector("#description-input").value = data.description;
    editModal.show();
}

function closeEditModal() {
    editModal.hide();
}

let editButton = document.querySelector("button#edit-button");
editButton.addEventListener("click", () => {
    closeEditModal();
    let data = {
        latitude:     document.querySelector("#latitude-input").value,
        longitude: document.querySelector("#longitude-input").value,
        name: document.querySelector("#name-input").value,
        description: document.querySelector("#description-input").value,
        method: "update"
    }
    fetch(
        `${getBaseUrl()}/public/entry.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    ).then(
        response => response.text()
    ).then(
        data => {
            console.log(data);
        }
    );
})*/

/*Script Fian => Dicomment karena merusak fungsi lainnya*/
/*
function activateUpdateMode(marker) {
    let latitudeInput = document.getElementById('latitude-update');
    let longitudeInput = document.getElementById('longitude-update');
    let nameInput = document.getElementById('name-update');
    let descriptionInput = document.getElementById('description-update');

    latitudeInput.value = marker.getLatLng().lat;
    longitudeInput.value = marker.getLatLng().lng;
    nameInput.value = mainMarker.location;
    descriptionInput.value = mainMarker.address;

    $('#editModal').modal('show');

    let updateButton = document.getElementById('editButton-update');
    updateButton.addEventListener('click', function() {
        let updatedData = {
            id_poi: mainMarker.id,
            latitude: parseFloat(latitudeInput.value),
            longitude: parseFloat(longitudeInput.value),
            name: nameInput.value,
            description: descriptionInput.value,
            method: "update"
        };

        fetch(`${getBaseUrl()}/public/entry.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        }).then(response => response.text())
            .then(data => {
                console.log(data);

                if (data === "Data Updated") {
                    marker.setLatLng([updatedData.latitude, updatedData.longitude]);
                    marker.bindPopup(createPopUpContent(updatedData.latitude, updatedData.longitude, updatedData.name, updatedData.description), { closeButton: false });
                }
            });
    });
}

mainMarker.marker.on('dragend', function(e) {
    activateUpdateMode(mainMarker.marker);
});

mainMarker.marker.on('click', function(e) {
    activateUpdateMode(mainMarker.marker);
});
*/

