
// stores images locally
let currentImageBlob = null; 

document.getElementById('photo-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageBlob = event.target.result; 
            const img = document.getElementById('preview-image');
            img.src = currentImageBlob;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

//landmark storage and data object
let landmarks = [];

function createLandmarkObject(title, desc, lat, lng, image) {
    return {
        id: Date.now(),
        title: title,
        description: desc,
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        image: image
    };
}


// Geolocation API
document.getElementById('geo-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById('lat').value = pos.coords.latitude;
            document.getElementById('lng').value = pos.coords.longitude;
        });
    } else {
        alert("Geolocation not supported");
    }
});

//sets google maps
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.6532, lng: -79.3832 }, // Default set to toronto
        zoom: 13,
    });
}

//logic to place markers on map
function placeMarker(landmark) {
    const marker = new google.maps.Marker({
        position: landmark.location,
        map: map,
        title: landmark.title
    });
    landmark.markerRef = marker; 
}

//Inside placeMarker function
const infoWindow = new google.maps.InfoWindow({
    content: `<h3>${landmark.title}</h3><img src="${landmark.image}" width="150"><p>${landmark.description}</p>`
});

marker.addListener("click", () => {
    infoWindow.open(map, marker);
});