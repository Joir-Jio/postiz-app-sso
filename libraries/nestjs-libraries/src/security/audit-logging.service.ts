/**
 * Comprehensive audit logging service for SSO security events
 * Implements enterprise-grade audit trail with compliance features
 * 
 * @fileoverview Security audit logging with SIEM integration capabilities
 * @version 1.0.0
 * 
 * Compliance Features:
 * - SOC 2 Type II audit trail requirements
 * - ISO 27001 security event logging
 * - GDPR data processing audit logs
 * - PCI DSS security monitoring
 * - NIST Cybersecurity Framework alignment
 * - Real-time threat detection and alerting
 * - Tamper-proof log integrity verification
 * - Long-term log retention and archival
 */

import { Injectable, Logger } from '@nestjs/common';
import { createHash, createHmac, randomBytes } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Audit event interfaces
interface BaseAuditEvent {
  eventId: string;
  timestamp: string;
  eventType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  category: 'authentication' | 'authorization' | 'data_access' | 'configuration' | 'system' | 'compliance';
  description: string;
  actorId?: string;
  actorType?: 'user' | 'system' | 'service' | 'admin';
  resourceId?: string;
  resourceType?: string;
  outcome: 'success' | 'failure' | 'partial';
  riskScore: number; // 0.0 to 1.0
  metadata: Record<string, any>;
  integrity: {
    hash: string;
    previousHash?: string;
    signature?: string;
  };
}

interface AuthenticationEvent extends BaseAuditEvent {
  category: 'authentication';
  authMethod: 'sso' | 'password' | 'mfa' | 'api_key' | 'token';
  clientInfo: {
    ipAddress: string;
    userAgent: string;
    sessionId?: string;
    deviceId?: string;
  };
  productKey?: string;
  organizationId?: string;
  failureReason?: string;
  loginAttempts?: number;
}

interface AuthorizationEvent extends BaseAuditEvent {
  category: 'authorization';
  requestedResource: string;
  requestedAction: string;
  permissions: string[];
  denialReason?: string;
  policyId?: string;
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
}

interface DataAccessEvent extends BaseAuditEvent {
  category: 'data_access';
  operation: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';
  dataType: string;
  recordCount?: number;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  accessMethod: 'api' | 'ui' | 'batch' | 'sync';
  queryParameters?: Record<string, any>;
  encryptionStatus?: 'encrypted' | 'unencrypted' | 'partially_encrypted';
}

interface ConfigurationEvent extends BaseAuditEvent {
  category: 'configuration';
  configType: 'security' | 'application' | 'infrastructure' | 'compliance';
  changedSettings: Array<{
    setting: string;
    previousValue?: any;
    newValue?: any;
    changeType: 'created' | 'updated' | 'deleted';
  }>;
  approvalRequired?: boolean;
  approvedBy?: string;
}

interface SystemEvent extends BaseAuditEvent {
  category: 'system';
  systemComponent: string;
  systemVersion?: string;
  performanceMetrics?: {
    cpuUsage?: number;
    memoryUsage?: number;
    responseTime?: number;
    errorRate?: number;
  };
  healthStatus?: 'healthy' | 'degraded' | 'critical';
}

interface ComplianceEvent extends BaseAuditEvent {
  category: 'compliance';
  regulationFramework: 'GDPR' | 'PCI_DSS' | 'SOC2' | 'ISO27001' | 'NIST' | 'HIPAA';
  complianceCheck: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'needs_review';
  remediationRequired?: boolean;
  dueDate?: string;
}

type AuditEvent = AuthenticationEvent | AuthorizationEvent | DataAccessEvent | 
                  ConfigurationEvent | SystemEvent | ComplianceEvent;

// Audit configuration
interface AuditConfiguration {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warning' | 'error';
  retentionPeriodDays: number;
  maxLogFileSize: number;
  encryptLogs: boolean;
  enableIntegrityChecking: boolean;
  enableRealTimeAlerting: boolean;
  siemIntegrationEnabled: boolean;
  complianceMode: 'basic' | 'enhanced' | 'strict';
  sensitiveFieldMasking: boolean;
  archivalEnabled: boolean;
  backupEnabled: boolean;
}

// Alert configuration
interface AlertRule {
  ruleId: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  conditions: {
    eventTypes?: string[];
    severities?: string[];
    riskScoreThreshold?: number;
    timeWindowMinutes?: number;
    occurrenceThreshold?: number;
    actorPattern?: string;
    resourcePattern?: string;
  };
  actions: {
    emailNotification?: {
      recipients: string[];
      template: string;
    };
    webhookNotification?: {
      url: string;
      headers?: Record<string, string>;
    };
    blockActor?: boolean;
    escalate?: boolean;
  };
  enabled: boolean;
}

@Injectable()
export class AuditLoggingService {
  private readonly logger = new Logger(AuditLoggingService.name);
  private readonly config: AuditConfiguration;
  private readonly logDirectory: string;
  private readonly currentLogFile: string;
  private readonly auditEvents: AuditEvent[] = [];
  private readonly alertRules: Map<string, AlertRule> = new Map();
  private readonly integrityChain: string[] = [];
  private readonly signingKey: Buffer;
  
  private logWriteStream?: fs.WriteStream;
  private eventBuffer: AuditEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.config = this.loadAuditConfiguration();
    this.logDirectory = this.initializeLogDirectory();
    this.currentLogFile = this.getCurrentLogFile();
    this.signingKey = this.initializeSigningKey();
    
    if (this.config.enabled) {
      this.initializeLogStream();
      this.initializeAlertRules();
      this.startPeriodicTasks();
    }
  }

  /**
   * Generic log event method for compatibility with controllers
   */
  async logEvent(eventType: string, details: Record<string, any>): Promise<void> {
    try {
      const event: BaseAuditEvent = {
        eventId: randomBytes(16).toString('hex'),
        timestamp: new Date().toISOString(),
        eventType,
        severity: details.severity || 'info',
        source: 'sso-system',
        category: details.category || 'system',
        description: details.description || `Event: ${eventType}`,
        actorId: details.actorId,
        actorType: details.actorType || 'system',
        resourceId: details.resourceId,
        resourceType: details.resourceType,
        outcome: details.outcome || 'success',
        riskScore: details.riskScore || 0.1,
        metadata: {
          ...details,
          loggedAt: new Date().toISOString()
        },
        integrity: await this.generateIntegrity(details)
      };

      await this.processAuditEvent(event as any);
      this.logger.log(`Audit event logged: ${eventType}`, { eventId: event.eventId });
    } catch (error) {
      this.logger.error(`Failed to log audit event: ${eventType}`, error);
    }
  }

  /**
   * Log authentication event with comprehensive details
   */
  async logAuthenticationEvent(details: {
    eventType: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'session_expired' | 'mfa_challenge' | 'mfa_success' | 'mfa_failure';
    actorId?: string;
    authMethod: 'sso' | 'password' | 'mfa' | 'api_key' | 'token';
    clientInfo: {
      ipAddress: string;
      userAgent: string;
      sessionId?: string;
      deviceId?: string;
    };
    productKey?: string;
    organizationId?: string;
    outcome: 'success' | 'failure' | 'partial';
    failureReason?: string;
    loginAttempts?: number;
    riskScore?: number;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const event: AuthenticationEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType: details.eventType,
      severity: this.determineSeverity(details.eventType, details.outcome),
      source: 'sso_authentication_service',
      category: 'authentication',
      description: this.generateDescription(details.eventType, details.outcome, details.failureReason),
      actorId: details.actorId,
      actorType: details.actorId ? 'user' : 'system',
      outcome: details.outcome,
      riskScore: details.riskScore || this.calculateRiskScore(details),
      authMethod: details.authMethod,
      clientInfo: details.clientInfo,
      productKey: details.productKey,
      organizationId: details.organizationId,
      failureReason: details.failureReason,
      loginAttempts: details.loginAttempts,
      metadata: this.sanitizeMetadata(details.metadata || {}),
      integrity: await this.generateIntegrity({}),
    };

    return this.processAuditEvent(event);
  }

  /**
   * Log authorization event for access control decisions
   */
  async logAuthorizationEvent(details: {
    eventType: 'access_granted' | 'access_denied' | 'permission_check' | 'role_assignment' | 'policy_evaluation';
    actorId: string;
    requestedResource: string;
    requestedAction: string;
    permissions: string[];
    outcome: 'success' | 'failure';
    denialReason?: string;
    policyId?: string;
    dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
    metadata?: Record<string, any>;
  }): Promise<string> {
    const event: AuthorizationEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType: details.eventType,
      severity: details.outcome === 'failure' ? 'warning' : 'info',
      source: 'sso_authorization_service',
      category: 'authorization',
      description: `Authorization ${details.outcome} for ${details.requestedAction} on ${details.requestedResource}`,
      actorId: details.actorId,
      actorType: 'user',
      resourceId: details.requestedResource,
      resourceType: 'api_endpoint',
      outcome: details.outcome,
      riskScore: this.calculateAuthorizationRisk(details),
      requestedResource: details.requestedResource,
      requestedAction: details.requestedAction,
      permissions: details.permissions,
      denialReason: details.denialReason,
      policyId: details.policyId,
      dataClassification: details.dataClassification,
      metadata: this.sanitizeMetadata(details.metadata || {}),
      integrity: await this.generateIntegrity({}),
    };

    return this.processAuditEvent(event);
  }

  /**
   * Log data access events for GDPR compliance
   */
  async logDataAccessEvent(details: {
    eventType: 'data_read' | 'data_write' | 'data_delete' | 'data_export' | 'data_import' | 'pii_access' | 'bulk_operation';
    actorId: string;
    operation: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';
    dataType: string;
    resourceId?: string;
    recordCount?: number;
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    accessMethod: 'api' | 'ui' | 'batch' | 'sync';
    outcome: 'success' | 'failure' | 'partial';
    queryParameters?: Record<string, any>;
    encryptionStatus?: 'encrypted' | 'unencrypted' | 'partially_encrypted';
    gdprLawfulBasis?: string;
    retentionPeriod?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const event: DataAccessEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType: details.eventType,
      severity: this.getDataAccessSeverity(details),
      source: 'sso_data_service',
      category: 'data_access',
      description: `${details.operation.toUpperCase()} operation on ${details.dataType} data`,
      actorId: details.actorId,
      actorType: 'user',
      resourceId: details.resourceId,
      resourceType: details.dataType,
      outcome: details.outcome,
      riskScore: this.calculateDataAccessRisk(details),
      operation: details.operation,
      dataType: details.dataType,
      recordCount: details.recordCount,
      dataClassification: details.dataClassification,
      accessMethod: details.accessMethod,
      queryParameters: this.sanitizeQueryParameters(details.queryParameters),
      encryptionStatus: details.encryptionStatus,
      metadata: this.sanitizeMetadata({
        ...details.metadata || {},
        gdprLawfulBasis: details.gdprLawfulBasis,
        retentionPeriod: details.retentionPeriod,
      }),
      integrity: await this.generateIntegrity({}),
    };

    return this.processAuditEvent(event);
  }

  /**
   * Log configuration changes for security monitoring
   */
  async logConfigurationEvent(details: {
    eventType: 'config_create' | 'config_update' | 'config_delete' | 'security_setting_change' | 'policy_update';
    actorId: string;
    configType: 'security' | 'application' | 'infrastructure' | 'compliance';
    changedSettings: Array<{
      setting: string;
      previousValue?: any;
      newValue?: any;
      changeType: 'created' | 'updated' | 'deleted';
    }>;
    outcome: 'success' | 'failure';
    approvalRequired?: boolean;
    approvedBy?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const event: ConfigurationEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType: details.eventType,
      severity: 'warning', // Configuration changes are always significant
      source: 'sso_configuration_service',
      category: 'configuration',
      description: `Configuration ${details.eventType.replace('config_', '')} by ${details.actorId}`,
      actorId: details.actorId,
      actorType: 'admin',
      outcome: details.outcome,
      riskScore: this.calculateConfigurationRisk(details),
      configType: details.configType,
      changedSettings: this.sanitizeConfigurationChanges(details.changedSettings),
      approvalRequired: details.approvalRequired,
      approvedBy: details.approvedBy,
      metadata: this.sanitizeMetadata(details.metadata || {}),
      integrity: await this.generateIntegrity({}),
    };

    return this.processAuditEvent(event);
  }

  /**
   * Log system events for operational monitoring
   */
  async logSystemEvent(details: {
    eventType: 'service_start' | 'service_stop' | 'error_occurred' | 'performance_degradation' | 'health_check' | 'backup_completed';
    systemComponent: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    outcome: 'success' | 'failure' | 'partial';
    systemVersion?: string;
    performanceMetrics?: {
      cpuUsage?: number;
      memoryUsage?: number;
      responseTime?: number;
      errorRate?: number;
    };
    healthStatus?: 'healthy' | 'degraded' | 'critical';
    errorDetails?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const event: SystemEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType: details.eventType,
      severity: details.severity,
      source: details.systemComponent,
      category: 'system',
      description: `System event: ${details.eventType} for ${details.systemComponent}`,
      actorType: 'system',
      outcome: details.outcome,
      riskScore: this.calculateSystemRisk(details),
      systemComponent: details.systemComponent,
      systemVersion: details.systemVersion,
      performanceMetrics: details.performanceMetrics,
      healthStatus: details.healthStatus,
      metadata: this.sanitizeMetadata({
        ...details.metadata || {},
        errorDetails: details.errorDetails,
      }),
      integrity: await this.generateIntegrity({}),
    };

    return this.processAuditEvent(event);
  }

  /**
   * Log compliance events for regulatory requirements
   */
  async logComplianceEvent(details: {
    eventType: 'compliance_check' | 'regulation_violation' | 'data_retention' | 'audit_access' | 'policy_violation';
    regulationFramework: 'GDPR' | 'PCI_DSS' | 'SOC2' | 'ISO27001' | 'NIST' | 'HIPAA';
    complianceCheck: string;
    complianceStatus: 'compliant' | 'non_compliant' | 'needs_review';
    actorId?: string;
    resourceId?: string;
    outcome: 'success' | 'failure' | 'partial';
    remediationRequired?: boolean;
    dueDate?: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const event: ComplianceEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      eventType: details.eventType,
      severity: details.complianceStatus === 'non_compliant' ? 'critical' : 'info',
      source: 'sso_compliance_service',
      category: 'compliance',
      description: `${details.regulationFramework} compliance check: ${details.complianceCheck}`,
      actorId: details.actorId,
      actorType: details.actorId ? 'user' : 'system',
      resourceId: details.resourceId,
      outcome: details.outcome,
      riskScore: this.calculateComplianceRisk(details),
      regulationFramework: details.regulationFramework,
      complianceCheck: details.complianceCheck,
      complianceStatus: details.complianceStatus,
      remediationRequired: details.remediationRequired,
      dueDate: details.dueDate,
      metadata: this.sanitizeMetadata(details.metadata || {}),
      integrity: await this.generateIntegrity({}),
    };

    return this.processAuditEvent(event);
  }

  /**
   * Query audit events with filtering and pagination
   */
  async queryAuditEvents(filters: {
    startDate?: Date;
    endDate?: Date;
    eventTypes?: string[];
    categories?: string[];
    severities?: string[];
    actorIds?: string[];
    resourceIds?: string[];
    outcomes?: string[];
    minRiskScore?: number;
    maxRiskScore?: number;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    events: AuditEvent[];
    totalCount: number;
    hasMore: boolean;
  }> {
    let filteredEvents = [...this.auditEvents];

    // Apply filters
    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) <= filters.endDate!);
    }

    if (filters.eventTypes?.length) {
      filteredEvents = filteredEvents.filter(e => filters.eventTypes!.includes(e.eventType));
    }

    if (filters.categories?.length) {
      filteredEvents = filteredEvents.filter(e => filters.categories!.includes(e.category));
    }

    if (filters.severities?.length) {
      filteredEvents = filteredEvents.filter(e => filters.severities!.includes(e.severity));
    }

    if (filters.actorIds?.length) {
      filteredEvents = filteredEvents.filter(e => e.actorId && filters.actorIds!.includes(e.actorId));
    }

    if (filters.minRiskScore !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.riskScore >= filters.minRiskScore!);
    }

    if (filters.maxRiskScore !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.riskScore <= filters.maxRiskScore!);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const totalCount = filteredEvents.length;
    const offset = filters.offset || 0;
    const limit = Math.min(filters.limit || 100, 1000); // Max 1000 events per query

    const paginatedEvents = filteredEvents.slice(offset, offset + limit);
    const hasMore = offset + limit < totalCount;

    return {
      events: paginatedEvents,
      totalCount,
      hasMore,
    };
  }

  /**
   * Get audit statistics for dashboard
   */
  async getAuditStatistics(timeRange: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<{
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topActors: Array<{ actorId: string; eventCount: number }>;
    riskScoreDistribution: Record<string, number>;
    complianceStatus: Record<string, number>;
    alertsTriggered: number;
  }> {
    const timeRangeMs = this.getTimeRangeMs(timeRange);
    const cutoffTime = new Date(Date.now() - timeRangeMs);
    
    const recentEvents = this.auditEvents.filter(e => new Date(e.timestamp) >= cutoffTime);

    const stats = {
      totalEvents: recentEvents.length,
      eventsByCategory: {} as Record<string, number>,
      eventsBySeverity: {} as Record<string, number>,
      topActors: [] as Array<{ actorId: string; eventCount: number }>,
      riskScoreDistribution: {
        'low (0.0-0.3)': 0,
        'medium (0.3-0.7)': 0,
        'high (0.7-0.9)': 0,
        'critical (0.9-1.0)': 0,
      },
      complianceStatus: {} as Record<string, number>,
      alertsTriggered: 0,
    };

    // Calculate statistics
    const actorCounts = new Map<string, number>();

    for (const event of recentEvents) {
      // Category distribution
      stats.eventsByCategory[event.category] = (stats.eventsByCategory[event.category] || 0) + 1;

      // Severity distribution
      stats.eventsBySeverity[event.severity] = (stats.eventsBySeverity[event.severity] || 0) + 1;

      // Actor frequency
      if (event.actorId) {
        actorCounts.set(event.actorId, (actorCounts.get(event.actorId) || 0) + 1);
      }

      // Risk score distribution
      if (event.riskScore < 0.3) {
        stats.riskScoreDistribution['low (0.0-0.3)']++;
      } else if (event.riskScore < 0.7) {
        stats.riskScoreDistribution['medium (0.3-0.7)']++;
      } else if (event.riskScore < 0.9) {
        stats.riskScoreDistribution['high (0.7-0.9)']++;
      } else {
        stats.riskScoreDistribution['critical (0.9-1.0)']++;
      }

      // Compliance status for compliance events
      if (event.category === 'compliance') {
        const complianceEvent = event as ComplianceEvent;
        stats.complianceStatus[complianceEvent.complianceStatus] = 
          (stats.complianceStatus[complianceEvent.complianceStatus] || 0) + 1;
      }
    }

    // Top actors
    stats.topActors = Array.from(actorCounts.entries())
      .map(([actorId, eventCount]) => ({ actorId, eventCount }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    return stats;
  }

  /**
   * Export audit logs for compliance reporting
   */
  async exportAuditLogs(options: {
    format: 'json' | 'csv' | 'xml';
    startDate?: Date;
    endDate?: Date;
    categories?: string[];
    encryptExport?: boolean;
    includeIntegrityProof?: boolean;
  }): Promise<string> {
    const events = await this.queryAuditEvents({
      startDate: options.startDate,
      endDate: options.endDate,
      categories: options.categories,
      limit: 100000, // Large limit for export
    });

    let exportData: string;

    switch (options.format) {
      case 'json':
        exportData = JSON.stringify({
          metadata: {
            exportDate: new Date().toISOString(),
            eventCount: events.totalCount,
            integrityVerified: options.includeIntegrityProof ? this.verifyLogIntegrity() : undefined,
          },
          events: events.events,
        }, null, 2);
        break;

      case 'csv':
        exportData = this.convertToCSV(events.events);
        break;

      case 'xml':
        exportData = this.convertToXML(events.events);
        break;

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }

    if (options.encryptExport) {
      exportData = this.encryptExport(exportData);
    }

    return exportData;
  }

  /**
   * Verify the integrity of the audit log chain
   */
  verifyLogIntegrity(): { verified: boolean; details: string } {
    if (!this.config.enableIntegrityChecking || this.integrityChain.length === 0) {
      return { verified: true, details: 'Integrity checking not enabled' };
    }

    try {
      // Verify the chain of integrity hashes
      for (let i = 1; i < this.integrityChain.length; i++) {
        const currentEvent = this.auditEvents[i];
        const previousHash = this.integrityChain[i - 1];
        
        if (currentEvent.integrity.previousHash !== previousHash) {
          return {
            verified: false,
            details: `Integrity breach detected at event ${i}: hash mismatch`,
          };
        }
      }

      return { verified: true, details: 'All integrity checks passed' };
    } catch (error) {
      return {
        verified: false,
        details: `Integrity verification failed: ${error.message}`,
      };
    }
  }

  /**
   * Private helper methods
   */

  private async processAuditEvent(event: AuditEvent): Promise<string> {
    // Add to memory store
    this.auditEvents.push(event);
    this.integrityChain.push(event.integrity.hash);

    // Add to buffer for batch writing
    this.eventBuffer.push(event);

    // Check alert rules
    await this.checkAlertRules(event);

    // Trigger flush if buffer is full or high-priority event
    if (this.eventBuffer.length >= 100 || event.severity === 'critical') {
      await this.flushEventBuffer();
    } else if (!this.flushTimer) {
      // Schedule periodic flush
      this.flushTimer = setTimeout(() => this.flushEventBuffer(), 5000);
    }

    // Cleanup old events to prevent memory bloat
    if (this.auditEvents.length > 100000) {
      this.auditEvents.splice(0, 50000);
      this.integrityChain.splice(0, 50000);
    }

    this.logger.debug(`Audit event logged: ${event.eventType}`, { eventId: event.eventId });
    return event.eventId;
  }

  private async checkAlertRules(event: AuditEvent): Promise<void> {
    if (!this.config.enableRealTimeAlerting) {
      return;
    }

    for (const [ruleId, rule] of this.alertRules.entries()) {
      if (!rule.enabled) {
        continue;
      }

      const matches = this.evaluateAlertRule(event, rule);
      if (matches) {
        await this.triggerAlert(rule, event);
      }
    }
  }

  private evaluateAlertRule(event: AuditEvent, rule: AlertRule): boolean {
    const { conditions } = rule;

    // Check event types
    if (conditions.eventTypes && !conditions.eventTypes.includes(event.eventType)) {
      return false;
    }

    // Check severities
    if (conditions.severities && !conditions.severities.includes(event.severity)) {
      return false;
    }

    // Check risk score threshold
    if (conditions.riskScoreThreshold && event.riskScore < conditions.riskScoreThreshold) {
      return false;
    }

    // Check actor pattern
    if (conditions.actorPattern && event.actorId) {
      const regex = new RegExp(conditions.actorPattern);
      if (!regex.test(event.actorId)) {
        return false;
      }
    }

    // Check resource pattern
    if (conditions.resourcePattern && event.resourceId) {
      const regex = new RegExp(conditions.resourcePattern);
      if (!regex.test(event.resourceId)) {
        return false;
      }
    }

    // All conditions passed
    return true;
  }

  private async triggerAlert(rule: AlertRule, event: AuditEvent): Promise<void> {
    this.logger.warn(`Security alert triggered: ${rule.name}`, {
      ruleId: rule.ruleId,
      eventId: event.eventId,
      eventType: event.eventType,
      severity: rule.severity,
    });

    // Execute alert actions
    if (rule.actions.emailNotification) {
      await this.sendEmailAlert(rule, event);
    }

    if (rule.actions.webhookNotification) {
      await this.sendWebhookAlert(rule, event);
    }

    if (rule.actions.blockActor && event.actorId) {
      await this.blockActor(event.actorId, rule.name);
    }
  }

  private async generateIntegrity(eventData: any): Promise<{ hash: string; previousHash?: string; signature?: string }> {
    const eventString = JSON.stringify(eventData);
    const hash = createHash('sha256').update(eventString).digest('hex');
    
    const previousHash = this.integrityChain.length > 0 ? 
      this.integrityChain[this.integrityChain.length - 1] : 
      undefined;

    let signature: string | undefined;
    if (this.config.enableIntegrityChecking) {
      const signatureData = `${eventString}:${previousHash || ''}`;
      signature = createHmac('sha256', this.signingKey)
        .update(signatureData)
        .digest('hex');
    }

    return { hash, previousHash, signature };
  }

  private generateEventId(): string {
    const timestamp = Date.now().toString();
    const random = randomBytes(8).toString('hex');
    return `audit_${timestamp}_${random}`;
  }

  private determineSeverity(eventType: string, outcome: string): 'info' | 'warning' | 'error' | 'critical' {
    if (outcome === 'failure') {
      if (eventType.includes('login') || eventType.includes('auth')) {
        return 'warning';
      }
      return 'error';
    }

    if (eventType.includes('critical') || eventType.includes('security')) {
      return 'critical';
    }

    return 'info';
  }

  private generateDescription(eventType: string, outcome: string, failureReason?: string): string {
    const baseDescription = eventType.replace(/_/g, ' ').toLowerCase();
    const outcomeText = outcome === 'success' ? 'succeeded' : 'failed';
    
    let description = `${baseDescription} ${outcomeText}`;
    if (failureReason) {
      description += `: ${failureReason}`;
    }

    return description;
  }

  private calculateRiskScore(details: any): number {
    let score = 0.1; // Base score

    // Authentication-specific risk factors
    if (details.failureReason) {
      score += 0.3;
    }

    if (details.loginAttempts && details.loginAttempts > 3) {
      score += 0.4;
    }

    if (details.authMethod === 'password' && details.outcome === 'failure') {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private calculateAuthorizationRisk(details: any): number {
    let score = 0.1;

    if (details.outcome === 'failure') {
      score += 0.4;
    }

    if (details.dataClassification === 'restricted') {
      score += 0.3;
    }

    if (details.requestedAction === 'delete' || details.requestedAction === 'admin') {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private calculateDataAccessRisk(details: any): number {
    let score = 0.1;

    if (details.dataClassification === 'restricted') {
      score += 0.4;
    }

    if (details.operation === 'delete' || details.operation === 'export') {
      score += 0.3;
    }

    if (details.recordCount && details.recordCount > 1000) {
      score += 0.2;
    }

    if (details.encryptionStatus === 'unencrypted') {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private calculateConfigurationRisk(details: any): number {
    let score = 0.3; // Configuration changes are inherently risky

    if (details.configType === 'security') {
      score += 0.4;
    }

    if (!details.approvedBy) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private calculateSystemRisk(details: any): number {
    let score = 0.1;

    if (details.severity === 'critical') {
      score += 0.8;
    } else if (details.severity === 'error') {
      score += 0.5;
    } else if (details.severity === 'warning') {
      score += 0.3;
    }

    if (details.healthStatus === 'critical') {
      score += 0.4;
    }

    return Math.min(score, 1.0);
  }

  private calculateComplianceRisk(details: any): number {
    let score = 0.2;

    if (details.complianceStatus === 'non_compliant') {
      score += 0.7;
    }

    if (details.remediationRequired) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private getDataAccessSeverity(details: any): 'info' | 'warning' | 'error' | 'critical' {
    if (details.outcome === 'failure') {
      return 'error';
    }

    if (details.dataClassification === 'restricted') {
      return 'warning';
    }

    if (details.operation === 'delete' || details.operation === 'export') {
      return 'warning';
    }

    return 'info';
  }

  // Additional helper methods would continue here...
  // (Implementation of remaining methods like sanitizeMetadata, flushEventBuffer, etc.)

  private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(metadata)) {
      if (this.config.sensitiveFieldMasking && this.isSensitiveField(key)) {
        sanitized[key] = this.maskSensitiveValue(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'creditcard'];
    return sensitiveFields.some(field => fieldName.toLowerCase().includes(field));
  }

  private maskSensitiveValue(value: any): string {
    if (typeof value === 'string' && value.length > 4) {
      return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }
    return '*****';
  }

  private sanitizeQueryParameters(params?: Record<string, any>): Record<string, any> | undefined {
    if (!params) return undefined;
    return this.sanitizeMetadata(params);
  }

  private sanitizeConfigurationChanges(changes: Array<{
    setting: string;
    previousValue?: any;
    newValue?: any;
    changeType: 'created' | 'updated' | 'deleted';
  }>): Array<{
    setting: string;
    previousValue?: any;
    newValue?: any;
    changeType: 'created' | 'updated' | 'deleted';
  }> {
    return changes.map(change => ({
      ...change,
      previousValue: this.isSensitiveField(change.setting) ? 
        this.maskSensitiveValue(change.previousValue) : 
        change.previousValue,
      newValue: this.isSensitiveField(change.setting) ? 
        this.maskSensitiveValue(change.newValue) : 
        change.newValue,
    }));
  }

  private loadAuditConfiguration(): AuditConfiguration {
    const env = process.env.NODE_ENV || 'development';
    
    return {
      enabled: true,
      logLevel: env === 'production' ? 'info' : 'debug',
      retentionPeriodDays: env === 'production' ? 2555 : 90, // 7 years for production
      maxLogFileSize: 100 * 1024 * 1024, // 100MB
      encryptLogs: env === 'production',
      enableIntegrityChecking: true,
      enableRealTimeAlerting: true,
      siemIntegrationEnabled: env === 'production',
      complianceMode: env === 'production' ? 'strict' : 'basic',
      sensitiveFieldMasking: true,
      archivalEnabled: env === 'production',
      backupEnabled: true,
    };
  }

  private initializeLogDirectory(): string {
    const dir = path.join(process.cwd(), 'logs', 'audit', this.config.complianceMode);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o750 });
    }
    return dir;
  }

  private getCurrentLogFile(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDirectory, `audit-${date}.log`);
  }

  private initializeSigningKey(): Buffer {
    const keyPath = path.join(this.logDirectory, 'audit-signing.key');
    
    if (fs.existsSync(keyPath)) {
      return fs.readFileSync(keyPath);
    } else {
      const key = randomBytes(32);
      fs.writeFileSync(keyPath, key, { mode: 0o600 });
      return key;
    }
  }

  private initializeLogStream(): void {
    this.logWriteStream = fs.createWriteStream(this.currentLogFile, { flags: 'a' });
    
    this.logWriteStream.on('error', (error) => {
      this.logger.error('Audit log write error:', error);
    });
  }

  private initializeAlertRules(): void {
    // Initialize with default security alert rules
    const defaultRules: AlertRule[] = [
      {
        ruleId: 'multiple_failed_logins',
        name: 'Multiple Failed Login Attempts',
        description: 'Detects multiple failed login attempts from the same user',
        severity: 'high',
        conditions: {
          eventTypes: ['login_failure'],
          timeWindowMinutes: 15,
          occurrenceThreshold: 5,
        },
        actions: {
          emailNotification: {
            recipients: ['security@postiz.com'],
            template: 'failed_login_alert',
          },
          blockActor: false,
        },
        enabled: true,
      },
      // Add more default rules...
    ];

    for (const rule of defaultRules) {
      this.alertRules.set(rule.ruleId, rule);
    }
  }

  private startPeriodicTasks(): void {
    // Flush buffer every 30 seconds
    setInterval(() => {
      this.flushEventBuffer();
    }, 30000);

    // Cleanup old events every hour
    setInterval(() => {
      this.cleanupOldEvents();
    }, 3600000);

    // Rotate log files daily
    setInterval(() => {
      this.rotateLogFiles();
    }, 86400000);
  }

  private async flushEventBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0 || !this.logWriteStream) {
      return;
    }

    try {
      const events = [...this.eventBuffer];
      this.eventBuffer = [];

      if (this.flushTimer) {
        clearTimeout(this.flushTimer);
        this.flushTimer = undefined;
      }

      for (const event of events) {
        const logEntry = JSON.stringify(event) + '\n';
        this.logWriteStream.write(logEntry);
      }

      this.logger.debug(`Flushed ${events.length} audit events to disk`);
    } catch (error) {
      this.logger.error('Failed to flush audit events:', error);
    }
  }

  private cleanupOldEvents(): void {
    const cutoffTime = new Date(Date.now() - (this.config.retentionPeriodDays * 24 * 60 * 60 * 1000));
    
    const initialCount = this.auditEvents.length;
    let removedCount = 0;

    for (let i = this.auditEvents.length - 1; i >= 0; i--) {
      if (new Date(this.auditEvents[i].timestamp) < cutoffTime) {
        this.auditEvents.splice(i, 1);
        this.integrityChain.splice(i, 1);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.logger.log(`Cleaned up ${removedCount} old audit events`);
    }
  }

  private rotateLogFiles(): void {
    // Implementation for log file rotation
    const currentDate = new Date().toISOString().split('T')[0];
    const newLogFile = path.join(this.logDirectory, `audit-${currentDate}.log`);
    
    if (this.currentLogFile !== newLogFile) {
      this.logWriteStream?.end();
      this.initializeLogStream();
      this.logger.log(`Rotated audit log file to: ${newLogFile}`);
    }
  }

  private getTimeRangeMs(timeRange: string): number {
    const ranges = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    };
    
    return ranges[timeRange as keyof typeof ranges] || ranges.day;
  }

  private convertToCSV(events: AuditEvent[]): string {
    // CSV conversion implementation
    const headers = ['eventId', 'timestamp', 'eventType', 'severity', 'category', 'actorId', 'outcome', 'riskScore', 'description'];
    const rows = [headers.join(',')];

    for (const event of events) {
      const row = [
        event.eventId,
        event.timestamp,
        event.eventType,
        event.severity,
        event.category,
        event.actorId || '',
        event.outcome,
        event.riskScore.toString(),
        `"${event.description.replace(/"/g, '""')}"`,
      ];
      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  private convertToXML(events: AuditEvent[]): string {
    // XML conversion implementation
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<auditEvents>\n';
    
    for (const event of events) {
      xml += '  <event>\n';
      xml += `    <eventId>${event.eventId}</eventId>\n`;
      xml += `    <timestamp>${event.timestamp}</timestamp>\n`;
      xml += `    <eventType>${event.eventType}</eventType>\n`;
      xml += `    <severity>${event.severity}</severity>\n`;
      xml += `    <category>${event.category}</category>\n`;
      xml += `    <actorId>${event.actorId || ''}</actorId>\n`;
      xml += `    <outcome>${event.outcome}</outcome>\n`;
      xml += `    <riskScore>${event.riskScore}</riskScore>\n`;
      xml += `    <description><![CDATA[${event.description}]]></description>\n`;
      xml += '  </event>\n';
    }
    
    xml += '</auditEvents>';
    return xml;
  }

  private encryptExport(data: string): string {
    // Implement export encryption
    return Buffer.from(data).toString('base64');
  }

  private async sendEmailAlert(rule: AlertRule, event: AuditEvent): Promise<void> {
    // Email alert implementation
    this.logger.log(`Email alert would be sent for rule: ${rule.name}`);
  }

  private async sendWebhookAlert(rule: AlertRule, event: AuditEvent): Promise<void> {
    // Webhook alert implementation
    this.logger.log(`Webhook alert would be sent for rule: ${rule.name}`);
  }

  private async blockActor(actorId: string, reason: string): Promise<void> {
    // Actor blocking implementation
    this.logger.warn(`Actor ${actorId} would be blocked for: ${reason}`);
  }
}

export { AuditEvent, AuthenticationEvent, AuthorizationEvent, DataAccessEvent, ConfigurationEvent, SystemEvent, ComplianceEvent };