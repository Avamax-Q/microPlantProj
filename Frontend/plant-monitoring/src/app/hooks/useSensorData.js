import { useState, useEffect } from 'react';

const useSensorData = (refreshInterval = 5000) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sensor-data');
      const newData = await response.json();
      
      setData(newData);
      setHistory(prev => [...prev.slice(-9), newData]); // Keep last 10 entries
      setError(null);
    } catch (err) {
      setError('Failed to fetch sensor data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  return { data, history, error };
};


export default useSensorData;