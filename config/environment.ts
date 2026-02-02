import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface EnvironmentConfig {
  // Environment
  nodeEnv: 'local' | 'staging' | 'production';
  
  // URLs
  apiBaseUrl: string;
  frontendBaseUrl: string;
  
  // Hosts and Ports (for Docker/local)
  apiHost: string;
  apiPort: number;
  frontendHost: string;
  frontendPort: number;
  
  // Timeouts
  apiTimeout: number;
  frontendTimeout: number;
  
  // Browser Settings
  headless: boolean;
  slowMo: number;
  browser: 'chromium' | 'firefox' | 'webkit';
  parallelWorkers: number;
  
  // Test User
  testUser: {
    email: string;
    password: string;
  };
  
  // Reporting
  reportDir: string;
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
  
  // Feature Flags
  enableApiLogging: boolean;
  enableNetworkLogs: boolean;
}

class ConfigValidator {
  private static validateRequired(value: string | undefined, name: string): string {
    if (!value) {
      throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value;
  }

  private static validateUrl(url: string, name: string): string {
    try {
      new URL(url);
      return url.replace(/\/$/, ''); // Remove trailing slash
    } catch {
      throw new Error(`Invalid URL for ${name}: ${url}`);
    }
  }

  private static parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  private static parseNumber(value: string | undefined, defaultValue: number): number {
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private static buildUrl(host: string, port: number, protocol: string = 'http'): string {
    // If host already contains protocol, use it as-is
    if (host.startsWith('http://') || host.startsWith('https://')) {
      return host.replace(/\/$/, '');
    }
    // Build URL with protocol, host, and port
    return `${protocol}://${host}:${port}`;
  }

  static validate(): EnvironmentConfig {
    const nodeEnv = (process.env.NODE_ENV || 'staging') as 'local' | 'staging' | 'production';
    
    // Parse API configuration
    const apiHost = process.env.API_HOST || 'localhost';
    const apiPort = this.parseNumber(process.env.API_PORT, 3000);
    const apiProtocol = process.env.API_PROTOCOL || 'http';
    
    // Parse Frontend configuration
    const frontendHost = process.env.FRONTEND_HOST || 'localhost';
    const frontendPort = this.parseNumber(process.env.FRONTEND_PORT, 3001);
    const frontendProtocol = process.env.FRONTEND_PROTOCOL || 'http';
    
    // Support both full URL (API_BASE_URL) and host+port (API_HOST+API_PORT)
    let apiBaseUrl: string;
    if (process.env.API_BASE_URL) {
      apiBaseUrl = this.validateUrl(process.env.API_BASE_URL, 'API_BASE_URL');
    } else {
      apiBaseUrl = this.buildUrl(apiHost, apiPort, apiProtocol);
    }
    
    let frontendBaseUrl: string;
    if (process.env.FRONTEND_BASE_URL) {
      frontendBaseUrl = this.validateUrl(process.env.FRONTEND_BASE_URL, 'FRONTEND_BASE_URL');
    } else {
      frontendBaseUrl = this.buildUrl(frontendHost, frontendPort, frontendProtocol);
    }

    return {
      nodeEnv,
      apiBaseUrl,
      frontendBaseUrl,
      apiHost,
      apiPort,
      frontendHost,
      frontendPort,
      apiTimeout: this.parseNumber(process.env.API_TIMEOUT, 30000),
      frontendTimeout: this.parseNumber(process.env.FRONTEND_TIMEOUT, 30000),
      headless: this.parseBoolean(process.env.HEADLESS, false),
      slowMo: this.parseNumber(process.env.SLOW_MO, 0),
      browser: (process.env.BROWSER as any) || 'chromium',
      parallelWorkers: this.parseNumber(process.env.PARALLEL_WORKERS, 1),
      testUser: {
        email: this.validateRequired(process.env.TEST_USER_EMAIL, 'TEST_USER_EMAIL'),
        password: this.validateRequired(process.env.TEST_USER_PASSWORD, 'TEST_USER_PASSWORD'),
      },
      reportDir: process.env.REPORT_DIR || './reports',
      screenshotOnFailure: this.parseBoolean(process.env.SCREENSHOT_ON_FAILURE, true),
      videoOnFailure: this.parseBoolean(process.env.VIDEO_ON_FAILURE, true),
      enableApiLogging: this.parseBoolean(process.env.ENABLE_API_LOGGING, true),
      enableNetworkLogs: this.parseBoolean(process.env.ENABLE_NETWORK_LOGS, false),
    };
  }
}

// Export singleton config instance
export const config: EnvironmentConfig = ConfigValidator.validate();

// Helper functions for common operations
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${config.apiBaseUrl}/${cleanEndpoint}`;
};

export const getFrontendUrl = (path: string): string => {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.frontendBaseUrl}${cleanPath}`;
};

// Log configuration on load (excluding sensitive data)
console.log('🔧 Environment Configuration Loaded:');
console.log(`   Environment: ${config.nodeEnv}`);
console.log(`   API Base URL: ${config.apiBaseUrl}`);
console.log(`   Frontend Base URL: ${config.frontendBaseUrl}`);
console.log(`   Browser: ${config.browser} (headless: ${config.headless})`);
console.log(`   Test User: ${config.testUser.email}`);
