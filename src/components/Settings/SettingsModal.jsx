import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import './SettingsModal.css';
import { HONORIFICS, MOODS, FONT_SIZES, FONT_FAMILIES, VOICE_GENDERS, VOICE_ACCENTS, MEMORY_LIMITS, PRONOUN_SETS } from '../../constants.js';

const PRONOUN_LABELS = {
  they: 'They / Them',
  she:  'She / Her',
  he:   'He / Him',
  it:   'It / It',
};

const TABS = [
  { id: 'profile',    icon: '⌾', label: 'profile'    },
  { id: 'appearance', icon: '✦', label: 'appearance' },
  { id: 'memory',     icon: '∞', label: 'memory'     },
  { id: 'energy',     icon: '⌁', label: 'energy'     },
  { id: 'modes',      icon: '⌘', label: 'modes',      iconSmall: true },
  { id: 'about',      icon: 'ⓘ', label: 'about',      iconSmall: true },
];

const isValidZip = (z) => /^\d{5}(-\d{4})?$/.test((z || '').trim());

// ── Tab content components ──────────────────────────────────────────────────

function ProfileTab({ local, onChange }) {
  return (
    <>
      <div className="sm-section-title">personal information</div>

      <div className="sm-field">
        <label className="sm-label">preferred formal name</label>
        <input className="sm-input" type="text"
          value={local.nameFormal || ''}
          onChange={e => onChange('nameFormal', e.target.value)}
          placeholder="e.g. Miss" />
      </div>

      <div className="sm-field">
        <label className="sm-label">preferred casual name</label>
        <input className="sm-input" type="text"
          value={local.nameCasual || ''}
          onChange={e => onChange('nameCasual', e.target.value)}
          placeholder="e.g. Nessa" />
      </div>

      <div className="sm-field">
        <label className="sm-label">honorific</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.title || 'none'}
            onChange={e => onChange('title', e.target.value)}>
            {HONORIFICS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sm-field">
        <label className="sm-label">pronouns</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.userPronouns?.subject || 'they'}
            onChange={e => {
              const s = PRONOUN_SETS[e.target.value];
              if (s) onChange('userPronouns', s);
            }}>
            {Object.keys(PRONOUN_SETS).map(k => (
              <option key={k} value={k}>{PRONOUN_LABELS[k] || k}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm-field">
        <label className="sm-label">partner's pronouns</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.partnerPronouns?.subject || 'they'}
            onChange={e => {
              const s = PRONOUN_SETS[e.target.value];
              if (s) onChange('partnerPronouns', s);
            }}>
            {Object.keys(PRONOUN_SETS).map(k => (
              <option key={k} value={k}>{PRONOUN_LABELS[k] || k}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

function AppearanceTab({ local, onChange }) {
  return (
    <>
      <div className="sm-section-title">display &amp; interaction</div>

      <div className="sm-field">
        <label className="sm-label">aeli's tone</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.tone || 'formal'}
            onChange={e => onChange('tone', e.target.value)}>
            <option value="dry">dry &amp; witty</option>
            <option value="gentle">gentle</option>
            <option value="encouraging">encouraging</option>
            <option value="direct">direct</option>
            <option value="formal">formal</option>
            <option value="casual">casual</option>
          </select>
        </div>
      </div>

      <div className="sm-field">
        <label className="sm-label">font size</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.fontSize || 16}
            onChange={e => onChange('fontSize', e.target.value)}>
            {FONT_SIZES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sm-field">
        <label className="sm-label">font family</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.fontFamily || 'sans-serif'}
            onChange={e => onChange('fontFamily', e.target.value)}>
            {FONT_FAMILIES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sm-field-check">
        <input type="checkbox" id="reduceMotion"
          checked={!!local.reduceMotion}
          onChange={e => onChange('reduceMotion', e.target.checked)} />
        <label htmlFor="reduceMotion">reduce motion</label>
      </div>

      <div className="sm-field-check">
        <input type="checkbox" id="highContrast"
          checked={!!local.highContrast}
          onChange={e => onChange('highContrast', e.target.checked)} />
        <label htmlFor="highContrast">high contrast</label>
      </div>
    </>
  );
}

function MemoryTab({ local, onChange }) {
  return (
    <>
      <div className="sm-section-title">memory &amp; context</div>

      <div className="sm-field">
        <label className="sm-label">memory limit</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.memoryLimit || 5}
            onChange={e => onChange('memoryLimit', parseInt(e.target.value))}>
            {MEMORY_LIMITS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sm-stub">
        <span className="sm-stub-icon">⬡</span>
        <span className="sm-stub-text">memory browser<br />coming soon</span>
      </div>
    </>
  );
}

function EnergyTab({ local, onChange }) {
  return (
    <>
      <div className="sm-section-title">energy &amp; wellness</div>
      <div className="sm-field">
        <label className="sm-label">current mood</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.mood || 'neutral'}
            onChange={e => onChange('mood', e.target.value)}>
            {MOODS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sm-field-check">
        <input type="checkbox" id="enableWeather"
          checked={!!local.enableWeather}
          onChange={e => onChange('enableWeather', e.target.checked)} />
        <label htmlFor="enableWeather">enable weather</label>
      </div>

      <div className="sm-field">
        <label className="sm-label">zip code</label>
        <input className="sm-input" type="text"
          value={local.zip || ''}
          onChange={e => onChange('zip', e.target.value)}
          placeholder="e.g. 48203"
          maxLength="10" />
      </div>

      <div className="sm-stub" style={{ marginTop: '16px' }}>
        <span className="sm-stub-icon">⚡</span>
        <span className="sm-stub-text">spoon tracking history<br />coming soon</span>
      </div>
    </>
  );
}

function ModesTab({ local, onChange }) {
  return (
    <>
      <div className="sm-section-title">voice &amp; modes</div>

      <div className="sm-field-check">
        <input type="checkbox" id="voiceEnabled"
          checked={!!local.voiceEnabled}
          onChange={e => onChange('voiceEnabled', e.target.checked)} />
        <label htmlFor="voiceEnabled">enable voice</label>
      </div>

      <div className="sm-field">
        <label className="sm-label">voice gender</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.voiceGender || 'female'}
            onChange={e => onChange('voiceGender', e.target.value)}>
            {VOICE_GENDERS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="sm-field">
        <label className="sm-label">voice accent</label>
        <div className="sm-select-wrap">
          <select className="sm-select"
            value={local.voiceAccent || 'american'}
            onChange={e => onChange('voiceAccent', e.target.value)}>
            {VOICE_ACCENTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
    </>
  );
}

function AboutTab() {
  return (
    <>
      <div className="sm-section-title">AELI - Steady in the shift.</div>
      <div style={{ fontSize: '0.875rem', color: 'rgba(26,56,53,0.75)', lineHeight: 1.7 }}>
        <p style={{ marginBottom: '14px' }}>
          AELI is a personal companion designed to meet you where you are — not where you're supposed to be.
        </p>
        <p style={{ marginBottom: '14px' }}>
          They learn how you think, how your energy shifts, and what kind of support is useful. That can change day to day. AELI changes with it.
        </p>
        <p style={{ opacity: 0.55, fontSize: '0.75rem', marginTop: '20px' }}>v0.1 — early access</p>
      </div>
    </>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function SettingsModal({ isOpen, onClose }) {
  const { settings, setSettings, setMode } = useApp();
  const [local, setLocal] = useState(settings);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isOpen) {
      setLocal(settings);
      setActiveTab('profile');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const onChange = (field, value) => setLocal(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (local.zip && !isValidZip(local.zip)) {
      onChange('zip', '48203');
    }
    if (local.mode && local.mode !== settings.mode) {
      setMode(local.mode);
    }
    setSettings(local);

    if (settings.mood !== local.mood) {
      try {
        await fetch('/api/wellness', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood: local.mood }),
        });
      } catch { /* offline — no-op */ }
    }
    onClose();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':    return <ProfileTab    local={local} onChange={onChange} />;
      case 'appearance': return <AppearanceTab local={local} onChange={onChange} />;
      case 'memory':     return <MemoryTab     local={local} onChange={onChange} />;
      case 'energy':     return <EnergyTab     local={local} onChange={onChange} />;
      case 'modes':      return <ModesTab      local={local} onChange={onChange} />;
      case 'about':      return <AboutTab />;
      default:           return null;
    }
  };

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={e => e.stopPropagation()}>

        <div className="sm-header">
          <span className="sm-header-title">settings</span>
          <button className="sm-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="sm-body">
          <nav className="sm-nav">
            {TABS.map(tab => (
              <button key={tab.id}
                className={`sm-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                <span className={`sm-nav-icon${tab.iconSmall ? ' sm-nav-icon-sm' : ''}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="sm-content">
            {renderContent()}
          </div>
        </div>

        <div className="sm-footer">
          <button className="sm-btn sm-btn-cancel" onClick={onClose}>cancel</button>
          <button className="sm-btn sm-btn-save"   onClick={handleSave}>save changes</button>
        </div>

      </div>
    </div>
  );
}
