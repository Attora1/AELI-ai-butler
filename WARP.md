# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AELI (Adaptive Energy & Life Interface) is an AI butler assistant built with React + Vite, designed to support neurodivergent and chronically ill individuals in managing daily life through adaptive modes, energy tracking ("spoons"), and integrations with external services.

## Development Commands

### Running the Application
- `npm start` or `npm run dev:clean` - Start development server (clean version on port 5173)
- `npm run dev` - Start development server (configured version)
- `npm run dev:original` - Start development server (original setup)
- `npm run serve` - Run with Netlify Dev (includes serverless functions on port 8888)

### Building
- `npm run build` - Build for production (configured version)
- `npm run build:clean` - Build clean version to `dist-clean/`
- `npm run build:original` - Build original version

### Code Quality
- `npm run lint` - Run ESLint on `src/**/*.js` and `src/**/*.jsx`
- `npm run preview` - Preview production build
- `npm run preview:clean` - Preview clean version build

**Note:** There are no automated tests configured in this project.

## Architecture

### Entry Points & Configurations

The project has **multiple configurations** running in parallel:
- **Clean version**: Uses `src/main-clean.jsx` → `src/App-clean.jsx` with `vite-clean.config.js`
- **Original version**: Uses `src/main.jsx` → `src/App.jsx` with standard Vite config
- Development typically uses the **clean version** (`npm start` → `dev:clean`)

### State Management

Global state is managed through **React Context** in `src/context/AppContext.jsx`:
- `settings` - User preferences (name, pronouns, tone, mood, theme, accessibility)
- `spoons` - Energy level (0-12, represents "spoon theory" for disability/chronic illness)
- `mode` - Current interaction mode (chat, lowSpoon, focus, partner)
- `facts` - Stored memories that AELI remembers
- `messages` - Chat history

**Storage**: All state persists to `localStorage` with keys:
- `AELI_SETTINGS`
- `AELI_FACTS`
- `AELI_CHAT_HISTORY`

### Component Structure

```
src/
├── App-clean.jsx          # Main clean implementation (all-in-one)
├── main-clean.jsx         # Entry point for clean version
├── components/
│   ├── Modes/             # Mode-specific UI components
│   │   ├── ChatMode.jsx
│   │   ├── LowSpoonMode.jsx
│   │   ├── FocusMode.jsx
│   │   ├── PartnerMode.jsx
│   │   └── [supporting components]
│   ├── Settings/          # Settings modal and related
│   ├── Chat/              # Chat interface components
│   ├── Header/            # Header components
│   └── [other UI components]
├── context/
│   ├── AppContext.jsx     # Global state provider
│   └── useApp.jsx         # Context hook
├── modes/                 # Mode logic (separate from UI)
├── utils/                 # Utility functions
└── styles/                # Additional styling
```

### Modes System

AELI has **4 primary interaction modes** that change both UI and conversational tone:
1. **Chat Mode** - Default conversational mode
2. **Low Spoon Mode** - Minimal, gentle interaction for low-energy days
3. **Focus Mode** - Task-oriented, structured assistance
4. **Partner Support Mode** - Co-regulation and collaborative support

Modes are controlled via `mode` state and accessed through mode-specific components in `src/components/Modes/`.

### Backend / Serverless Functions

Located in `netlify/functions/`:
- `chat-simple.js` - Simple chat endpoint
- `chat.cjs`, `chat.mjs` - Alternative chat implementations
- `google-calendar.mts` - Google Calendar integration
- `google-drive.mts` - Google Drive integration
- `weather-enhanced.mts` - Weather API integration
- `notion.mts` - Notion memory bank integration
- `health-data.mts` - Health data tracking
- Timer functions (`create-timer.js`, `cancel-timer.js`, etc.)

Functions are accessed via `/.netlify/functions/*` paths (proxied in development).

### Integration Setup

AELI integrates with external services. Required environment variables (copy from `.env.template` to `.env`):

```bash
# Google (Calendar, Drive)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# Weather
OPENWEATHER_API_KEY

# Notion (optional memory storage)
NOTION_API_TOKEN
NOTION_PARENT_PAGE_ID

# Supabase (optional)
SUPABASE_URL
SUPABASE_ANON_KEY
```

See `INTEGRATIONS.md` for detailed setup instructions.

## Working with the Codebase

### Important Patterns

1. **Spoon Theory**: The "spoons" system represents energy levels in disability/chronic illness communities. Respect this metaphor throughout the UI.

2. **Persona & Tone**: AELI has a "dry British butler" personality. Responses should be:
   - Warm but direct
   - Gentle and supportive
   - Respectful of low energy
   - Occasionally witty (British humor level configurable)

3. **Accessibility First**: The app supports:
   - Reduced motion (`settings.reduceMotion`)
   - High contrast mode (`settings.highContrast`)
   - Font size adjustment (`settings.fontSize`)
   - Custom font families
   
   Always test that new UI respects these settings.

4. **Message Key Management**: There was a historical issue with duplicate React keys in message lists. The context includes `fixDuplicateKeys()` to handle this. All new messages must have unique IDs.

## Deployment

### Netlify Configuration

The app deploys to Netlify with:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Redirects configured in `netlify.toml`:
- `/api/*` → Netlify Functions
- `/*` → SPA fallback to `index.html`

### Local Development with Functions

Use `npm run serve` to run Netlify Dev, which:
- Starts Vite dev server on port 5173
- Runs Netlify Functions on port 8888
- Proxies function calls appropriately

## Common Tasks

### Adding a New Mode
1. Create mode component in `src/components/Modes/[ModeName].jsx`
2. Create mode logic in `src/modes/[ModeName]Mode.jsx`
3. Add mode to settings/mode selector
4. Update context if mode needs special state
5. Add mode-specific styling in CSS

### Adding a New Integration
1. Create serverless function in `netlify/functions/[service].mts`
2. Add environment variables to `.env.template`
3. Update `INTEGRATIONS.md` with setup instructions
4. Add UI controls in Settings modal
5. Test with `npm run serve`

### Modifying Spoon Display
The leaf-based energy display is in `App-clean.jsx` as `LeafEnergyDisplay` component. It:
- Shows 12 leaves (🍃) representing max spoons
- Uses color gradients based on energy level
- Includes +/- buttons for adjustment
- Syncs with context via `useApp()`

### Working with Messages
Messages stored in context must have:
- `id` - Unique identifier
- `text` - Message content
- `isUser` - Boolean for user vs AI
- Optional: `timestamp`, `mode`, other metadata

Always use `setMessages()` from context to update chat history.
