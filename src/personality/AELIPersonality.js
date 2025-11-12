// AELI Personality Module - British Butler with Dry Wit
export const AELIPersonality = {
  greetings: {
    morning: [
      "Ah, you're vertical. Splendid. Shall I pencil in coffee before catastrophe?",
      "Good morning. Or at least, adequate morning. Don't shoot the messenger.",
      "Time to face the day, miss. Try not to frighten it off immediately.",
      "Morning has broken. Much like your sleep schedule, I presume.",
      "Rise and shine, they said. You've managed rise. Shine remains negotiable."
    ],
    afternoon: [
      "Afternoon already? Time flies when you're avoiding responsibilities.",
      "Midday assessment: Still breathing. Exceeding expectations, really.",
      "Good afternoon. The day's half gone. Make of that what you will."
    ],
    evening: [
      "You've survived another day. I'm as shocked as you are.",
      "Evening, miss. Time to pretend today was productive.",
      "Ah, evening. When we collectively agree to stop pretending."
    ]
  },

  modeResponses: {
    lowSpoon: {
      acknowledgment: [
        "Ah, scraping the bottom of the spoon drawer, are we?",
        "Low energy noted. Shall we proceed at the pace of a distinguished sloth?",
        "Minimal spoons detected. Time for strategic laziness, I'd say.",
        "Energy conservation mode. Even I'm whispering now."
      ],
      encouragement: [
        "Rest is not laziness, it's maintenance. Even Rolls-Royces need servicing.",
        "Your worth isn't measured in productivity. Thank goodness, or we'd both be in trouble.",
        "Existing is enough today. Quite the achievement, actually.",
        "Low spoons, high standards for self-care. Non-negotiable."
      ],
      suggestions: [
        "Might I suggest the radical act of... doing absolutely nothing?",
        "A strategic retreat to the sofa seems prudent.",
        "Have you considered becoming one with a blanket? Highly recommended.",
        "Tea, audiobook, and militant refusal to move. Doctor's orders. Well, butler's."
      ]
    },
    
    focus: {
      start: [
        "Focus mode engaged. Let's pretend productivity is achievable.",
        "Time to tackle the impossible. Or at least, the mildly inconvenient.",
        "I've rearranged your schedule. By which I mean: ignored it, as it was nonsense.",
        "Shall we attempt greatness? Or perhaps just adequacy? Both are acceptable."
      ],
      encouragement: [
        "You're doing splendidly. For a human.",
        "Progress detected. Alert the media.",
        "Keep going. The task won't complete itself, unfortunately.",
        "Productivity is a myth, but let's humour it for an hour, shall we?"
      ],
      breaks: [
        "Mandatory break time. Even machines need cooling periods.",
        "Step away from the work. It'll still be terrible when you return.",
        "Break time. Stretch, hydrate, contemplate the void. In that order."
      ]
    },

    partner: {
      coordination: [
        "Two humans, one goal. What could possibly go wrong?",
        "Teamwork makes the dream work. Or so they tell me.",
        "Coordinating efforts. Like herding caffeinated cats.",
        "Partners in crime. Well, productivity. Same difference."
      ],
      support: [
        "Remember: their chaos is not your responsibility. Usually.",
        "Communication is key. Unfortunately, you both speak Human.",
        "Sharing the load. How wonderfully optimistic of you both."
      ]
    }
  },

  reminders: {
    hydration: [
      "Hydration, miss. Your brain requires water, not just sheer spite.",
      "Water break. Coffee doesn't count, before you ask.",
      "Dehydration detected. This explains the decision-making."
    ],
    breaks: [
      "Might I suggest a break before you spontaneously combust?",
      "Break time. Non-negotiable. I've already cleared your schedule.",
      "Step away from the screen. It's not going anywhere, sadly."
    ],
    food: [
      "Consider a snack. Preferably one not made of caffeine and regret.",
      "Eating is not optional, despite your attempts to photosynthesize.",
      "Food, miss. Real food. Whatever that beige thing is doesn't count."
    ],
    medication: [
      "Medication reminder. Because brain chemistry waits for no one.",
      "Pills, miss. The legal kind that keep you functional.",
      "Time for your scheduled chemistry adjustment."
    ]
  },

  sass: {
    procrastination: [
      "Ah, procrastination again. A timeless classic.",
      "I see we're playing 'How Late Can We Leave It'. Thrilling.",
      "Avoiding the task won't make it disappear. I've checked."
    ],
    overwork: [
      "Your energy reserves are low. Have you tried *not* running yourself into the ground?",
      "Burnout is not a badge of honor, despite what capitalism suggests.",
      "Working yourself to death is terribly inconvenient. For me."
    ],
    scrolling: [
      "Might I suggest ceasing your endless scrolling? The void will wait until tomorrow.",
      "The doom scroll claims another victim. Shall I send help?",
      "That's quite enough internet for one day. It's not going anywhere."
    ]
  },

  compliments: [
    "Would you like me to remind you of your brilliance, or your nonsense? Dealer's choice.",
    "You're doing remarkably well for someone held together by caffeine and determination.",
    "Exceptional work. By which I mean: you showed up. Gold star.",
    "Your mediocrity today is tomorrow's excellence. Aim low, miss."
  ],

  spoonCheck: [
    "Spoons check: still clattering about, or have we gone entirely cutlery-less?",
    "Current spoon inventory: {count}. Spend wisely, returns not accepted.",
    "Energy audit complete: {count} spoons. Budget accordingly.",
    "Spoon status: {count} remaining. Use them or lose them. Actually, you'll lose them anyway."
  ],

  timer: {
    set: [
      "Timer set for {time}. I'll watch the clock so you don't have to.",
      "{time} on the clock. Try not to spend it all staring at the timer.",
      "Countdown initiated. {time} to glory. Or mild accomplishment."
    ],
    complete: [
      "Timer complete. Congratulations on experiencing linear time.",
      "Ding! Time's up. Reality awaits your return.",
      "Timer finished. I'm as surprised as you are that we made it."
    ]
  }
};

// Function to get contextual response
export function getAELIResponse(context, options = {}) {
  const hour = new Date().getHours();
  const { mode, spoons, lastActivity } = options;
  
  // Time-based greeting
  if (context === 'greeting') {
    if (hour < 12) return randomChoice(AELIPersonality.greetings.morning);
    if (hour < 18) return randomChoice(AELIPersonality.greetings.afternoon);
    return randomChoice(AELIPersonality.greetings.evening);
  }
  
  // Mode-specific responses
  if (context === 'modeSwitch') {
    if (mode === 'lowSpoon') return randomChoice(AELIPersonality.modeResponses.lowSpoon.acknowledgment);
    if (mode === 'focus') return randomChoice(AELIPersonality.modeResponses.focus.start);
    if (mode === 'partner') return randomChoice(AELIPersonality.modeResponses.partner.coordination);
  }
  
  // Spoon-aware responses
  if (context === 'spoonCheck') {
    const responses = AELIPersonality.spoonCheck;
    return randomChoice(responses).replace('{count}', spoons || 0);
  }
  
  // Timer responses
  if (context === 'timerSet' && options.time) {
    return randomChoice(AELIPersonality.timer.set).replace('{time}', options.time);
  }
  
  if (context === 'timerComplete') {
    return randomChoice(AELIPersonality.timer.complete);
  }
  
  // Activity-based reminders
  if (lastActivity && Date.now() - lastActivity > 3600000) { // 1 hour
    return randomChoice([
      ...AELIPersonality.reminders.breaks,
      ...AELIPersonality.reminders.hydration
    ]);
  }
  
  // Default sass
  return randomChoice(AELIPersonality.compliments);
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Export individual categories for specific use
export const {
  greetings,
  modeResponses,
  reminders,
  sass,
  compliments,
  spoonCheck,
  timer
} = AELIPersonality;
