document.getElementById('uploader').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file);
    }
});

function uploadFile(file) {
    const formData = new FormData();
    formData.append('Image', file);

    // Example: Adjust the API URL based on your backend setup
    fetch('http://x526d.3bbddns.com:19545/upload-image', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('File uploaded successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('File upload succesfully!');
    });
}
