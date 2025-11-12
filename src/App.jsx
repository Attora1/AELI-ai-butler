import React from 'react';
import { AppProvider } from './context/AppContext.jsx';
import AppContent from './components/AppContent.jsx'; // Import AppContent

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App; // Added comment to force change