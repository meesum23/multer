const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
// Static Folder Setup (uploads folder ko access dena)
app.use(express.static(__dirname));
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
})
// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
// File Filter for Images Only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
// Multer Middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB limit
});
// Route for Form Submission
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        const imageUrl = `/uploads/${req.file.filename}`;
        res.send(`<h2>File uploaded successfully!</h2><img src="${imageUrl}" alt="Uploaded Image" width="300">`);
    } catch (error) {
        res.status(400).send('Error uploading file.');
    }
});
// Start the Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
