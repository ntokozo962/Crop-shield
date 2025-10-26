import { useState } from 'react';
import { geocodeLocation, getElevation, getWeatherData } from '../services/weatherApi';
import { analyzeRisks } from '../utils/riskAnalysis';

export const useWeatherAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [currentStep, setCurrentStep] = useState('');

  const fetchWeatherReport = async (location) => {
    setLoading(true);
    setError('');
    setReport(null);

    try {
      setCurrentStep('Finding your farm location...');
      const geoData = await geocodeLocation(location);
      
      if (!geoData) {
        throw new Error('Location not recognized. Try a nearby town.');
      }

      const { lat, lon, display_name } = geoData;

      setCurrentStep('Checking your farm elevation...');
      const elevation = await getElevation(lat, lon);

      setCurrentStep('Analyzing weather risks for your crops...');
      const weatherData = await getWeatherData(lat, lon);

      setCurrentStep('Generating your climate report...');
      const analysis = analyzeRisks(weatherData, elevation);

      setReport({
        location: display_name,
        coordinates: { lat, lon },
        elevation,
        weatherData,
        analysis
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCurrentStep('');
    }
  };

  return {
    loading,
    error,
    report,
    currentStep,
    fetchWeatherReport,
    reset: () => {
      setReport(null);
      setError('');
    }
  };
};