import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import connectDB from "./db/conn.js";

const PORT = 3000; 

const app = express(); 

// Middleware
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req,res) => { 
    res.send("Hello world");
});

app.use("/api", router); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));