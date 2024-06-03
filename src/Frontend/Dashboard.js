/*
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Image } from '@chakra-ui/react';
import { getWeatherData } from '../Backend/Graphql_helper';
import WeatherEditModal from './WeatherEditModal';

const TemperatureList = ({ weatherData, onGenerateHistogram }) => {
  return (
    <Box p={4} mb={4}>
      <Heading as="h3" size="md">Recent Temperatures:</Heading>
      <Text>{weatherData.map(weather => `${weather.temperature}°C`).join(', ')}</Text>
      <Button colorScheme="blue" mt={4} onClick={onGenerateHistogram}>
        Generate Histogram
      </Button>
    </Box>
  );
};

const sendTemperatureData = async (temperatures) => {
  try {
    const response = await fetch('/generate_histogram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ temperatures })
    });

    // Log the response text to see what it actually is
    const responseText = await response.text();
    console.log("Response Text:", responseText);

    // Only convert to JSON if the response is OK and content type is application/json
    if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
      const data = JSON.parse(responseText);
      console.log(data.message);
    } else {
      console.error('Failed to receive JSON, response received:', responseText);
    }
  } catch (err) {
    console.error('Error in sending temperature data:', err);
  }
};

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData();
        setWeatherData(response.data.weather_data);
      } catch (err) {
        console.error('Failed to fetch weather data', err);
      }
    };
    fetchData();
  }, []);

  const onGenerateHistogram = async () => {
    const temperatures = weatherData.map(weather => weather.temperature);
    await sendTemperatureData(temperatures);
  };

  return (
    <Box display="flex" p={4}>
      <Box flex="1">
        <Heading as="h1" mb={4}>Weather Data</Heading>
        {weatherData.length > 0 ? <TemperatureList weatherData={weatherData} onGenerateHistogram={onGenerateHistogram} /> : <Text>Loading...</Text>}
      </Box>
      <Box flex="1">
        <Image src={`http://localhost:8080/standard_deviation_plot.png?${Date.now()}`} alt="Temperature Distribution Plot" />
      </Box>
    </Box>
  );
};

export default Dashboard;


*/

import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Image, useDisclosure } from '@chakra-ui/react';
import { getWeatherData, editWeatherData } from '../Backend/Graphql_helper';
import WeatherEditModal from './WeatherEditModal';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response.data.weather_data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = weather => {
    setSelectedWeather(weather);
    onOpen();
  };

  const onGenerateHistogram = async () => {
    const temperatures = weatherData.map(weather => weather.temperature);
    try {
      // Request for standard deviation chart
      const responseStdDev = await fetch('/generate_standard_deviation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperatures })
      });
      // Optionally handle the response for standard deviation

      // Request for danger zone chart
      const responseDangerZone = await fetch('/generate_danger_zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperatures })
      });
      // Optionally handle the response for danger zone
    } catch (err) {
      console.error('Error in sending temperature data:', err);
    }
  };

  return (
    <Flex p={4}>
      {}
      <Box flex="1" mr={2}>
        <Heading as="h1" mb={4}>Weather Data</Heading>
        {weatherData.length === 0 ? (
          <Text>Loading...</Text>
        ) : (
          weatherData.map((weather, index) => (
            <Box key={index} p={1} shadow="md" borderWidth="1px" mb={4}>
              <Heading as="h2" size="md">{weather.station.name}</Heading>
              <Text><strong>Timestamp:</strong> {new Date(weather.ts * 1000).toLocaleString()}</Text>
              <Text><strong>Temperature:</strong> {weather.temperature}°C</Text>
              <Text><strong>Humidity:</strong> {weather.percent_humidity}%</Text>
              <Text><strong>Wind Speed:</strong> {weather.wind_speed} m/s</Text>
              <Text><strong>Wind Direction:</strong> {weather.wind_direction}°</Text>
              <Button mt={2} onClick={handleEditClick}>Edit</Button>
            </Box>
          ))
        )}
        {selectedWeather && (
          <WeatherEditModal
            isOpen={isOpen}
            onClose={onClose}
            weather={selectedWeather}
            fetchData={fetchData}
          />
        )}
      </Box>

      {}
      <Box flex="1">
        <Button colorScheme="blue" mt={4} onClick={onGenerateHistogram}>Generate Charts</Button>
        <Image src={`http://localhost:8080/standard_deviation_plot.png?${Date.now()}`} alt="Standard Deviation Plot" />
        <Image src={`http://localhost:8080/temperature_danger_zone_plot.png?${Date.now()}`} alt="Temperature Danger Zone Plot" />
      </Box>
    </Flex>
  );
};

export default Dashboard;
