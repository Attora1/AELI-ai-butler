// Emergency debug - Add this to your main App component temporarily
// This will help us identify exactly which component is still causing issues

export function emergencyDebugDuplicateKeys() {
  // Count the warnings
  let warningCount = 0;
  const originalWarn = console.warn;
  
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('Encountered two children with the same key')) {
      warningCount++;
      console.error(`🚫 DUPLICATE KEY #${warningCount}`);
      console.error('Key:', message.match(/`([^`]+)`/)?.[1] || 'unknown');
      
      // Capture stack trace to identify component
      const stack = new Error().stack;
      const stackLines = stack.split('\n');
      
      // Look for React component names in stack
      const componentLines = stackLines.filter(line => 
        line.includes('.jsx') || 
        line.includes('MessageList') || 
        line.includes('ChatInterface') || 
        line.includes('ChatMode')
      );
      
      console.error('Stack trace (relevant lines):');
      componentLines.forEach(line => console.error('  ', line.trim()));
      
      if (warningCount >= 10) {
        console.error('🛑 Reached 10 warnings - stopping debug to avoid spam');
        console.warn = originalWarn; // Restore original
      }
    }
    originalWarn.apply(console, args);
  };
  
  console.log('🔍 Emergency debug activated - will show details for next 10 duplicate key warnings');
}

// Run this in console to check your current messages
window.debugCurrentMessages = function() {
  console.log('🔍 Analyzing current app state...');
  
  // Try to access React DevTools or app state
  const reactRoot = document.querySelector('#root');
  if (reactRoot && reactRoot._reactInternalFiber) {
    console.log('React root found - checking state...');
  }
  
  // Instructions for manual checking
  console.log(`
📋 Manual Debug Steps:
1. Open React DevTools
2. Find your App/MessageList/ChatInterface components
3. Check the 'messages' prop/state
4. Look for messages with duplicate 'id' or 'timestamp' values
5. Report back what you find!

Or if you can access your app's context, run:
const messages = /* your messages array */;
console.log('All message IDs:', messages.map(m => m.id));
console.log('All timestamps:', messages.map(m => m.timestamp));
  `);
};
