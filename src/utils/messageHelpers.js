/**
 * Helper functions for creating messages with unique IDs
 */

/**
 * Creates a new message object with unique ID and timestamp
 * @param {Object} messageData - The message data
 * @param {string} messageData.text - The message text
 * @param {boolean} messageData.isUser - Whether the message is from the user
 * @param {boolean} [messageData.isSystem] - Whether the message is a system message
 * @returns {Object} Complete message object with ID and timestamp
 */
export function createMessage({ text, isUser, isSystem = false }) {
  return {
    id: crypto.randomUUID(),
    text,
    isUser,
    isSystem,
    timestamp: Date.now()
  };
}

/**
 * Creates multiple messages at once
 * @param {Array} messagesData - Array of message data objects
 * @returns {Array} Array of complete message objects
 */
export function createMessages(messagesData) {
  return messagesData.map(createMessage);
}

/**
 * Adds message to state with proper ID
 * @param {Function} setMessages - React state setter function
 * @param {Object} messageData - The message data
 */
export function addMessage(setMessages, messageData) {
  setMessages(prev => [...prev, createMessage(messageData)]);
}

/**
 * Adds multiple messages to state with proper IDs
 * @param {Function} setMessages - React state setter function
 * @param {Array} messagesData - Array of message data objects
 */
export function addMessages(setMessages, messagesData) {
  setMessages(prev => [...prev, ...createMessages(messagesData)]);
}

/**
 * Debug function to check for duplicate message data
 * @param {Array} messages - Array of message objects
 * @returns {Object} Debug information
 */
export function debugMessages(messages) {
  const messagesWithKeys = messages.map((msg, index) => ({
    key: msg.id,
    originalIndex: index,
    timestamp: msg.timestamp,
    isUser: msg.isUser,
    content: msg.text?.substring(0, 50) + (msg.text?.length > 50 ? '...' : '')
  }));

  const timestamps = messages.map(msg => msg.timestamp).filter(Boolean);
  const duplicateTimestamps = timestamps.filter((ts, index) => 
    timestamps.indexOf(ts) !== index
  );

  const timestampGroups = messages.reduce((groups, msg) => {
    const ts = msg.timestamp;
    if (ts) {
      if (!groups[ts]) groups[ts] = [];
      groups[ts].push(msg);
    }
    return groups;
  }, {});

  const duplicateGroups = Object.entries(timestampGroups)
    .filter(([_, msgs]) => msgs.length > 1);

  return {
    messagesWithKeys,
    duplicateTimestamps,
    duplicateGroups,
    stats: {
      totalMessages: messages.length,
      uniqueIds: new Set(messages.map(m => m.id)).size,
      uniqueTimestamps: new Set(timestamps).size,
      hasDuplicateIds: messages.length !== new Set(messages.map(m => m.id)).size,
      hasDuplicateTimestamps: duplicateTimestamps.length > 0
    }
  };
}
