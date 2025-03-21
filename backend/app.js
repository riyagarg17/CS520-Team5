import express from "express";
import router from "../backend/routes.js";

const PORT = 3000; 

const app = express(); 

app.use(express.json()); 

app.get("/", (req,res) => { 
    res.send("Hello world");
})

app.use("/", router); 

app.listen(PORT, () => console.log("Listening on http://localhost:3000"));