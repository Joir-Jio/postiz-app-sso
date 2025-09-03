import { getJestProjects } from '@nx/jest';

// Comprehensive Jest configuration for multi-product SSO testing
export default {
  projects: getJestProjects(),
  
  // Global configuration
  testEnvironment: 'node',
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    'libraries/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  
  // Coverage thresholds for SSO system
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Critical SSO components require higher coverage
    'apps/backend/src/services/sso/**': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    'libraries/nestjs-libraries/src/security/**': {
      branches: 100,
      functions: 100,
      lines: 95,
      statements: 95,
    },
    'apps/backend/src/services/media/media-reference.service.ts': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  
  // Test patterns for different types
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
    '**/tests/**/*.(test|spec).(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  
  // Setup files for testing environment
  setupFilesAfterEnv: [
    '<rootDir>/test-setup/jest.setup.ts',
    '<rootDir>/test-setup/test-environment.ts',
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@gitroom/(.*)$': '<rootDir>/$1',
    '^@test-utils/(.*)$': '<rootDir>/test-utils/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  
  // Test timeout for E2E tests
  testTimeout: 30000,
  
  // Performance testing configuration
  reporters: [
    'default',
    'jest-junit',
    ['jest-performance-reporter', {
      threshold: {
        ssoTokenGeneration: 200,
        seamlessLogin: 500,
        mediaPreloading: 1000,
      },
    }],
  ],
  
  // Parallel testing
  maxWorkers: '50%',
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
};
