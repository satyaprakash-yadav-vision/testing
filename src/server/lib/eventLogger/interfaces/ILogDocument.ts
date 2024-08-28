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
