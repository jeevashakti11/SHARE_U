// Global file storage
let files = [];

// Function to fetch files from local storage
function getFiles() {
    return files;
}

// Save files to local storage
function saveFiles() {
    try {
        localStorage.setItem("files", JSON.stringify(files));
    } catch (e) {
        alert("Local storage limit reached. Consider switching to server storage.");
    }
}

// Load files from local storage
function loadFiles() {
    const savedFiles = JSON.parse(localStorage.getItem("files"));
    if (savedFiles) {
        files = savedFiles;
    }
}

// Display files to the user
function displayFiles(filteredFiles = null) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    const filesToShow = filteredFiles || getFiles();

    if (filesToShow.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No files found.';
        noResults.className = 'file-item';
        fileList.appendChild(noResults);
        return;
    }

    filesToShow.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const downloadButton = document.createElement('a');
        downloadButton.href = file.url;
        downloadButton.download = file.name;
        downloadButton.textContent = 'Download';
        downloadButton.className = 'download-btn';

        fileItem.appendChild(fileName);
        fileItem.appendChild(downloadButton);
        fileList.appendChild(fileItem);
    });
}

// Search files functionality
function searchFiles() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchTerm));
    displayFiles(filteredFiles);
}

// Admin: Upload a new file
function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            files.push({ name: file.name, url: e.target.result });
            saveFiles();
            renderAdminFiles();
            alert('File uploaded successfully!');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a file to upload.');
    }
}

// Admin: Render files for deletion
function renderAdminFiles() {
    const fileList = document.getElementById('admin-file-list');
    fileList.innerHTML = '';

    if (files.length === 0) {
        const noFiles = document.createElement('div');
        noFiles.textContent = 'No files uploaded yet.';
        noFiles.className = 'file-item';
        fileList.appendChild(noFiles);
        return;
    }

    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => {
            if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
                files.splice(index, 1);
                saveFiles();
                renderAdminFiles();
            }
        };

        fileItem.appendChild(fileName);
        fileItem.appendChild(deleteButton);
        fileList.appendChild(fileItem);
    });
}

// Utility function for password hashing
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
}

// Authentication for admin
async function authenticate() {
    const userId = prompt("Enter User ID:");
    const password = prompt("Enter Password:");

    const passwordHash = await hashPassword(password);

    if (userId === adminUserId && passwordHash === adminPasswordHash) {
        window.location.href = "admin.html";
    } else {
        alert("Access denied. Only admin is allowed to access this page.");
    }
}

// Initialize
function init() {
    loadFiles();
    displayFiles();
}

init();
