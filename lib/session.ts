// Utility functions for managing session IDs

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
}

export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sessionId');
  }
}
