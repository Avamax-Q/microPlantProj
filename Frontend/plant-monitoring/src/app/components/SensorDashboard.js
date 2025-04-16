'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartPieIcon, SunIcon, CloudIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import React from 'react';
import useSensorData from '../hooks/useSensorData'; // Adjust the import path as needed

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
  const { data, history, error, soilMoisturePercentage } = useSensorData(5000);

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const moistureBorderClass = soilMoisturePercentage < 50 ? 'border-2 border-red-500' : 'border-2 border-green-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Plant Monitoring System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          value={data.ambientTemperature}
          unit="°C"
        />
        <DataCard
          icon={<CloudIcon className="h-6 w-6" />}
          title="Humidity"
          value={data.humidity}
          unit="%"
        />
        <DataCard
          icon={<LightBulbIcon className="h-6 w-6" />}
          title="Light Level"
          value={data.lightIntensity}
          unit="lux"
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
              <Line
                type="monotone"
                dataKey="light"
                stroke="#ffc658"
                name="Light (lux)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;
