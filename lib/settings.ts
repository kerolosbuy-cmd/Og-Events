import settingsData from '../config/settings.json';

// Type definitions for our settings
interface PaymentSettings {
  timeLimit: number;
  timeLimitUnit: string;
  description: string;
}

interface UISettings {
  theme: {
    defaultMode: 'light' | 'dark' | 'system';
    description: string;
  };
}

interface AppSettings {
  payment: PaymentSettings;
  ui: UISettings;
}

// Load settings from JSON file
const settings: AppSettings = settingsData as AppSettings;

// Helper function to get payment time limit
export const getPaymentTimeLimit = (): number => {
  return settings.payment.timeLimit;
};

// Export the entire settings object if needed
export default settings;
