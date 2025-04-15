const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Variable to store the latest sensor data
let sensorData = {};

// POST endpoint to receive and store the latest data
app.post('/api/data', (req, res) => {
    console.log('Data received:', req.body);
    sensorData = req.body; // Overwrite with the latest data
    res.status(200).json({
        status: 'success',
        message: `Received data from ${req.socket.remoteAddress}`
    });
});

// GET endpoint to serve the latest sensor data
app.get('/api/sensor-data', (req, res) => {
    res.json(sensorData);
});

// Start the server
app.listen(3001, '10.191.62.125', () => {
    console.log('Server running at http://10.191.62.125:3001');
});
