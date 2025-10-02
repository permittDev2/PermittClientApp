// API Configuration
// Centralized configuration for API endpoints
// Change the base URL here to update it across all components

// Define two base URLs and select the active one by changing API_BASE only
export const API_BASE_HTTP = 'http://localhost:8080';
export const API_BASE_HTTPS = 'https://localhost:7151';

// Change this one variable to switch environments
export const API_BASE = API_BASE_HTTPS; // or API_BASE_HTTPS

export const API_CONFIG = {
  BASE_URL: `${API_BASE}/api/`,
};

// Separate AI service base URL (non-API path)
export const AI_BASE = 'http://localhost:8000';

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get full endpoint URLs
export const getApiUrl = (endpoint) => {
  return buildApiUrl(endpoint);
};

// Helper for AI endpoints that are not behind /api
export const getAiUrl = (endpoint) => {
  return `${AI_BASE}/${endpoint}`;
};
