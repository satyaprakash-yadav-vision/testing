
export enum typeSeverity {
  critical = 'critical',
  high = 'high',
  normal = 'normal',
  low = 'low',
  chill = 'chill'
}

export interface IDebugMeta {
  className: string;
  methodName: string;
}

export interface ITransactionId {
  nameAPI: string;
  transactionId: string;
  associatedTransactionIds?: string[];
}

export interface ILogMeta {
  appName: string;
  useCaseName: string;
}

export interface ILogDocument {
  typeGuardILogDocument?: 'typeGuardILogDocument';
  meta: ILogMeta;
  debugMeta: IDebugMeta;
  transactionId: ITransactionId;
}

export interface IErrorLogDocument extends ILogDocument {
  typeGuardIErrorLogDocument?: 'typeGuardIErrorLogDocument';
  stackTrace: string[];
  body: any;
  severity: typeSeverity;
}

export interface IDebugLogDocument extends ILogDocument {
  typeGuardIDebugLogDocument?: 'typeGuardIDebugLogDocument';
  data: any;
  debugType: debugType;
}

export enum debugType {
  info = 'info',
  verbose = 'verbose',
  debug = 'debug'
}
