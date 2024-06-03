// Libraries import
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure
} from '@chakra-ui/react';
// Files import
import {  editWeatherData } from '../Backend/Graphql_helper';


const WeatherEditModal = ({isOpen,onClose,weather,dataid,fetchdata}) => {
    console.log(weather)
    const [temperature,setTempeature] = useState(weather.temperature)
    const [humidity,setHumidity] = useState(weather.percent_humidity)
    const [windSpeed,setWindSpeed] = useState(weather.windSpeed)
    const [windDirection,setWindDirection] = useState(0)
    const [isSaving, setIsSaving] = useState(false);


  const handleSave = async () => {
    setIsSaving(true);
    try {
      await editWeatherData(dataid, temperature, humidity, windSpeed, windDirection);
      fetchdata();
      onClose();

    } catch (error) {
      console.error('Failed to save changes:', error);    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Edit Weather Data</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl id="temperature" mb={4}>
          <FormLabel>Temperature (°C)</FormLabel>
          <Input
            name="temperature"
            value={temperature}
            onChange={(e) => setTempeature(e.target.value)}
          />
        </FormControl>
        <FormControl id="percent_humidity" mb={4}>
          <FormLabel>Humidity (%)</FormLabel>
          <Input
            name="percent_humidity"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
          />
        </FormControl>
        <FormControl id="windSpeed" mb={4}>
          <FormLabel>Wind Speed </FormLabel>
          <Input
            name="Wind Speed"
            value={windSpeed}
            onChange={(e) => setWindSpeed(e.target.value)}
          />
        </FormControl>
        <FormControl id="windDirection" mb={4}>
          <FormLabel>Wind Direction </FormLabel>
          <Input
            name="Wind Direction"
            value={windDirection}
            onChange={(e) => setWindDirection(e.target.value)}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={handleSave}>
          Save
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default WeatherEditModal