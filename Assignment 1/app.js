let currentImageBlob = null; // In-memory storage

document.getElementById('photo-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageBlob = event.target.result; // Store Base64 string
            const img = document.getElementById('preview-image');
            img.src = currentImageBlob;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});