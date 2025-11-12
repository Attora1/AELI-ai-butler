# 🔗 AELI Integrations Setup Guide

This guide will help you set up the Phase 1 integrations for AELI. Each integration enhances AELI's ability to help you manage your energy and tasks.

## 📋 Quick Setup Checklist

- [ ] Copy `.env.template` to `.env`
- [ ] Set up Google OAuth (Calendar + Drive)
- [ ] Get OpenWeatherMap API key
- [ ] Configure Notion integration (optional)
- [ ] Test integrations in AELI settings

## 🔑 Phase 1 Integrations

### 1. 📅 Google Calendar Integration

**What it does:** AELI can read your calendar, create events, and help you plan around your energy levels.

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google Calendar API
   - Google Drive API (for Drive integration)
4. Go to \"Credentials\" → \"Create Credentials\" → \"OAuth 2.0 Client ID\"
5. Set authorized redirect URIs:
   - `http://localhost:8888/api/google-calendar/callback` (for local dev)
   - `https://your-domain.netlify.app/api/google-calendar/callback` (for production)
6. Copy Client ID and Client Secret to your `.env` file

### 2. 📁 Google Drive Integration

**What it does:** Access your docs, sheets, and files. AELI can help you find documents and create new ones.

**Setup:** Same OAuth setup as Calendar (uses same credentials)

### 3. 🌤️ Weather Integration

**What it does:** Provides weather-aware suggestions and maps weather to your mood settings.

**Setup:**
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to \"API Keys\" in your dashboard
4. Copy your API key to `.env` as `OPENWEATHER_API_KEY`

### 4. 🗂️ Notion Memory Bank

**What it does:** Store AELI's long-term memories in a structured Notion database.

**Setup:**
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click \"New integration\"
3. Give it a name like \"AELI Memory Bank\"
4. Copy the \"Internal Integration Token\" to `.env`
5. Create a new page in Notion for AELI's memory bank
6. Share the page with your integration
7. Copy the page ID from the URL to `.env` as `NOTION_PARENT_PAGE_ID`

### 5. 💪 Health Data Integration

**What it does:** Track your spoon levels and energy patterns.

**Setup:** Currently works with AELI's built-in spoon tracking. Future versions will connect to Apple Health and Google Fit.

## 🧪 Testing Your Integrations

1. Start your development server: `npm run serve`
2. Open AELI in your browser
3. Go to Settings → Integrations
4. Try each Phase 1 integration:
   - **Google Calendar/Drive**: Should open OAuth window
   - **Weather**: Should show current weather for your ZIP code
   - **Notion**: Will show setup message (requires env vars)
   - **Health Data**: Should log a test entry

## 🔧 Environment Variables

Copy `.env.template` to `.env` and fill in your values:

```bash
# Required for Google integrations
GOOGLE_CLIENT_ID=\"your_google_client_id\"
GOOGLE_CLIENT_SECRET=\"your_google_client_secret\"

# Required for weather
OPENWEATHER_API_KEY=\"your_openweather_key\"

# Optional for Notion
NOTION_API_TOKEN=\"secret_your_notion_token\"
NOTION_PARENT_PAGE_ID=\"your_notion_page_id\"
```

## 🚀 Using the Integrations

### Calendar
- AELI can suggest optimal times for tasks based on your energy
- Create calendar events with spoon-aware scheduling
- Get daily schedule summaries

### Drive
- Find documents quickly: \"AELI, find my hackathon notes\"
- Create new docs for brainstorming
- Access recent files

### Weather
- Get weather-aware clothing suggestions
- Mood mapping based on weather patterns
- Energy level recommendations

### Notion Memory Bank
- Long-term fact storage
- Categorized memories (Personal, Work, Health, etc.)
- Searchable knowledge base

### Health Data
- Spoon level tracking and trends
- Energy forecasting
- Personalized recommendations

## 🔮 Coming in Phase 2

- 🎵 **Music Control** (Spotify, YouTube Music, Apple Music)
- 💬 **Team Communication** (Slack, Discord)
- 📧 **Email Integration** (Gmail)

## 🔮 Coming in Phase 3

- 🎨 **Creative Tools** (Figma, Canva)
- ⚡ **Development** (GitHub)
- 💰 **Payments** (Stripe)
- 🔗 **Automation** (Zapier)
- 🏠 **Smart Home** (Home Assistant)

## ❓ Troubleshooting

**OAuth not working?**
- Check your redirect URIs in Google Cloud Console
- Make sure APIs are enabled
- Verify environment variables are set

**Weather not loading?**
- Verify your OpenWeatherMap API key
- Check that your ZIP code is valid (US format: 12345)

**Notion setup issues?**
- Make sure you shared the page with your integration
- Verify the token starts with `secret_`
- Check the page ID in the URL

## 🆘 Need Help?

Check the browser console for error messages, and verify all environment variables are set correctly in your `.env` file."