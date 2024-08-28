import { ILogDocument } from './ILogDocument';

export interface IErrorLogDocument extends ILogDocument {
  typeGuardIErrorLogDocument?: 'typeGuardIErrorLogDocument';
  stackTrace: string[];
  body: any;
  severity: typeSeverity;
}

export enum typeSeverity {
  critical = 'critical',
  high = 'high',
  normal = 'normal',
  low = 'low',
  chill = 'chill'
}
