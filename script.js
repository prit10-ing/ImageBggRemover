const fileInput = document.getElementById('file-input');
const uploadBox = document.getElementById('upload-box');
const originalImage = document.getElementById('original-image');
const removedBgImage = document.getElementById('removed-bg-image');
const imagesPreview = document.getElementById('images-preview');

uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.style.backgroundColor = '#eef';
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.style.backgroundColor = '';
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.style.backgroundColor = '';
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    originalImage.src = e.target.result;
    imagesPreview.style.display = 'flex';
  };
  reader.readAsDataURL(file);

  removeBackground(file);
}
function removeBackground(file) {
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "d3mBuXVEnrZYfhk8nRuxinzd"
    },
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error("Remove.bg API failed.");
    return response.blob();
  })
  .then(blob => {
    const blobUrl = URL.createObjectURL(blob);
    removedBgImage.src = blobUrl;

    // Enable download
    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.href = blobUrl;
    downloadBtn.style.display = "inline-block";
  })
  .catch(error => {
    alert("Error: " + error.message);
  });
}

