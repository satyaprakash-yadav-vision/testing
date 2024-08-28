import { config } from './index';

const serverName: string = config.nConfig.get('server:name');
const serverHost: string = config.nConfig.get('server:host');
const serverBaseUrl: string = config.nConfig.get('server:url');
const serverPort: number = config.nConfig.get('server:port');
const defaultTimeZone: string = config.nConfig.get('server:defaultTimeZone');

const DbHost: string = config.nConfig.get('database:host');
const DbPort: number = config.nConfig.get('database:port');
const DbName: string = config.nConfig.get('database:name');
const DbUser: string = config.nConfig.get('database:user');
const DbPassword: string = config.nConfig.get('database:password');
const DbDebug: boolean = config.nConfig.get('database:debug');
const LogSqlQuery: boolean = config.nConfig.get('database:log_sql_query');

const ACCESS_SECRET_KEY: string = config.nConfig.get('JWT:ACCESS_SECRET_KEY');
const REFRESH_SECRET_KEY: string = config.nConfig.get('JWT:REFRESH_SECRET_KEY');
const ACCESS_TOKEN_EXPIRY: string = config.nConfig.get('JWT:ACCESS_TOKEN_EXPIRY');
const REFRESH_TOKEN_EXPIRY: string = config.nConfig.get('JWT:REFRESH_TOKEN_EXPIRY');

const env: string = config.nConfig.get('env');

export const CONSTANT_CONFIG = {
  SERVER: {
    NAME: serverName,
    HOST: serverHost,
    URL: serverBaseUrl,
    PORT: serverPort,
    DEFAULT_TIME_ZONE: defaultTimeZone
  },
  /**
   * Default user agent used in API calls made from this app
   */
  USER_AGENT: `${serverName}`,
  ENV: env,
  DATABASE: {
    HOST: DbHost,
    PORT: DbPort,
    NAME: DbName,
    USER: DbUser,
    PASSWORD: DbPassword,
    DEBUG: DbDebug,
    LOG: LogSqlQuery
  },
  JWT: {
    ACCESS_SECRET_KEY: ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY: REFRESH_SECRET_KEY,
    ACCESS_TOKEN_EXPIRY: ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: REFRESH_TOKEN_EXPIRY
  }
};
