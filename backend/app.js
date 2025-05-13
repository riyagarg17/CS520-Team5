const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mainRoutes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');
const helmet = require('helmet');
const pino = require('pino');

// Initialize pino logger
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty', // Makes logs more readable during development
        options: {
            colorize: true
        }
    }
});

const PORT = process.env.PORT || 8080;
dotenv.config();

const app = express();
// Middleware
app.use(cors());
// app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' })); // for handling multipart form-data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
//helmet is a security middleware that helps protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
// It helps secure your Express apps by setting various HTTP headers.
app.use(helmet()); // Security middleware
// Routes
app.use('/', mainRoutes);
app.use('/', authRoutes);

// Log incoming requests
app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'Incoming request');
    next();
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    logger.error({ err }, 'MongoDB connection failed');
});

module.exports = app;


