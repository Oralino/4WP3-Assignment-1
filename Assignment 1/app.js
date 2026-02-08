
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
        mapID: "377473d33855fc722a4cd249"
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
    //logic to view marker data
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="width: 200px;">
                <h3 style="margin: 0 0 5px 0;">${landmark.title}</h3>
                ${landmark.image ? `<img src="${landmark.image}" style="width:100%; height:auto; border-radius: 4px;">` : ''}
                <p style="margin: 5px 0;">${landmark.description}</p>
                <button onclick="removeLandmark(${landmark.id})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; width: 100%;">
                    Delete Pin
                </button>
            </div>
        `
    });

    //Add Click Listener
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}

// add handle for submission and updates the ui
document.getElementById('landmark-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const desc = document.getElementById('description').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    const newLandmark = createLandmarkObject(title, desc, lat, lng, currentImageBlob);
    landmarks.push(newLandmark);
    placeMarker(newLandmark); 

    saveData();

    e.target.reset();
    document.getElementById('preview-image').style.display = 'none';
});

function saveData() {
    const safeData = landmarks.map(l => ({
        id: l.id,
        title: l.title,
        description: l.description,
        location: l.location,
        image: l.image
    }));
    localStorage.setItem('myLandmarks', JSON.stringify(safeData));
}



// Load on init
function loadSaved() {
    const saved = JSON.parse(localStorage.getItem('myLandmarks'));
    if(saved) {
        saved.forEach(l => {
            landmarks.push(l);
            placeMarker(l);
        });
    }
}


//deletes landmark
window.removeLandmark = function(id) {
    //finds the landmark in the list
    const index = landmarks.findIndex(l => l.id === id);
    
    if (index > -1) {
        //remove the pin from the map
        landmarks[index].markerRef.setMap(null);
        
        //remove the data from the array
        landmarks.splice(index, 1);
        
        //update Local Storage
        const safeData = landmarks.map(l => ({
            id: l.id,
            title: l.title,
            description: l.description,
            location: l.location,
            image: l.image
        }));
        localStorage.setItem('myLandmarks', JSON.stringify(safeData));
    }
};
