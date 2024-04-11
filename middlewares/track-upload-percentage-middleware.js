const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Custom middleware to track upload progress
const trackUploadProgress = (req, res, next) => {
  let totalSize = 0;
  let uploadedSize = 0;

  req.on('data', (chunk) => {
    uploadedSize += chunk.length;
    const percentage = Math.floor((uploadedSize / totalSize) * 100);
    // Emit an event or send the percentage to the client
    // You can use WebSockets, Server-Sent Events, or just send JSON response with the percentage
    // Example with JSON response
    res.json({ percentage });
  };

  req.on('end', () => {
    // Upload complete
    next();
  });

  // Retrieve total size of uploaded file
  req.on('file', (fieldname, file) => {
    totalSize = file.size;
  });

  next();
}

// Route to handle file upload
app.post('/upload', upload.single('file'), trackUploadProgress, (req, res) => {
  res.send('File uploaded successfully');
});

module.exports = trackUploadProgress;