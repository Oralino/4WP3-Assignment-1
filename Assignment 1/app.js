
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