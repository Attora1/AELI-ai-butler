import type { Context, Config } from "@netlify/functions";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  visibility: number;
  pressure: number;
  icon: string;
  city: string;
  suggestions: string[];
  moodMapping: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
}

export default async (req: Request, context: Context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const url = new URL(req.url);
    const zip = url.searchParams.get('zip');
    
    if (!zip) {
      return new Response(JSON.stringify({ error: 'Missing zip parameter' }), {
        status: 400,
        headers
      });
    }

    const apiKey = Netlify.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Weather service not configured' }), {
        status: 500,
        headers
      });
    }

    // Get current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(zip)}&units=imperial&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      return new Response(JSON.stringify({ 
        error: errorData?.message || 'Weather service error' 
      }), {
        status: weatherResponse.status,
        headers
      });
    }

    const weatherData: OpenWeatherResponse = await weatherResponse.json();

    // Generate AELI-style suggestions based on weather
    const generateSuggestions = (temp: number, description: string, humidity: number): string[] => {
      const suggestions: string[] = [];
      
      // Temperature-based suggestions
      if (temp < 40) {
        suggestions.push("Bundle up with layers - your spoons will thank you for staying warm.");
        suggestions.push("Hot beverage time? Warm drinks help maintain energy.");
      } else if (temp > 85) {
        suggestions.push("Stay hydrated and seek shade. Heat can drain spoons quickly.");
        suggestions.push("Consider indoor activities during peak heat.");
      } else if (temp >= 65 && temp <= 75) {
        suggestions.push("Perfect weather for a gentle walk or outdoor time.");
      }

      // Weather condition suggestions
      if (description.toLowerCase().includes('rain')) {
        suggestions.push("Rainy day = perfect excuse for cozy indoor projects.");
        suggestions.push("Rain sounds can be soothing for focus work.");
      }
      
      if (description.toLowerCase().includes('sun')) {
        suggestions.push("Sunshine boost available - even 10 minutes outside helps.");
      }
      
      if (humidity > 70) {
        suggestions.push("High humidity - extra hydration and slower pace recommended.");
      }

      return suggestions.slice(0, 2); // Limit to 2 suggestions
    };

    // Map weather to mood icons (matching your MOODS constants)
    const mapWeatherToMood = (description: string, temp: number): string => {
      const desc = description.toLowerCase();
      
      if (desc.includes('clear') || desc.includes('sun')) {
        return 'sunny'; // ☀️ Sunny
      } else if (desc.includes('few clouds') || desc.includes('partly')) {
        return 'partly_cloudy'; // 🌤️ Partly Cloudy
      } else if (desc.includes('scattered clouds') || desc.includes('broken')) {
        return 'cloudy_with_sun'; // ⛅ Cloudy Sun
      } else if (desc.includes('overcast') || desc.includes('clouds')) {
        return 'cloudy'; // ☁️ Cloudy
      } else if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) {
        return 'rainy'; // 🌧️ Rainy
      } else {
        return 'partly_cloudy'; // Default
      }
    };

    const result: WeatherData = {
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed),
      feelsLike: Math.round(weatherData.main.feels_like),
      visibility: Math.round(weatherData.visibility / 1609), // Convert to miles
      pressure: weatherData.main.pressure,
      icon: weatherData.weather[0].icon,
      city: weatherData.name,
      suggestions: generateSuggestions(
        weatherData.main.temp, 
        weatherData.weather[0].description, 
        weatherData.main.humidity
      ),
      moodMapping: mapWeatherToMood(weatherData.weather[0].description, weatherData.main.temp)
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers
    });
  }
};

export const config: Config = {
  path: "/api/weather"
};