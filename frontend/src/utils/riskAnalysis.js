export const analyzeRisks = (weatherData, elevation) => {
  const { current, daily } = weatherData;
  const risks = [];
  const recommendations = [];

  // Get current weather data
  const currentWeather = {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    windSpeed: current.wind_speed_10m,
    time: current.time
  };

  // Calculate average rainfall for past 10 days only
  const pastRainfall = daily.precipitation_sum.slice(0, 10);
  const avgRainfall = pastRainfall.reduce((a, b) => a + b, 0) / pastRainfall.length;

  // Get today's date to filter only future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Analyze only future dates (forecast)
  daily.time.forEach((dateString, index) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    // Skip past dates - only process future dates
    if (date < today) return;

    const temp = daily.temperature_2m_max[index];
    const rain = daily.precipitation_sum[index];

    const dayRisks = [];

    // Heat risk
    if (temp > 35) {
      dayRisks.push(`High heat (${temp}°C)`);
    }

    // Flood risk
    let floodRisk = rain > 50;
    if (elevation && elevation < 1200 && rain > 30) {
      floodRisk = true;
    }

    if (floodRisk) {
      dayRisks.push(`Extreme rainfall (${rain}mm)`);
    }

    if (dayRisks.length > 0) {
      risks.push({
        date: dateString,
        risks: dayRisks,
        temperature: temp,
        rainfall: rain
      });
    }
  });

  // Generate recommendations based on risks
  if (risks.some(risk => risk.risks.some(r => r.includes('rainfall')))) {
    recommendations.push(
      "Harvest any mature vegetables or fruits before heavy rain",
      "Avoid tilling during wet soil conditions to prevent compaction",
      "Apply organic mulch after rain to protect topsoil"
    );
  }

  if (risks.some(risk => risk.temperature > 35)) {
    recommendations.push(
      "Consider shade nets for sensitive crops",
      "Increase irrigation frequency during heat waves",
      "Monitor for pollination issues in maize crops"
    );
  }

  // Long-term recommendations based on climate patterns
  if (avgRainfall < 20) {
    recommendations.push(
      "Consider switching to drought-resistant crops like sorghum or cowpeas"
    );
  }

  return {
    currentWeather, // Add current weather to analysis
    risks,
    recommendations,
    locationData: {
      elevation,
      avgRainfall: avgRainfall.toFixed(1)
    }
  };
};