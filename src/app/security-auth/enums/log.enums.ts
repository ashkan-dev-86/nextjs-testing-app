export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL
}

export enum LogCategory {
  // Authentication & Security
  AUTHENTICATION,
  AUTHORIZATION,
  SECURITY,
  
  // Data operations
  AUDIT,
  DATABASE,
  
  // Application
  API,
  ACTIVITY,
  SYSTEM,
  JOB,
  
  // Communication
  NOTIFICATION,
  EMAIL,
  
  // Monitoring
  PERFORMANCE,
  ERROR,
  
  // Business
  TRANSACTION,
  PAYMENT,
  
  // Other
  OTHER
}