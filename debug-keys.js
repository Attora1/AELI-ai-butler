// Debug script to identify duplicate key sources
// Add this temporarily to your main App component or run in console

export function debugDuplicateKeys() {
  // Override React's warning to capture the stack trace
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('Encountered two children with the same key')) {
      console.error('🚫 DUPLICATE KEY DETECTED!');
      console.error('Message:', message);
      console.error('Stack trace:', new Error().stack);
      
      // Try to identify which component is causing this
      const stack = new Error().stack;
      if (stack.includes('MessageList')) {
        console.error('❌ Source: MessageList component');
      } else if (stack.includes('ChatInterface')) {
        console.error('❌ Source: ChatInterface component');
      } else if (stack.includes('ChatMode')) {
        console.error('❌ Source: ChatMode component');
      } else {
        console.error('❌ Source: Unknown component');
      }
    }
    originalWarn.apply(console, args);
  };
  
  console.log('🔍 Duplicate key debugging enabled. Check console for details when warnings appear.');
}

// Also check current messages in state
export function analyzeCurrentMessages() {
  // This assumes you can access your messages from the console
  // You might need to expose this from your app context
  console.log('📊 Message Analysis:');
  
  // You can run this in browser console to check current state
  console.log(`
    Run this in your browser console to analyze current messages:
    
    // Access your app's message state and run:
    const messages = /* get your messages array */;
    const ids = messages.map(m => m.id);
    const timestamps = messages.map(m => m.timestamp);
    
    console.log('Message IDs:', ids);
    console.log('Timestamps:', timestamps);
    console.log('Duplicate IDs:', ids.filter((id, i) => ids.indexOf(id) !== i));
    console.log('Duplicate timestamps:', timestamps.filter((ts, i) => timestamps.indexOf(ts) !== i));
  `);
}
