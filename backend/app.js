const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mainRoutes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 8080;
dotenv.config();

const app = express();
// Middleware
app.use(cors());
// app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' })); // for handling multipart form-data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/', mainRoutes);
app.use('/', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error('MongoDB connection failed:', err);
});

module.exports = app;


