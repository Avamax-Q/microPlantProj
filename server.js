const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the serial port (adjust 'COM3' to your port name)
const serialPort = new SerialPort({ path: 'COM3', baudRate: 9600 });

// Set up a parser to read data line by line
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Variable to store the latest sensor data
let sensorData = {
    soilMoisture: null,
    temperature: null,
    humidity: null,
    timestamp: null
};

// Function to parse sensor data from the incoming string
function parseSensorData(data) {
    const values = data.split(',').map(val => parseFloat(val.trim()));
    if (values.length === 3 && values.every(val => !isNaN(val))) {
        return {
            soilMoisture: values[0],
            temperature: values[1],
            humidity: values[2],
            timestamp: new Date().toISOString()
        };
    } else {
        console.error('Invalid data format:', data);
        return null;
    }
}

// Handle incoming data from the serial port
parser.on('data', (data) => {
    const parsedData = parseSensorData(data);
    if (parsedData) {
        sensorData = parsedData;
        console.log('Updated sensor data:', sensorData);
        // Write the data to a JSON file
        fs.writeFileSync('sensorData.json', JSON.stringify(sensorData, null, 2));
    }
});

serialPort.on('error', (err) => {
    console.error('Serial port error:', err.message);
});

// Endpoint to serve the latest sensor data
app.get('/api/sensor-data', (req, res) => {
    res.json(sensorData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
     