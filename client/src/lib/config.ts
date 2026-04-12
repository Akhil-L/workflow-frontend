/**
 * ENVIRONMENT CONFIGURATION
 * 
 * These settings are managed via environment variables for portability.
 * Sensible defaults are provided for local and Replit development.
 */

export const CONFIG = {
  // API & Networking
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://workflow-backend-mdfx.onrender.com",
  
  // File Submission Limits
  MAX_FILE_SIZE_MB: Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 5,
  DEFAULT_MAX_ROWS: Number(import.meta.env.VITE_DEFAULT_MAX_ROWS) || 100,
  
  // Validation Settings
  ALLOWED_EXTENSIONS: (import.meta.env.VITE_ALLOWED_EXTENSIONS || "csv,xlsx").split(","),
  
  // Security & Permissions
  ENABLE_ADMIN_REGISTRATION: import.meta.env.VITE_ENABLE_ADMIN_REGISTRATION === "true" || false,
  SESSION_TIMEOUT_MS: Number(import.meta.env.VITE_SESSION_TIMEOUT_MS) || 3600000, // 1 hour
  
  // Platform Identification
  APP_NAME: import.meta.env.VITE_APP_NAME || "Lexington Global",
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || "development"
};

/**
 * LOGICAL BOUNDARY DOCUMENTATION
 * 
 * [FRONTEND RESPONSIBILITIES]
 * - UI Components & Layouts (client/src/components)
 * - Routing & Navigation (client/src/App.tsx)
 * - Client-side state management (zustand hooks)
 * - Immediate UI validation (form field types, basic file extension checks)
 * - Theme & Styling (tailwind, shadcn)
 * 
 * [BACKEND RESPONSIBILITIES (Logical)]
 * - Data Integrity & Persistence (Currently simulated in client/src/lib/mock-data.ts)
 * - Business Rules & Calculations (Earnings logic, Payout grouping)
 * - Authorization & Permission Enforcement (Role checks on actions)
 * - Complex Data Validation (CSV parsing, column verification, row count enforcement)
 * - Security Policy Application (File size limits, Session management)
 */
