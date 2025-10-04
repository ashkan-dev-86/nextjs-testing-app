import { PrismaClient, LogLevel, LogCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface LogOptions {
  userId?: string;
  level?: LogLevel;
  category: LogCategory;
  action: string;
  message: string;
  entityType?: string;
  entityId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  oldValues?: string;
  newValues?: string;
  changes?: string;
  error?: string;
  errorCode?: string;
  stack?: string;
  ip?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  metadata?: string;
  tags?: string[];
  success?: boolean;
}

class Logger {
  /**
   * Main logging method
   */
  async log(options: LogOptions) {
    try {
      await prisma.log.create({
        data: {
          userId: options.userId,
          level: options.level || LogLevel.INFO,
          category: options.category,
          action: options.action,
          message: options.message,
          entityType: options.entityType,
          entityId: options.entityId,
          method: options.method,
          path: options.path,
          statusCode: options.statusCode,
          duration: options.duration,
          oldValues: options.oldValues,
          newValues: options.newValues,
          changes: options.changes,
          error: options.error,
          errorCode: options.errorCode,
          stack: options.stack,
          ip: options.ip,
          userAgent: options.userAgent,
          country: options.country,
          city: options.city,
          device: options.device,
          browser: options.browser,
          os: options.os,
          metadata: options.metadata,
          tags: options.tags,
          success: options.success ?? true,
        },
      });
    } catch (error) {
      console.error("Failed to create log entry:", error);
    }
  }

  /**
   * Log authentication events
   */
  async logAuth(
    action: "login" | "logout" | "register" | "password_change" | "password_reset",
    success: boolean,
    options: {
      userId?: string;
      email?: string;
      ip?: string;
      userAgent?: string;
      error?: string;
      metadata?: string;
    }
  ) {
    await this.log({
      userId: options.userId,
      level: success ? LogLevel.INFO : LogLevel.WARN,
      category: LogCategory.AUTHENTICATION,
      action,
      message: `${action.replace("_", " ")} ${success ? "successful" : "failed"}${
        options.email ? ` for ${options.email}` : ""
      }`,
      success,
      ip: options.ip,
      userAgent: options.userAgent,
      error: options.error,
      metadata: options.metadata,
      tags: ["auth", action],
    });
  }

  /**
   * Log security events
   */
  async logSecurity(
    action: string,
    severity: "low" | "medium" | "high" | "critical",
    options: {
      userId?: string;
      message: string;
      ip?: string;
      userAgent?: string;
      metadata?: string;
    }
  ) {
    const levelMap = {
      low: LogLevel.INFO,
      medium: LogLevel.WARN,
      high: LogLevel.ERROR,
      critical: LogLevel.FATAL,
    };

    const metadata: string = JSON.stringify({ ...(JSON.parse(options.metadata || "{}")), severity });

    await this.log({
      userId: options.userId,
      level: levelMap[severity],
      category: LogCategory.SECURITY,
      action,
      message: options.message,
      ip: options.ip,
      userAgent: options.userAgent,
      metadata,
      tags: ["security", severity],
    });
  }

  /**
   * Log API requests
   */
  async logApi(options: {
    userId?: string;
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    ip?: string;
    userAgent?: string;
    query?: string;
    body?: string;
    error?: string;
  }) {
    await this.log({
      userId: options.userId,
      level: options.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO,
      category: LogCategory.API,
      action: "api_request",
      message: `${options.method} ${options.path} - ${options.statusCode}`,
      method: options.method,
      path: options.path,
      statusCode: options.statusCode,
      duration: options.duration,
      success: options.statusCode < 400,
      ip: options.ip,
      userAgent: options.userAgent,
      error: options.error,
      metadata: JSON.stringify({
        query: options.query,
        body: options.body,
      }),
      tags: ["api", options.method.toLowerCase()],
    });
  }

  /**
   * Log audit trail (CRUD operations)
   */
  async logAudit(
    action: "create" | "read" | "update" | "delete",
    entityType: string,
    entityId: string,
    options: {
      userId: string;
      oldValues?: string;
      newValues?: string;
      changes?: string;
      metadata?: string;
    }
  ) {
    await this.log({
      userId: options.userId,
      level: LogLevel.INFO,
      category: LogCategory.AUDIT,
      action: `${action}_${entityType.toLowerCase()}`,
      message: `${action.toUpperCase()} ${entityType} ${entityId}`,
      entityType,
      entityId,
      oldValues: options.oldValues,
      newValues: options.newValues,
      changes: options.changes,
      metadata: options.metadata,
      tags: ["audit", action, entityType.toLowerCase()],
    });
  }

  /**
   * Log errors
   */
  async logError(error: Error, options?: {
    userId?: string;
    path?: string;
    method?: string;
    metadata?: string;
  }) {
    await this.log({
      userId: options?.userId,
      level: LogLevel.ERROR,
      category: LogCategory.ERROR,
      action: "error",
      message: error.message,
      error: error.name,
      stack: error.stack,
      path: options?.path,
      method: options?.method,
      success: false,
      metadata: options?.metadata,
      tags: ["error", error.name.toLowerCase()],
    });
  }

  /**
   * Log user activity
   */
  async logActivity(
    action: string,
    options: {
      userId?: string;
      message: string;
      path?: string;
      metadata?: string;
    }
  ) {
    await this.log({
      userId: options.userId,
      level: LogLevel.INFO,
      category: LogCategory.ACTIVITY,
      action,
      message: options.message,
      path: options.path,
      metadata: options.metadata,
      tags: ["activity", action],
    });
  }

  /**
   * Log system events
   */
  async logSystem(
    action: string,
    options: {
      message: string;
      success?: boolean;
      duration?: number;
      error?: string;
      metadata?: string;
    }
  ) {
    await this.log({
      level: options.success === false ? LogLevel.ERROR : LogLevel.INFO,
      category: LogCategory.SYSTEM,
      action,
      message: options.message,
      duration: options.duration,
      success: options.success ?? true,
      error: options.error,
      metadata: options.metadata,
      tags: ["system", action],
    });
  }

  /**
   * Log job/task execution
   */
  async logJob(
    jobName: string,
    status: "started" | "completed" | "failed",
    options: {
      duration?: number;
      error?: string;
      result?: string;
      metadata?: string;
    }
  ) {
    await this.log({
      level: status === "failed" ? LogLevel.ERROR : LogLevel.INFO,
      category: LogCategory.JOB,
      action: `job_${status}`,
      message: `Job ${jobName} ${status}`,
      duration: options.duration,
      success: status !== "failed",
      error: options.error,
      metadata: {
        jobName,
        result: options.result,
        ...(JSON.parse(options.metadata || "{}")),
      },
      tags: ["job", jobName, status],
    });
  }

  /**
   * Log notifications
   */
  async logNotification(
    type: string,
    status: "sent" | "delivered" | "failed",
    options: {
      userId?: string;
      recipient: string;
      channel: string;
      error?: string;
      metadata?: string;
    }
  ) {
    await this.log({
      userId: options.userId,
      level: status === "failed" ? LogLevel.ERROR : LogLevel.INFO,
      category: LogCategory.NOTIFICATION,
      action: `notification_${status}`,
      message: `Notification ${status} to ${options.recipient} via ${options.channel}`,
      success: status !== "failed",
      error: options.error,
      metadata: {
        type,
        recipient: options.recipient,
        channel: options.channel,
        ...(JSON.parse(options.metadata || "{}")),
      },
      tags: ["notification", type, options.channel, status],
    });
  }

  /**
   * Log database operations
   */
  async logDatabase(
    operation: string,
    options: {
      tableName?: string;
      duration?: number;
      rowsAffected?: number;
      success?: boolean;
      error?: string;
      query?: string;
    }
  ) {
    await this.log({
      level: options.success === false ? LogLevel.ERROR : LogLevel.DEBUG,
      category: LogCategory.DATABASE,
      action: operation,
      message: `Database ${operation}${options.tableName ? ` on ${options.tableName}` : ""}`,
      duration: options.duration,
      success: options.success ?? true,
      error: options.error,
      metadata: JSON.stringify({
        tableName: options.tableName,
        rowsAffected: options.rowsAffected,
        query: options.query,
      }),
      tags: ["database", operation],
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for custom instances
export { Logger };

// PRACTICAL EXAMPLES

// Log authentication
// await logger.logAuth("login", true, {
//   userId: "123",
//   email: "user@example.com",
//   ip: "192.168.1.1"
// });

// Log API request
// await logger.logApi({
//   method: "POST",
//   path: "/api/users",
//   statusCode: 201,
//   duration: 45
// });

// Log audit trail
// await logger.logAudit("update", "User", "123", {
//   userId: "admin-123",
//   oldValues: { name: "John" },
//   newValues: { name: "John Doe" }
// });

// Log error
// await logger.logError(new Error("Database connection failed"), {
//   userId: "123",
//   path: "/api/users"
// });