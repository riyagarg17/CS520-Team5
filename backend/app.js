const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mainRoutes = require('./routes/routes');
const authRoutes = require("./routes/authRoutes");

// mount all routes
app.use('/', mainRoutes);

app.use("/", authRoutes);  // This will serve /patients/login and /doctors/login

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


