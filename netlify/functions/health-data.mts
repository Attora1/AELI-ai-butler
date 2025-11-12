import type { Context, Config } from "@netlify/functions";

interface HealthData {
  spoons: number;
  energy_level: string;
  mood: string;
  sleep_hours?: number;
  activity_level?: string;
  stress_level?: number;
  notes?: string;
  timestamp: string;
}

interface HealthSummary {
  average_spoons: number;
  common_mood: string;
  energy_trend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

export default async (req: Request, context: Context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'log-spoons':
        // Log spoon count and energy data
        if (method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const { spoons, mood, sleep_hours, activity_level, stress_level, notes } = await req.json();
        
        if (spoons === undefined) {
          return new Response(JSON.stringify({ error: 'Spoons count is required' }), {
            status: 400,
            headers
          });
        }

        // Determine energy level based on spoons
        const getEnergyLevel = (spoonsCount: number): string => {
          if (spoonsCount >= 10) return 'high';
          if (spoonsCount >= 7) return 'good';
          if (spoonsCount >= 4) return 'moderate';
          if (spoonsCount >= 2) return 'low';
          return 'very_low';
        };

        const healthEntry: HealthData = {
          spoons,
          energy_level: getEnergyLevel(spoons),
          mood: mood || 'neutral',
          sleep_hours,
          activity_level,
          stress_level,
          notes,
          timestamp: new Date().toISOString()
        };

        // Here you could store to a database like Supabase
        // For now, we'll return the logged data
        return new Response(JSON.stringify({
          message: 'Health data logged successfully',
          data: healthEntry,
          recommendations: generateRecommendations(healthEntry)
        }), {
          status: 200,
          headers
        });

      case 'get-summary':
        // Get health summary (this would typically query a database)
        if (method !== 'GET') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const days = parseInt(url.searchParams.get('days') || '7');
        
        // Mock data for demonstration - replace with actual database query
        const mockSummary: HealthSummary = {
          average_spoons: 6.5,
          common_mood: 'partly_cloudy',
          energy_trend: 'stable',
          recommendations: [
            "Your energy levels are stable. Consider scheduling demanding tasks during your typical high-energy periods.",
            "You've been maintaining consistent spoon levels - keep up the self-care routine!",
            "Weather patterns suggest tomorrow might be a good day for outdoor activities."
          ]
        };

        return new Response(JSON.stringify(mockSummary), {
          status: 200,
          headers
        });

      case 'sync-apple-health':
        // Apple Health integration (would require HealthKit setup)
        return new Response(JSON.stringify({
          message: 'Apple Health integration coming soon',
          status: 'not_implemented'
        }), {
          status: 501,
          headers
        });

      case 'sync-google-fit':
        // Google Fit integration
        return new Response(JSON.stringify({
          message: 'Google Fit integration coming soon',
          status: 'not_implemented'
        }), {
          status: 501,
          headers
        });

      case 'energy-forecast':
        // Predict energy levels based on patterns
        if (method !== 'GET') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
          });
        }

        const forecast = {
          tomorrow: {
            predicted_spoons: 7,
            confidence: 'medium',
            factors: ['good sleep pattern', 'stable weather', 'light schedule'],
            suggestions: [
              "Good day for tackling that project you've been putting off",
              "Consider scheduling any social activities for tomorrow"
            ]
          },
          weekly_trend: 'stable',
          recommendations: [
            "Your patterns suggest you do best with consistent sleep schedules",
            "Monday mornings tend to be your highest energy - plan accordingly"
          ]
        };

        return new Response(JSON.stringify(forecast), {
          status: 200,
          headers
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers
        });
    }
  } catch (error) {
    console.error('Health data API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers
    });
  }
};

// Helper function to generate personalized recommendations
function generateRecommendations(healthData: HealthData): string[] {
  const recommendations: string[] = [];
  
  if (healthData.spoons < 4) {
    recommendations.push("Low spoon day detected. Consider gentle activities and extra self-care.");
    recommendations.push("This might be a good day for indoor, low-energy tasks.");
  } else if (healthData.spoons >= 8) {
    recommendations.push("High energy day! Good time for challenging tasks or social activities.");
  }
  
  if (healthData.sleep_hours && healthData.sleep_hours < 6) {
    recommendations.push("Sleep may be affecting your energy. Consider prioritizing rest tonight.");
  }
  
  if (healthData.stress_level && healthData.stress_level > 7) {
    recommendations.push("High stress detected. Consider some breathing exercises or a short walk.");
  }
  
  if (healthData.mood === 'rainy') {
    recommendations.push("Feeling cloudy? Sometimes that means it's time for cozy indoor activities.");
  }
  
  return recommendations.slice(0, 3); // Limit to 3 recommendations
}

export const config: Config = {
  path: "/api/health-data"
};