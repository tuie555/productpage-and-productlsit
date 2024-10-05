document.getElementById('uploader').classList.remove('invisible');

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
  
    fetch('http://x526d.3bbddns.com:19545/upload-image', {
      method: 'POST',
      mode: 'cors',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('File uploaded successfully!');
      
      // Hide the uploader element
      document.getElementById('uploader').style.display = 'none';
      
      // Display the uploaded image
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.width = 325;
      img.height = 250;
      document.body.appendChild(img);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Upload failed');
    });
}