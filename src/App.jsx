import React, { useState } from 'react';
import { AppProvider } from './context/AppContext.jsx';
import AppContent from './components/AppContent.jsx';
import OnboardingScreen from './components/Startup/OnboardingScreen.jsx';
import WelcomeAnimation from './components/Startup/WelcomeAnimation.jsx';
import { loadAeliConfig } from './utils/aeliConfig.js';

function App() {
  const [startupState] = useState(() => {
    const config = loadAeliConfig();
    return {
      phase: config ? 'welcome' : 'onboarding',
      config: config || null,
      isFirstBoot: !config,
    };
  });

  const [phase, setPhase] = useState(startupState.phase);
  const [config, setConfig] = useState(startupState.config);
  const [isFirstBoot] = useState(startupState.isFirstBoot);

  const handleOnboardingComplete = (savedConfig) => {
    setConfig(savedConfig);
    setPhase('welcome');
  };

  const handleWelcomeComplete = () => {
    setPhase('done');
  };

  return (
    <AppProvider>
      <AppContent />
      {phase === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {phase === 'welcome' && (
        <WelcomeAnimation
          config={config}
          isFirstBoot={isFirstBoot}
          onComplete={handleWelcomeComplete}
        />
      )}
    </AppProvider>
  );
}

export default App;
