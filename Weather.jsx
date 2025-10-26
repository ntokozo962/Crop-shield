import React, { useState } from 'react';
import { useWeatherAPI } from '../hooks/useWeatherAPI';

function Weather() {
  const [location, setLocation] = useState('');
  const { loading, error, report, currentStep, fetchWeatherReport, reset } = useWeatherAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    await fetchWeatherReport(location);
  };

  const handleReset = () => {
    reset();
    setLocation('');
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl font-bold text-primary mb-2">Weather Report</h1>
          <p className="text-lg text-card font-medium">Climate Resilience for South African Farmers</p>
        </div>

        {/* Main Content */}
        <div className="glass-card rounded-2xl shadow-xl p-6 border border-white/20">
          {!report ? (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="location" className="block text-lg font-medium text-primary mb-2">
                    Enter your farm location (e.g., "Lichtenburg, North West"):
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Thabazimbi, Limpopo"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/80 border border-card rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg placeholder-gray-600"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !location.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? 'Loading...' : 'Get My Climate Report'}
                </button>
              </form>

              {/* Loading State */}
              {loading && (
                <div className="mt-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-primary text-lg font-medium">{currentStep}</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 text-center font-medium">Location not found. Please try a nearby town.</p>
                </div>
              )}
            </div>
          ) : (
            <WeatherReport report={report} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
}

// Weather Report Component
const WeatherReport = ({ report, onReset }) => {
  const { location, elevation, analysis } = report;
  const { currentWeather, risks, recommendations, locationData } = analysis;

  const handleShare = () => {
    const text = `Weather Report for ${location}`;
    if (navigator.share) {
      navigator.share({
        title: 'Weather Report',
        text: text,
        url: window.location.href,
      });
    } else {
      alert('Share this report manually');
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card pb-4">
        <h2 className="text-3xl font-bold text-primary">Weather Report</h2>
        <button 
          onClick={onReset}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Check Another Location
        </button>
      </div>

      {/* CURRENT WEATHER - NEW SECTION */}
      <div className="glass rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-primary mb-4">CURRENT WEATHER</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <span className="font-semibold text-primary block">Temperature</span>
            <p className="text-gray-800 font-medium">{currentWeather.temperature}°C</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-primary block">Humidity</span>
            <p className="text-gray-800 font-medium">{currentWeather.humidity}%</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-primary block">Rainfall</span>
            <p className="text-gray-800 font-medium">{currentWeather.precipitation} mm</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-primary block">Wind Speed</span>
            <p className="text-gray-800 font-medium">{currentWeather.windSpeed} km/h</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-3 text-center">
          Last updated: {new Date(currentWeather.time).toLocaleString()}
        </p>
      </div>

      {/* Location Details */}
      <div className="glass rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-primary mb-4">LOCATION DETAILS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <span className="font-semibold text-primary block">Farm Location</span>
            <p className="text-gray-800 font-medium">{location}</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-primary block">Elevation</span>
            <p className="text-gray-800 font-medium">{elevation ? `${elevation.toFixed(0)} m` : 'Not available'}</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-primary block">Recent Rainfall</span>
            <p className="text-gray-800 font-medium">{locationData.avgRainfall} mm (10-day avg)</p>
          </div>
        </div>
      </div>

      {/* Immediate Risks */}
      {risks.length > 0 && (
        <div className="glass rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-primary mb-4">IMMEDIATE RISKS (Next 7 Days)</h3>
          <div className="space-y-3">
            {risks.map((risk, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-4">
                <strong className="text-primary block mb-1">{risk.date}:</strong> 
                <span className="text-gray-800 font-medium">{risk.risks.join(' + ')}</span>
                <div className="text-sm text-gray-700 mt-2">
                  Temperature: <strong>{risk.temperature}°C</strong> | Rainfall: <strong>{risk.rainfall}mm</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Climate Context */}
      <div className="glass rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-primary mb-4">CLIMATE CONTEXT</h3>
        <p className="text-gray-800 font-medium">
          Past 10 days: {locationData.avgRainfall} mm of rain
          {locationData.avgRainfall < 30 ? ' - drier than typical October conditions' : ''}
        </p>
      </div>

      {/* Action Plan */}
      <div className="glass rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-primary mb-4">ACTION PLAN FOR YOUR FARM</h3>
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start bg-white/50 rounded-lg p-3">
              <span className="text-primary mr-3 text-xl">•</span>
              <span className="text-gray-800 font-medium">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button 
          onClick={() => window.print()}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Print Report
        </button>
        <button 
          onClick={handleShare}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Share via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Weather;