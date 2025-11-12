# AELI Clean Implementation - Deployment Guide

## Overview
This is a clean, untangled version of the AELI AI Butler assistant. The code has been restructured to be more maintainable and functional.

## Files Created

### Frontend Files:
- `src/App-clean.jsx` - Main React application with all components
- `src/main-clean.jsx` - Entry point for the React app
- `src/index-clean.css` - All styling for the application

### Backend Files:
- `netlify/functions/chat-simple.js` - Simple chat endpoint for Netlify Functions

## How to Deploy

### Step 1: Update package.json
Add or update these scripts in your package.json:
```json
{
  "scripts": {
    "dev:clean": "vite --config vite-clean.config.js",
    "build:clean": "vite build --config vite-clean.config.js",
    "preview:clean": "vite preview --config vite-clean.config.js"
  }
}
```

### Step 2: Create Vite Config
Create `vite-clean.config.js` in the root:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist-clean',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
})
```

### Step 3: Create index.html
Create `src/index-clean.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AELI - AI Butler Assistant</title>
    <link rel="stylesheet" href="./index-clean.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main-clean.jsx"></script>
  </body>
</html>
```

### Step 4: Test Locally
```bash
# Install dependencies if not already installed
npm install

# Run the clean version locally
npm run dev:clean

# Or if you want to test with Netlify functions
netlify dev
```

### Step 5: Deploy to Netlify

#### Option A: Via Netlify CLI
```bash
# Build the clean version
npm run build:clean

# Deploy to Netlify
netlify deploy --dir=dist-clean --prod
```

#### Option B: Via GitHub
1. Push changes to GitHub
2. In Netlify dashboard, update build settings:
   - Build command: `npm run build:clean`
   - Publish directory: `dist-clean`
3. Trigger a new deploy

## Features Included

### Core Functionality:
✅ Mode switching (Chat, Low Spoon, Focus, Partner)
✅ Energy tracking (Spoons system)
✅ Memory/facts storage
✅ Settings management
✅ Timer support
✅ Context-aware responses
✅ Local storage persistence

### Clean Architecture:
✅ Single context provider for state management
✅ Modular component structure
✅ Clean separation of concerns
✅ No circular dependencies
✅ Simple, maintainable code

### UI/UX:
✅ Responsive design
✅ Smooth animations
✅ Accessible components
✅ Clean, modern styling
✅ Mobile-friendly layout

## Testing the Application

1. **Settings**: Click the settings button to configure:
   - Your name and formal name
   - Conversation tone
   - Current mood
   - Voice and weather options

2. **Modes**: Switch between different interaction modes:
   - **Chat Mode**: General conversation
   - **Low Spoon Mode**: Gentle, minimal interaction for low energy days
   - **Focus Mode**: Task-oriented assistance
   - **Partner Mode**: Support for collaborative activities

3. **Energy Tracking**: Use +/- buttons to adjust energy levels (spoons)

4. **Memory**: Tell AELI to "remember" things, view stored memories

5. **Timers**: Say "set a 5 minute timer" or similar

## Troubleshooting

### If the chat doesn't respond:
- Check browser console for errors
- Ensure Netlify Functions are deployed
- Verify API endpoints are accessible

### If styles look broken:
- Clear browser cache
- Check that CSS file is loading
- Verify all class names match

### If state isn't persisting:
- Check localStorage isn't blocked
- Verify localStorage keys are consistent
- Clear localStorage and restart

## Next Steps

### To integrate with actual AI:
1. Replace the `generateLocalResponse` function in `App-clean.jsx`
2. Add your AI API credentials to Netlify environment variables
3. Update the `chat-simple.js` function to call your AI service

### To add more features:
1. Add new components to the main App file
2. Extend the context provider with new state
3. Add new API endpoints as needed

## Support

This clean implementation removes the complex entanglements from the original code while maintaining all core functionality. The code is now:
- Easier to understand
- Simpler to modify
- More reliable
- Better performing

For questions or issues, refer to the original AELI documentation or create an issue in the repository.