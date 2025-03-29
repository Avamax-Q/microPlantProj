'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartPieIcon, SunIcon, CloudIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';

// Modified DataCard to accept a custom borderClass
const DataCard = ({ icon, title, value, unit, borderClass = "" }) => {
  return (
    <div className={`bg-white p-4 rounded-lg text-black shadow ${borderClass}`}>
      <div className="flex items-center mb-2">
        {icon}
        <h2 className="text-lg font-semibold ml-2">{title}</h2>
      </div>
      <div className="text-3xl font-bold">
        {value} <span className="text-sm font-normal">{unit}</span>
      </div>
    </div>
  );
};

const SensorDashboard = () => {
  const [history, setHistory] = useState([
    { timestamp: Date.now() - 5000000, temperature: 24, humidity: 85, soilMoisture: 22 },
    { timestamp: Date.now() - 4000000, temperature: 25, humidity: 87, soilMoisture: 23 },
    { timestamp: Date.now() - 3000000, temperature: 26, humidity: 90, soilMoisture: 24 },
    { timestamp: Date.now() - 2000000, temperature: 27, humidity: 95, soilMoisture: 25 },
    { timestamp: Date.now() - 1000000, temperature: 25, humidity: 97, soilMoisture: 26 },
    { timestamp: Date.now(), temperature: 25, humidity: 100, soilMoisture: 25 }
  ]);

  const [data, setData] = useState({soilMoisture:"", temperature:"", humidity:""});
  const [error, setError] = useState(null);
  
  // Convert soil moisture reading to percentage
  const getSoilMoisturePercentage = (reading) => {
    if (reading === "" || reading === null || reading === undefined) return "";
    // Convert from raw value (0-1023) to percentage (100%-0%)
    const percentage = Math.round(100 - (reading / 1023 * 100));
    return isNaN(percentage) ? "" : percentage;
  };
  
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/sensor-data');
      const newData = await response.json();
      
      setData(newData);
      
      // Add soil moisture percentage to history
      const newDataWithPercentage = {
        ...newData,
        soilMoisturePercentage: getSoilMoisturePercentage(newData.soilMoisture)
      };
      
      setHistory(prev => [...prev.slice(-9), newDataWithPercentage]); // Keep last 10 entries
      setError(null);
    } catch (err) {
      setError('Failed to fetch sensor data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div>{error}</div>;

  // Get soil moisture percentage for display
  const soilMoisturePercentage = getSoilMoisturePercentage(data.soilMoisture);
  const moistureBorderClass = soilMoisturePercentage < 50 ? 'border-2 border-red-500' : 'border-2 border-green-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Plant Monitoring System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DataCard 
          icon={<ChartPieIcon className="h-6 w-6" />}
          title="Soil Moisture"
          value={soilMoisturePercentage}
          unit="%"
          borderClass={moistureBorderClass}
        />
        <DataCard
          icon={<SunIcon className="h-6 w-6" />}
          title="Temperature"
          value={data.temperature}
          unit="°C"
        />
        <DataCard
          icon={<CloudIcon className="h-6 w-6" />}
          title="Humidity"
          value={data.humidity}
          unit="%"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-black">
        <h2 className="text-xl font-semibold mb-4">Historical Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ff7300" 
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#82ca9d"
                name="Humidity (%)"
              />
              <Line
                type="monotone"
                dataKey="soilMoisturePercentage"
                stroke="#8884d8"
                name="Soil Moisture (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;