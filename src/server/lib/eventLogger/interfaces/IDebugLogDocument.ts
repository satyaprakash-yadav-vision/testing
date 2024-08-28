import { ILogDocument } from './ILogDocument';

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
