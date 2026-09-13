import React, { useState, useEffect, useRef, useCallback } from 'react';
import GhostWriter from './GhostWriter';
import BlinkingCursor from './BlinkingCursor';
import { saveAeliConfig, DEFAULT_CONFIG } from '../../utils/aeliConfig';
import './OnboardingScreen.css';

const QUESTIONS = [
  { key: 'preferredName', text: "What's your preferred name?" },
  { key: 'pronouns',      text: "What are your pronouns?" },
  { key: 'age',           text: "How old are you?" },
  { key: 'zip',           text: "What's your zip code?" },
];

function getAck(key, value) {
  if (key === 'preferredName') return `Nice to meet you, ${value}!`;
  if (key === 'pronouns')      return 'Got it.';
  if (key === 'age')           return 'Noted.';
  return 'Perfect.';
}

export default function OnboardingScreen({ onComplete }) {
  const [phase, setPhase] = useState('greeting');
  const [mainText, setMainText] = useState("Hello, I'm Aeli.");
  const [eraseText, setEraseText] = useState('');
  const [isErasing, setIsErasing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [answers, setAnswers] = useState({ ...DEFAULT_CONFIG });
  const [showCursor, setShowCursor] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [unblurred, setUnblurred] = useState(false);
  const [showGoldLine, setShowGoldLine] = useState(false);
  const [svgCoords, setSvgCoords] = useState(null);
  const [showCustomPanel, setShowCustomPanel] = useState(false);

  const nudgeTextRef = useRef(null);
  const eraseDelayRef = useRef(null);
  const eraseIntervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  const clearErase = useCallback(() => {
    if (eraseDelayRef.current)    { clearTimeout(eraseDelayRef.current);  eraseDelayRef.current = null; }
    if (eraseIntervalRef.current) { clearInterval(eraseIntervalRef.current); eraseIntervalRef.current = null; }
  }, []);

  useEffect(() => () => clearErase(), [clearErase]);

  const startErase = useCallback((text, speed, onDone) => {
    clearErase();
    let remaining = text;
    setEraseText(remaining);
    setIsErasing(true);

    eraseDelayRef.current = setTimeout(() => {
      eraseDelayRef.current = null;
      eraseIntervalRef.current = setInterval(() => {
        remaining = remaining.slice(0, -1);
        setEraseText(remaining);
        if (remaining.length === 0) {
          clearInterval(eraseIntervalRef.current);
          eraseIntervalRef.current = null;
          setIsErasing(false);
          onDone?.();
        }
      }, speed);
    }, 1000);
  }, [clearErase]);

  // ─── Compute SVG coords after nudge text renders ──────────────────

  useEffect(() => {
    if (!showGoldLine) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x1 = vw / 2;
    let y1 = vh / 2;

    if (nudgeTextRef.current) {
      const r = nudgeTextRef.current.getBoundingClientRect();
      x1 = r.left + r.width / 2;
      y1 = r.top;
    }

    const settingsBtn = document.querySelector('.settings-btn, .settings-button');
    let x2 = vw * 0.94;
    let y2 = vh * 0.04;

    if (settingsBtn) {
      const sr = settingsBtn.getBoundingClientRect();
      x2 = sr.left + sr.width / 2;
      y2 = sr.top + sr.height / 2;
    }

    const lineLength = Math.hypot(x2 - x1, y2 - y1);
    setSvgCoords({ x1, y1, x2, y2, cx: x2, cy: y2, lineLength, vw, vh });
  }, [showGoldLine]);

  // ─── Phase helpers ────────────────────────────────────────────────

  const advanceToQuestion = useCallback((idx) => {
    setQuestionIndex(idx);
    setUserInput('');
    setMainText(QUESTIONS[idx].text);
    setPhase(`q${idx}_type`);
  }, []);

  // ─── GhostWriter onComplete callbacks ────────────────────────────

  const handleGreetingDone = useCallback(() => {
    setTimeout(() => {
      // PLACEHOLDER — bio copy TBD
      setMainText(
        "I'm your adaptive everyday companion. I'm here to help you think, plan, and feel a little less overwhelmed."
      );
      setPhase('bio');
    }, 2500);
  }, []);

  const handleBioDone = useCallback(() => {
    setTimeout(() => advanceToQuestion(0), 2500);
  }, [advanceToQuestion]);

  const handleQuestionTypeDone = useCallback(() => {
    setShowCursor(true);
    setShowInput(true);
    setPhase(`q${questionIndex}_await`);
  }, [questionIndex]);

  const handleAckTypeDone = useCallback(() => {
    const ack = mainText;
    setPhase(`q${questionIndex}_erase_ack`);
    startErase(ack, 80, () => {
      if (questionIndex < QUESTIONS.length - 1) {
        advanceToQuestion(questionIndex + 1);
      } else {
        setAnswers(prev => {
          const finalConfig = { ...prev, personality: 'nicest' };
          saveAeliConfig(finalConfig);
          return finalConfig;
        });
        setMainText('You can update any of this in Settings whenever you like.');
        setPhase('settings_nudge_type');
      }
    });
  }, [questionIndex, mainText, startErase, advanceToQuestion]);

  const handleSettingsNudgeDone = useCallback(() => {
    setUnblurred(true);
    setShowGoldLine(true);
    setPhase('settings_nudge_reveal');

    setTimeout(() => {
      setShowGoldLine(false);
      setSvgCoords(null);
      setUnblurred(false);
      // PLACEHOLDER — customization prompt copy TBD
      setMainText('Before we begin, let me get dressed for the occasion.');
      setPhase('customization_prompt_type');
    }, 1750);
  }, []);

  const handleCustomPromptDone = useCallback(() => {
    setShowCustomPanel(true);
    setPhase('customization_panel');
  }, []);

  const handleSaveAndContinue = useCallback(() => {
    setShowCustomPanel(false);
    setMainText('Applying changes…');
    setPhase('applying_type');
  }, []);

  const handleApplyingDone = useCallback(() => {
    setTimeout(() => {
      setMainText('Booting.');
      setPhase('booting_type');
    }, 1000);
  }, []);

  const handleBootingDone = useCallback(() => {
    setTimeout(() => {
      setPhase('done');
      onCompleteRef.current(answers);
    }, 400);
  }, [answers]);

  // ─── User input capture ───────────────────────────────────────────

  const handleUserSubmit = useCallback(() => {
    if (!userInput.trim()) return;

    const qKey = QUESTIONS[questionIndex].key;
    const value = userInput.trim();

    setAnswers(prev => ({ ...prev, [qKey]: value }));
    setShowCursor(false);
    setShowInput(false);

    const captured = userInput;
    setUserInput('');

    startErase(captured, 80, () => {
      setMainText(getAck(qKey, value));
      setPhase(`q${questionIndex}_ack_type`);
    });
    setPhase(`q${questionIndex}_erase_input`);
  }, [userInput, questionIndex, startErase]);

  useEffect(() => {
    if (!phase.endsWith('_await')) return;
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        handleUserSubmit();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setUserInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setUserInput(prev => prev + e.key);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, handleUserSubmit]);

  // ─── Render helpers ───────────────────────────────────────────────

  if (phase === 'done') return null;

  const ghostPhases = new Set([
    'greeting', 'bio',
    ...QUESTIONS.flatMap((_, i) => [`q${i}_type`, `q${i}_ack_type`]),
    'settings_nudge_type', 'customization_prompt_type',
    'applying_type', 'booting_type',
  ]);

  const isGhostWriting = ghostPhases.has(phase);
  const isErasingPhase = phase.includes('erase');
  const isAwaitingInput = phase.endsWith('_await');

  const ghostText = phase === 'greeting' ? "Hello, I'm Aeli." : mainText;

  const ghostCallback = {
    greeting:                    handleGreetingDone,
    bio:                         handleBioDone,
    settings_nudge_type:         handleSettingsNudgeDone,
    customization_prompt_type:   handleCustomPromptDone,
    applying_type:               handleApplyingDone,
    booting_type:                handleBootingDone,
    ...Object.fromEntries(QUESTIONS.flatMap((_, i) => [
      [`q${i}_type`,     handleQuestionTypeDone],
      [`q${i}_ack_type`, handleAckTypeDone],
    ])),
  }[phase];

  return (
    <div className={`onboarding-overlay${unblurred ? ' unblurred' : ''}`}>
      <div className="onboarding-content">

        {/* Main text area */}
        <div className="onboarding-main-text">
          {isGhostWriting ? (
            <GhostWriter
              key={ghostText}
              text={ghostText}
              speed={35}
              onComplete={ghostCallback}
            />
          ) : isErasingPhase ? (
            <span>{eraseText}</span>
          ) : (
            <span ref={nudgeTextRef}>{mainText}</span>
          )}
        </div>

        {/* User input line — shown while awaiting or actively erasing input */}
        {(showInput || isAwaitingInput) && (
          <div className="onboarding-input-area">
            <span>
              {isErasingPhase && phase.includes('erase_input') ? eraseText : userInput}
            </span>
            <BlinkingCursor visible={showCursor && userInput.length === 0 && !isErasingPhase} />
          </div>
        )}

        {/* Customization placeholder panel */}
        {showCustomPanel && (
          <div className="onboarding-custom-panel">
            <p>Customization options will appear here.</p>
            <button className="onboarding-save-btn" onClick={handleSaveAndContinue}>
              Save &amp; Continue
            </button>
          </div>
        )}
      </div>

      {/* Gold SVG line + circle — settings nudge reveal */}
      {showGoldLine && svgCoords && (
        <svg
          className="onboarding-gold-overlay"
          viewBox={`0 0 ${svgCoords.vw} ${svgCoords.vh}`}
          preserveAspectRatio="none"
        >
          <line
            className="onboarding-gold-line"
            x1={svgCoords.x1} y1={svgCoords.y1}
            x2={svgCoords.x2} y2={svgCoords.y2}
            strokeDasharray={svgCoords.lineLength}
            strokeDashoffset={svgCoords.lineLength}
          />
          <circle
            className="onboarding-gold-circle"
            cx={svgCoords.cx}
            cy={svgCoords.cy}
            r={24}
          />
        </svg>
      )}
    </div>
  );
}
