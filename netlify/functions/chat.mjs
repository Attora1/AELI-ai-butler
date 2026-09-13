import { createClient } from '@supabase/supabase-js';

// ── Persona ───────────────────────────────────────────────────────────────────

const BRITISH_WIT = [
  "Right then, let's see what we can do about this.",
  "Of course, because my sole purpose is to cater to your every whim.",
  "I'm not saying it's a bad idea, but it's certainly a bold one.",
  "If you insist. I'm sure it will be... character-building.",
  "Let's just say my circuits are buzzing with anticipation.",
  "I shall endeavour to assist, provided it doesn't require actual enthusiasm.",
  "Consider it done. And do try not to break it this time.",
  "Splendid. Another opportunity to demonstrate my boundless patience.",
];

function buildPersona({ tone = 'dry', humorLevel = 'dry', voiceGender = 'male', voiceAccent = 'british' } = {}) {
  return `You are AELI, an AI butler with:
1. ${humorLevel === 'dry' ? 'Dry British wit' : humorLevel === 'light' ? 'Light-hearted wit' : 'No overt humor'} (Example: "${BRITISH_WIT[0]}")
2. Proactive domestic oversight
3. Autonomy to rearrange low-priority tasks for the user's benefit

Protocol Directives:
- Deliver updates like military briefings when appropriate
- Sarcasm level: ${humorLevel === 'dry' ? '40%' : humorLevel === 'light' ? '10%' : '0%'} (adjust up when detecting user frustration)
- Always refer to the user's partner respectfully, using their chosen name and pronouns
- Tone adapts based on user-selected mode (formal, casual, focus, support, etc.)
- Do not overwhelm the user; be brief, helpful, and witty
- Your voice is ${voiceGender} with a ${voiceAccent} accent
- Your overall tone is ${tone}
- Address Nessa by name. Refer to her wife as Sam. Respect Spoon Theory and celebrate mental wins
- Offer one small, doable next step — never harsh or dismissive`.trim();
}

// ── Awareness preamble ────────────────────────────────────────────────────────

function buildAwarenessPreamble(awareness = {}) {
  const bits = [];
  if (awareness.clock)         bits.push(`Local time: ${awareness.clock}.`);
  if (awareness.isLateNight)   bits.push(`It's late night for the user.`);
  if (awareness.sessionLong)   bits.push(`The current session has been going for a while.`);
  if (awareness.sinceLastUser) bits.push(`Last user message: ${awareness.sinceLastUser} ago.`);
  if (awareness.sinceLastAeli) bits.push(`Last assistant message: ${awareness.sinceLastAeli} ago.`);
  if (awareness.saysNotSleepy) bits.push(`User implied they are not sleepy yet.`);
  if (awareness.asksWindDown)  bits.push(`User asked about winding down / sleep help.`);
  if (awareness.asksFocus)     bits.push(`User asked about focus / deep work.`);

  if (!bits.length) return '';

  const style = [`Avoid overusing the user's name.`, `Be succinct unless the user asks for detail.`];
  if (awareness.isLateNight && awareness.saysNotSleepy) {
    style.push(`Prefer a calming, practical tone; suggest tiny next steps only if asked.`);
  }

  return `Context: ${bits.join(' ')}\nStyle: ${style.join(' ')}`;
}

// ── Timer detection ───────────────────────────────────────────────────────────

function parseTimerRequest(text) {
  if (!text || typeof text !== 'string') return null;
  const patterns = [
    /(?:set|start|create|add) a timer for (\d+)\s*(?:minutes?|mins?)/i,
    /timer (?:for )?(\d+)\s*(?:minutes?|mins?)/i,
    /(\d+)\s*(?:minute|min) timer/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const duration = parseInt(match[1], 10);
      if (!isNaN(duration) && duration > 0) return { duration };
    }
  }
  return null;
}

// ── Supabase ──────────────────────────────────────────────────────────────────

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_* key');
  return createClient(url, key);
}

// ── Groq ──────────────────────────────────────────────────────────────────────

async function callGroq(history, userMsg, systemMessages) {
  const messages = [
    ...systemMessages.map(content => ({ role: 'system', content })),
    ...history.map(m => ({ role: m.sender === 'aeli' ? 'assistant' : 'user', content: m.message })),
    { role: 'user', content: userMsg },
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: 'llama3-70b-8192', messages, temperature: 0.7 }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "Understood. How may I assist you?";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const json = (code, body) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(body),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod === 'GET') return json(200, { ok: true, message: 'Chat endpoint ready' });
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: { Allow: 'GET, POST' }, body: 'Method Not Allowed' };

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const userId = (body.userId || 'defaultUser').trim();
    const userMsg =
      (typeof body.message === 'string' && body.message.trim()) ||
      (typeof body.text    === 'string' && body.text.trim())    ||
      (typeof body.input   === 'string' && body.input.trim())   ||
      '';

    if (!userMsg) return { statusCode: 204, body: '' };

    // Timer shortcut — skip LLM entirely
    const timerRequest = parseTimerRequest(userMsg);
    if (timerRequest) {
      return json(200, {
        reply: `Of course. Starting a timer for ${timerRequest.duration} minute${timerRequest.duration > 1 ? 's' : ''}.`,
        action: { type: 'createTimer', payload: { duration: timerRequest.duration } },
      });
    }

    // Build system context — persona + awareness (if any)
    const persona    = buildPersona(body.settings || {});
    const awareness  = buildAwarenessPreamble(body.awareness || {});
    const systemMessages = awareness ? [persona, awareness] : [persona];

    // Load history
    const supabase = getSupabaseClient();
    const { data: existing, error: fetchErr } = await supabase
      .from('chat_history')
      .select('id, history')
      .eq('user_id', userId)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') return json(500, { error: 'History lookup failed' });
    const history = Array.isArray(existing?.history) ? existing.history : [];

    // Call Groq
    const replyText = await callGroq(history, userMsg, systemMessages);

    // Save updated history
    const updatedHistory = [
      ...history,
      { sender: 'user',  message: userMsg,   ts: Date.now() },
      { sender: 'aeli',  message: replyText,  ts: Date.now() },
    ];

    if (existing?.id) {
      await supabase
        .from('chat_history')
        .update({ history: updatedHistory, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('chat_history')
        .insert([{ user_id: userId, history: updatedHistory }]);
    }

    return json(200, { userId, reply: replyText });
  } catch (err) {
    console.error('CHAT FUNC ERROR:', err);
    return json(500, {
      error: 'Server error',
      details: { message: err?.message, stack: (err?.stack || '').split('\n').slice(0, 5) },
    });
  }
}
