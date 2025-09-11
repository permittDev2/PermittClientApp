// API Configuration
// Centralized configuration for API endpoints
// Change the base URL here to update it across all components

// Port configuration for different environments
const PORTS = {
  LOCAL: 7151,    // Local machine port
  DOCKER: 8080    // Docker port
};

// Determine which port to use based on environment
const getPort = () => {
  // Check if we're running in Docker or production
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENV === 'docker') {
    return PORTS.DOCKER;
  }
  return PORTS.LOCAL;
};

export const API_CONFIG = {
  BASE_URL: `http://localhost:${getPort()}/api/`,
  
  // API Endpoints
  ENDPOINTS: {
    ACCOUNT: {
      LOGIN: 'Account/login',
      SIGNUP: 'Account/signup',
      CONFIRM_EMAIL: 'account/confirm-email',
    },
    CASE: 'Case',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get full endpoint URLs
export const getApiUrl = (endpoint) => {
  return buildApiUrl(endpoint);
};
