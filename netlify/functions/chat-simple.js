// Simplified chat function for AELI
export default async function handler(req, context) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { message, settings = {}, userId = 'default', mode = 'chat', spoons = 8 } = body;

    // Generate context-aware response
    const response = generateContextualResponse(message, mode, spoons, settings);

    return new Response(JSON.stringify({ 
      reply: response,
      success: true 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process message',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

function generateContextualResponse(message, mode, spoons, settings) {
  const lowerMessage = message.toLowerCase();
  const name = settings.nameFormal || settings.name || 'friend';
  
  // Timer-related responses
  if (lowerMessage.includes('timer')) {
    if (lowerMessage.includes('set') || lowerMessage.includes('start')) {
      const match = message.match(/(\d+)\s*(minute|min|m|second|sec|s)/i);
      if (match) {
        const amount = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const isMinutes = unit.startsWith('m');
        return `⏱️ Timer set for ${amount} ${isMinutes ? 'minute' : 'second'}${amount !== 1 ? 's' : ''}. I'll notify you when it's complete.`;
      }
      return "I'll need a specific duration. Try 'set a 5 minute timer' or 'set timer for 30 seconds'.";
    }
    if (lowerMessage.includes('cancel') || lowerMessage.includes('stop')) {
      return "Timer cancelled. All clear.";
    }
    if (lowerMessage.includes('time left') || lowerMessage.includes('remaining')) {
      return "Checking timer status... About 3 minutes remaining.";
    }
  }

  // Low energy responses
  if (spoons < 4) {
    const lowEnergyResponses = [
      `I see you're running low on energy, ${name}. Shall we keep this simple?`,
      "Low spoons noted. What's the absolute minimum we need to handle?",
      "Energy conservation mode. I'll keep my responses brief and focused.",
      "You're at low capacity. Rest is productive. What's essential right now?",
    ];
    return lowEnergyResponses[Math.floor(Math.random() * lowEnergyResponses.length)];
  }

  // Mode-specific responses
  const modeResponses = {
    lowSpoon: [
      "I understand. Let's keep things gentle and minimal.",
      "No pressure at all. What would feel manageable?",
      "Conserving energy mode. What's one small thing we can handle?",
      "Rest is valid work. How can I help without depleting you?",
    ],
    focus: [
      `Right then, ${name}. What's the priority task?`,
      "Focus mode engaged. Let's break this down into clear steps.",
      "Excellent. I'll help you maintain momentum. What's first?",
      "Distraction shields up. What needs your attention?",
    ],
    partner: [
      "How can I support both of you today?",
      "Partner support mode. What coordination would help?",
      "I'm here to help with the teamwork. What's needed?",
      "Let's make this work for everyone involved. What's the situation?",
    ],
    chat: [
      `Certainly, ${name}. How may I assist?`,
      "I'm here. What's on your mind?",
      "Of course. Tell me more.",
      "Happy to help. What do you need?",
    ],
  };

  // Check for specific intents
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Good day, ${name}. How are you managing today?`;
  }

  if (lowerMessage.includes('thank')) {
    return "You're quite welcome. Is there anything else you need?";
  }

  if (lowerMessage.includes('how are you')) {
    return "I'm functioning optimally and ready to assist. How are your energy levels today?";
  }

  if (lowerMessage.includes('remember')) {
    return "I've made a note of that. It's safely stored in my memory.";
  }

  if (lowerMessage.includes('help')) {
    return `I can help with timers, reminders, energy management, and general support. I adapt to your current mode (${mode}) and energy level. What do you need?`;
  }

  if (lowerMessage.includes('weather')) {
    return "The weather today is partly cloudy with a high of 72°F. Good conditions for a gentle walk if you have the spoons.";
  }

  if (lowerMessage.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything. *adjusts monocle*",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    return `I hear you, ${name}. Rest is not optional when you're running on empty. Would you like me to set a rest timer or shall we postpone non-essentials?`;
  }

  if (lowerMessage.includes('stressed') || lowerMessage.includes('anxious')) {
    return "That's valid and understandable. Would a breathing exercise help, or shall we tackle one small, concrete task to regain some control?";
  }

  if (lowerMessage.includes('good') && (lowerMessage.includes('morning') || lowerMessage.includes('evening') || lowerMessage.includes('night'))) {
    const timeOfDay = new Date().getHours();
    if (timeOfDay < 12) {
      return `Good morning, ${name}. How did you sleep? What's the plan for today?`;
    } else if (timeOfDay < 18) {
      return `Good afternoon, ${name}. How has your day been treating you?`;
    } else {
      return `Good evening, ${name}. Winding down for the day?`;
    }
  }

  // Default response based on current mode
  const responses = modeResponses[mode] || modeResponses.chat;
  return responses[Math.floor(Math.random() * responses.length)];
}

export const config = {
  path: "/api/chat"
};() * lowEnergyResponses.length)];
  }

  // Mode-specific responses
  const modeResponses = {
    lowSpoon: [
      "I'll keep this gentle and minimal. What do you need?",
      "No pressure at all. Take your time.",
      "Rest mode activated. I'm here when you need me.",
      `Easy does it, ${name}. What would help most?`,
    ],
    focus: [
      "Focus mode engaged. What's the priority task?",
      "Let's tackle this efficiently. What's first?",
      "I'll help you stay on track. What are we working on?",
      `Ready to concentrate, ${name}. What's the objective?`,
    ],
    partner: [
      "Partner support mode. How can I assist both of you?",
      "I'm here to help coordinate. What do you both need?",
      "Supporting team efforts. What's the shared goal?",
      "Ready to facilitate collaboration. What's the plan?",
    ],
    chat: [
      `How may I assist you today, ${name}?`,
      "I'm here to help. What's on your mind?",
      "At your service. What do you need?",
      `Certainly, ${name}. Tell me more.`,
    ],
  };

  // Check for specific intents
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Good day, ${name}. How may I be of service?`;
  }

  if (lowerMessage.includes('thank')) {
    return "You're quite welcome. Is there anything else you need?";
  }

  if (lowerMessage.includes('how are you')) {
    return "I'm functioning optimally and ready to assist. How are you feeling today?";
  }

  if (lowerMessage.includes('remember')) {
    return "I've made a note of that. It's been recorded in your memories.";
  }

  if (lowerMessage.includes('weather')) {
    return "The weather today is partly cloudy with a high of 72°F. Perfect for either indoor or outdoor activities, depending on your energy level.";
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `I can help you manage your energy levels, set timers, remember important information, and adapt my communication style to your current needs. I support different modes: Low Spoon for low energy days, Focus for productivity, Partner for coordination, and Chat for general assistance.`;
  }

  // Return a contextual response based on mode
  const responses = modeResponses[mode] || modeResponses.chat;
  return responses[Math.floor(Math.random() * responses.length)];
}

export { handler as default };
