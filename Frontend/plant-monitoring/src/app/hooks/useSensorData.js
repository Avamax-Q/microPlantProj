import { useState, useEffect } from 'react';

const useSensorData = (refreshInterval = 15000) => {
  const [data, setData] = useState({ soilMoisture: '', ambientTemperature: '', humidity: '', lightIntensity: '' });
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Convert soil moisture reading to percentage
  const getSoilMoisturePercentage = (reading) => {
    if (reading === "" || reading === null || reading === undefined) return "";
    // Convert from raw value (0-1023) to percentage (100%-0%)
    const percentage = Math.round(reading-15,2);
    return isNaN(percentage) ? "" : percentage;
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://10.191.62.125:3001/api/sensor-data');
      const newData = await response.json();
      
      setData(newData);
      console.log(newData);
      // Add soil moisture percentage to history
      const newDataWithPercentage = {
        ...newData,
        timestamp: Date.now(),
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
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { 
    data, 
    history, 
    error,
    soilMoisturePercentage: getSoilMoisturePercentage(data.soilMoisture)
  };
};

export default useSensorData;
