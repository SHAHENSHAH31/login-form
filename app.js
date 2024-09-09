const express = require('express');
const mongoose = require('mongoose');
//const dotenv = require('dotenv');
const authRoutes = require('./routers/auth');

//dotenv.config();  // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON data

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/MERNS", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
