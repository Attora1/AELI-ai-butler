import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import MotivQuote from '../MotivQuote';
import MusicToggle from '../Music.jsx';
import generateSideQuests from '../genSideQuests';
import ModeLayout from '../Modes/ModeLayout.jsx';
import '../../styles/modes-css/Focus.css';
import { getGreeting, getEncouragement, getWit } from '../../prompts/AELIEngine.js';

const Focus = ({ settings }) => {
  const [task, setTask] = useState('');
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);

  const [greeting, setGreeting] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [wit, setWit] = useState('');

  const checklistInputRef = useRef(null);
  const alertSound = useRef(new Audio('../../../sounds/level-passed.mp3'));

  useEffect(() => {
    setGreeting(getGreeting(settings));
    setEncouragement(getEncouragement());
    setWit(getWit());
  }, [settings]);

  const handleCompleteMission = () => setShowMissionModal(true);
  const confirmCompleteMission = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTask('');
    setTaskSubmitted(false);
    setChecklist([]);
    setShowMissionModal(false);
  };
  const cancelCompleteMission = () => setShowMissionModal(false);

  useEffect(() => {
    let timer;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      alertSound.current.play();
      setShowMissionModal(true);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const startTimer = (minutes) => {
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
  };

  const toggleChecklistItem = (index) => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    updated.sort((a, b) => a.checked - b.checked);
    setChecklist(updated);
  };

  const addChecklistItem = () => {
    if (newItem.trim()) {
      setChecklist([...checklist, { text: newItem, checked: false }]);
      setNewItem('');
    }
  };

  const hardcodedSideQuests = [
    "Clear your workspace.",
    "Refill your water bottle.",
    "Write down your top 3 priorities.",
    "Do a quick stretch.",
    "Take three deep breaths."
  ];

  return (
    <>
      <ModeLayout
        className="focus-theme"
        heading="Focus Mode"
        subtitle="Let's lock in and move gently."
        leftColumn={
          <div className="focus-panel">
            {!taskSubmitted ? (
              <label>
                Task:
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && task.trim()) {
                      e.preventDefault();
                      setTaskSubmitted(true);
                    }
                  }}
                  placeholder="What is the mission right now?"
                  className="task-input"
                  autoFocus
                />
              </label>
            ) : (
              <>
                <h3 className="task-header">{task}</h3>
                <button className="add-btn" onClick={() => setTaskSubmitted(false)}>Edit Task</button>
              </>
            )}

            <label>
              Checklist:
              <div className="checklist-input">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newItem.trim()) {
                      e.preventDefault();
                      addChecklistItem();
                      setNewItem('');
                      setTimeout(() => document.querySelector('.new-item-input')?.focus(), 0);
                    }
                  }}
                  placeholder="Add a side-quest"
                  className="new-item-input"
                />
                <button
                  onClick={() => {
                    if (newItem.trim()) {
                      addChecklistItem();
                      setNewItem('');
                      setTimeout(() => document.querySelector('.new-item-input')?.focus(), 0);
                    }
                  }}
                  className="add-btn"
                >
                  Add
                </button>
              </div>
            </label>

            <ul className="checklist">
              {checklist.sort((a, b) => a.checked - b.checked).map((item, index) => (
                <li key={index} className={item.checked ? 'checked' : ''}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(index)}
                    />
                    {item.text}
                  </label>
                </li>
              ))}
            </ul>

            <button className="mission-complete-button" onClick={handleCompleteMission}>Mission Complete!</button>
          </div>
        }
        rightColumn={
          <div className="focus-panel">
            <div className="side-quest-section">
              <h4>🗂️ Optional Side Quests</h4>
              <ul className="suggestion-list">
                {hardcodedSideQuests.map((idea, idx) => (
                  <li key={idx}>• {idea}</li>
                ))}
              </ul>
            </div>

            <div className="timer-controls">
              <button onClick={() => startTimer(10)} className="timer-btn">10 min</button>
              <button onClick={() => startTimer(20)} className="timer-btn">20 min</button>
              <button onClick={() => setIsRunning(!isRunning)} className="timer-btn">{isRunning ? 'Pause' : 'Resume'}</button>
              <button onClick={() => { setIsRunning(false); setSecondsLeft(0); }} className="timer-btn stop-btn">Stop</button>
            </div>

            {secondsLeft > 0 && (
              <p className="timer-display">
                Time Left: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
              </p>
            )}

            <MotivQuote customEncouragement={encouragement} customWit={wit} />
            <MusicToggle />
          </div>
        }
      />

      <div className={`focus-modal ${showMissionModal ? 'show' : ''}`}>
        <div className="focus-modal-content">
          <p>Are you sure you want to mark this mission complete and start a new one?</p>
          <div className="focus-modal-buttons">
            <button onClick={confirmCompleteMission}>Yes, Complete Mission</button>
            <button onClick={cancelCompleteMission}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Focus;
