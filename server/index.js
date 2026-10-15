require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// 🟢 DATABASE CONNECTION 🟢
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in .env file!");
    process.exit(1); 
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("💎 Morphin Grid (MongoDB) Connected Successfully!"))
    .catch((err) => {
        console.error("❌ Database Connection Error!");
        console.error(err.message);
    });

// Pehla "Test" Route
app.get('/', (req, res) => {
    res.send("<h1>Zordon Ops Hub: API is Active on Port 5001!</h1>");
});

// 🚀 ROUTES CONNECT 🚀
app.use('/api/auth', require('./routes/auth'));
// ✅ Sahi jagah: app.listen se pehle
app.use('/api/issues', require('./routes/issues')); 

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        msg: 'Something broke inside the Command Center!',
        error: err.message 
    });
});

// ⚡ PORT CHANGED TO 5001 TO AVOID CONFLICTS
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Command Center teleported to port ${PORT}`);
    console.log(`📡 Press Ctrl+C to stop the server`);
});