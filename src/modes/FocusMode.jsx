import React from 'react';
import RightPanelSwitcher from '../components/RightPanel/RightPanelSwitcher.jsx';

function FocusMode() {
  // Focus mode should only return right panel content
  // The focus-specific UI should be integrated into AppContent's main area
  return <RightPanelSwitcher />;
}

export default FocusMode;