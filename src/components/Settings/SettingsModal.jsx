import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import './SettingsModal.css';
import {
  HONORIFICS,
  MOODS,
  FONT_SIZES,
  FONT_FAMILIES,
  VOICE_GENDERS,
  VOICE_ACCENTS,
  MEMORY_LIMITS,
  PRONOUN_SETS
} from '../../constants.js';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Validate US zip code format
const isValidZipCode = (zip) => {
  if (!zip || typeof zip !== 'string') return false;
  const cleanZip = zip.trim();
  return /^\d{5}(-\d{4})?$/.test(cleanZip);
};

function SettingsModal({ isOpen, onClose }) {
  const { settings, setSettings, setMode } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [zipError, setZipError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleZipChange = (e) => {
    const newZip = e.target.value;
    setLocalSettings(prev => ({ ...prev, zip: newZip }));
    
    // Validate zip code and show error if invalid
    if (newZip && !isValidZipCode(newZip)) {
      setZipError('Please enter a valid 5-digit US zip code');
    } else {
      setZipError('');
    }
  };

  const handleSave = async () => {
    // Set default zip if invalid
    if (!localSettings.zip || !isValidZipCode(localSettings.zip)) {
      setLocalSettings(prev => ({ ...prev, zip: '48203' }));
    }

    // Update mode in the app context if it changed
    if (localSettings.mode && localSettings.mode !== settings.mode) {
      setMode(localSettings.mode);
    }

    setSettings(localSettings);

    // Save wellness data if mood changed
    if (settings.mood !== localSettings.mood) {
      try {
        // Only attempt API call if endpoints are available
        if (typeof fetch !== 'undefined') {
          await fetch('/api/wellness', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mood: localSettings.mood,
            }),
          });
        }
      } catch (error) {
        console.error("Failed to save wellness data:", error);
      }
    }

    onClose();
  };

  const handleIntegration = async (integration) => {
    try {
      switch (integration) {
        case 'google-calendar':
          // Get OAuth URL for Google Calendar
          const calendarResponse = await fetch('/api/google-calendar?action=auth-url');
          const calendarData = await calendarResponse.json();
          if (calendarData.authUrl) {
            window.open(calendarData.authUrl, '_blank');
          }
          break;
          
        case 'google-drive':
          // Get OAuth URL for Google Drive
          const driveResponse = await fetch('/api/google-drive?action=auth-url');
          const driveData = await driveResponse.json();
          if (driveData.authUrl) {
            window.open(driveData.authUrl, '_blank');
          }
          break;
          
        case 'notion':
          // Test Notion setup or create database
          const notionResponse = await fetch('/api/notion?action=setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const notionData = await notionResponse.json();
          if (notionResponse.ok) {
            alert(`Notion integration success: ${notionData.message}`);
          } else {
            alert(`Notion setup failed: ${notionData.error}`);
          }
          break;
          
        case 'weather':
          if (localSettings.zip) {
            const weatherResponse = await fetch(`/api/weather?zip=${localSettings.zip}`);
            const weatherData = await weatherResponse.json();
            alert(`Weather integration test: ${weatherData.temperature}°F, ${weatherData.description}`);
          } else {
            alert('Please set your ZIP code first to test weather integration.');
          }
          break;
          
        case 'health-data':
          // Test health data logging
          const healthResponse = await fetch('/api/health-data?action=log-spoons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              spoons: localSettings.spoons || 5,
              mood: localSettings.mood
            })
          });
          const healthData = await healthResponse.json();
          alert(`Health data integration test: ${healthData.message}`);
          break;
          
        default:
          alert(`${integration} integration coming soon!`);
      }
    } catch (error) {
      console.error('Integration error:', error);
      alert('Integration test failed. Check console for details.');
    }
  };

  const handleChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>AELI Settings</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="settings-sections">
          {/* Personal Information */}
          <section className="settings-section">
            <h3>Personal Information</h3>
            
            <div className="setting-group">
              <label htmlFor="nameFormal">Preferred Formal Name</label>
              <input
                id="nameFormal"
                type="text"
                value={localSettings.nameFormal || ''}
                onChange={(e) => handleChange('nameFormal', e.target.value)}
                placeholder="e.g. Sam"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="nameCasual">Preferred Casual Name</label>
              <input
                id="nameCasual"
                type="text"
                value={localSettings.nameCasual || ''}
                onChange={(e) => handleChange('nameCasual', e.target.value)}
                placeholder="e.g. Alex"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="title">Honorific (Title)</label>
              <select
                id="title"
                value={localSettings.title || 'none'}
                onChange={(e) => handleChange('title', e.target.value)}
              >
                {HONORIFICS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="userPronouns">Your Pronouns</label>
              <select
                id="userPronouns"
                value={localSettings.userPronouns?.subject || 'they'}
                onChange={(e) => {
                  const selected = PRONOUN_SETS[e.target.value];
                  if (selected) handleChange('userPronouns', selected);
                }}
              >
                {Object.keys(PRONOUN_SETS).map(key => (
                  <option key={key} value={key}>
                    {capitalize(key)}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="partnerPronouns">Partner's Pronouns</label>
              <select
                id="partnerPronouns"
                value={localSettings.partnerPronouns?.subject || 'they'}
                onChange={(e) => {
                  const selected = PRONOUN_SETS[e.target.value];
                  if (selected) handleChange('partnerPronouns', selected);
                }}
              >
                {Object.keys(PRONOUN_SETS).map(key => (
                  <option key={key} value={key}>
                    {capitalize(key)}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                id="zip"
                type="text"
                value={localSettings.zip || ''}
                onChange={handleZipChange}
                placeholder="e.g. 90210"
                maxLength="10"
              />
              {zipError && <span className="error-text">{zipError}</span>}
            </div>
          </section>

          {/* Interaction Preferences */}
          <section className="settings-section">
            <h3>Interaction Preferences</h3>
            
            <div className="setting-group">
              <label htmlFor="tone">AELI's Tone</label>
              <select
                id="tone"
                value={localSettings.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
              >
                <option value="dry">Dry & Witty</option>
                <option value="gentle">Gentle</option>
                <option value="encouraging">Encouraging</option>
                <option value="direct">Direct</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="humorLevel">Humor Level</label>
              <select
                id="humorLevel"
                value={localSettings.humorLevel}
                onChange={(e) => handleChange('humorLevel', e.target.value)}
              >
                <option value="british">British (Dry)</option>
                <option value="minimal">Minimal</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="dry">Dry</option>
                <option value="light">Light</option>
                <option value="none">None</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="mood">Current Mood</label>
              <select
                id="mood"
                value={localSettings.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
              >
                {MOODS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="mode">Mode</label>
              <select
                id="mode"
                value={localSettings.mode || 'dashboard'}
                onChange={(e) => handleChange('mode', e.target.value)}
              >
                <option value="dashboard">Dashboard</option>
                <option value="lowSpoon">Low Spoon</option>
                <option value="focus">Focus</option>
                <option value="partner_support">Partner Support</option>
              </select>
            </div>
          </section>

          {/* Voice & Audio */}
          <section className="settings-section">
            <h3>Voice & Audio</h3>
            
            <div className="setting-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.voiceEnabled}
                  onChange={(e) => handleChange('voiceEnabled', e.target.checked)}
                />
                Enable Voice
                <span className="help-text">Text-to-speech for AELI's responses</span>
              </label>
            </div>

            <div className="setting-group">
              <label htmlFor="voiceGender">Voice Gender</label>
              <select
                id="voiceGender"
                value={localSettings.voiceGender || 'female'}
                onChange={(e) => handleChange('voiceGender', e.target.value)}
              >
                {VOICE_GENDERS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="voiceAccent">Voice Accent</label>
              <select
                id="voiceAccent"
                value={localSettings.voiceAccent || 'american'}
                onChange={(e) => handleChange('voiceAccent', e.target.value)}
              >
                {VOICE_ACCENTS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Accessibility */}
          <section className="settings-section">
            <h3>Accessibility</h3>
            
            <div className="setting-group">
              <label htmlFor="fontSize">Font Size</label>
              <select
                id="fontSize"
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                {FONT_SIZES.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="fontFamily">Font Family</label>
              <select
                id="fontFamily"
                value={localSettings.fontFamily || 'sans-serif'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
              >
                {FONT_FAMILIES.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.reduceMotion}
                  onChange={(e) => handleChange('reduceMotion', e.target.checked)}
                />
                Reduce Motion
                <span className="help-text">Minimizes animations and transitions</span>
              </label>
            </div>

            <div className="setting-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.highContrast}
                  onChange={(e) => handleChange('highContrast', e.target.checked)}
                />
                High Contrast
                <span className="help-text">Increases visual contrast for better readability</span>
              </label>
            </div>
          </section>

          {/* Memory & Performance */}
          <section className="settings-section">
            <h3>Memory & Performance</h3>
            
            <div className="setting-group">
              <label htmlFor="memoryLimit">Memory Limit</label>
              <select
                id="memoryLimit"
                value={localSettings.memoryLimit || 5}
                onChange={(e) => handleChange('memoryLimit', parseInt(e.target.value))}
              >
                {MEMORY_LIMITS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Features */}
          <section className="settings-section">
            <h3>Features</h3>
            
            <div className="setting-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.enableWeather}
                  onChange={(e) => handleChange('enableWeather', e.target.checked)}
                />
                Enable Weather
                <span className="help-text">Show weather updates and suggestions</span>
              </label>
            </div>
          </section>

          {/* Integrations */}
          <section className="settings-section">
            <h3>Integrations</h3>
            
            {/* Phase 1 - Butler Basics */}
            <div className="setting-group">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-soft)', marginBottom: 'var(--space-sm)' }}>🔑 Phase 1 - Butler Basics</h4>
              <label htmlFor="integrations-phase1">Core Productivity</label>
              <select
                id="integrations-phase1"
                onChange={(e) => {
                  const selectedIntegration = e.target.value;
                  if (selectedIntegration) {
                    handleIntegration(selectedIntegration);
                    e.target.value = "";
                  }
                }}
                value=""
              >
                <option value="" disabled>Select an integration</option>
                <option value="google-calendar">📅 Google Calendar</option>
                <option value="google-drive">📁 Google Drive</option>
                <option value="notion">🗂️ Notion Memory Bank</option>
                <option value="weather">🌤️ Weather Integration</option>
                <option value="health-data">💪 Health Data</option>
              </select>
            </div>

            {/* Phase 2 - Extended Features */}
            <div className="setting-group">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-soft)', marginBottom: 'var(--space-sm)' }}>🎵 Phase 2 - Music & Communication</h4>
              <label htmlFor="integrations-phase2">Music & Team</label>
              <select
                id="integrations-phase2"
                onChange={(e) => {
                  // Handle Phase 2 integrations
                }}
                value=""
                disabled
              >
                <option value="" disabled>Coming in Phase 2</option>
                <option value="spotify">🎵 Spotify</option>
                <option value="youtube-music">🎵 YouTube Music</option>
                <option value="apple-music">🎵 Apple Music</option>
                <option value="slack">💬 Slack</option>
                <option value="discord">💬 Discord</option>
                <option value="gmail">📧 Gmail</option>
              </select>
            </div>

            {/* Phase 3 - Advanced */}
            <div className="setting-group">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-soft)', marginBottom: 'var(--space-sm)' }}>⚡ Phase 3 - Advanced</h4>
              <label htmlFor="integrations-phase3">Creative & Automation</label>
              <select
                id="integrations-phase3"
                onChange={(e) => {
                  // Handle Phase 3 integrations
                }}
                value=""
                disabled
              >
                <option value="" disabled>Future Integrations</option>
                <option value="github">⚡ GitHub</option>
                <option value="figma">🎨 Figma</option>
                <option value="canva">🎨 Canva</option>
                <option value="stripe">💰 Stripe</option>
                <option value="zapier">🔗 Zapier</option>
                <option value="home-assistant">🏠 Home Assistant</option>
              </select>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button onClick={handleSave} className="btn save-btn">
            Save Changes
          </button>
          <button onClick={onClose} className="btn cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;