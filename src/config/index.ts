import path from 'path';
import fs from 'fs-extra';
import Nconf from 'nconf';
import _ from 'lodash';

/**
 * Importing default config
 */
import configDefault from './config.default.json';

const env = process.env.NODE_ENV || `development`;
/**f
 * This will store the config which will override the current config
 */
const pathOverride = `${path.resolve(`.`)}/config`;

/**
 * Path to the root directory
 */
const pathToRoot = path.join(process.cwd(), '/');

/**
 * Path to the temporary content directory
 */
const pathToContent = path.join(process.cwd(), `content`);

/**
 * Path to the logs
 */
const pathToLogs = path.join(process.cwd(), `logs`);

/**
 * Path to assets
 */
const pathToAssets = path.join(process.cwd(), `assets`);

/**
 * Path to multer uploads
 */
const pathToUpload = path.join(process.cwd(), `uploads`);

/**
 * Name of the environment based configs
 */
const configEnv = path.join(pathOverride, `config.${env}.json`);

class Config {
  private static _config: Config;
  readonly nConfig: Nconf.Provider;

  private constructor(config: Nconf.Provider) {
    this.nConfig = config;

    this.initConfig();
    this.setupPersistentKeys();
    this.setupRuntimePaths([pathToContent, pathToLogs, pathToUpload]);
  }

  public static config(config: Nconf.Provider): Config {
    if (!this._config) {
      this._config = new Config(config);
    }
    return this._config;
  }

  /**
   * Making a wrapper on get to load the in memory model of the config first before doing any get call
   */
  public get = (value: string) => {
    /**
     * Load the sources i.e. file before returning any value
     * This will throw error if we are using any other store than file which doesn't have loadSync function defined
     */
    this.nConfig.load();
    return this.nConfig.get(value);
  };
  /**
   * Initialize the configuration
   */
  private initConfig = () => {
    const nconf = this.nConfig;
    // command line arguments
    nconf.argv();

    // env arguments
    nconf.env({
      separator: ':'
    });

    /**
     * Going to check if environment config exist if not then terminate the process
     if (!fs.existsSync(configEnv)) {
      console.error(
        `Only default config exist in src/config/default.json. Please provide override config ${configEnv} for the envrionment ${env}.`
      );
      process.exit(-1);
    }
     
     */

    /**
     * Loading the environment config
     */
    nconf.file(`configEnv`, configEnv);

    /**
     * Loading default config
     */
    nconf.defaults(configDefault);
  };

  /**
   * Non Config persistent keys
   *  - Env
   */
  private setupPersistentKeys = () => {
    //env
    this.nConfig.set(`env`, env);

    // set paths in the configuration
    this.nConfig.set(`paths`, {
      root: pathToRoot,
      assets: path.join(pathToRoot, `assets`),
      content: pathToContent,
      logs: pathToLogs,
      upload: pathToUpload
    });
  };

  /**
   * Setup paths need for logging, downloading content/temp, multer uploads
   */
  private setupRuntimePaths = (paths: string[]) => {
    _.each(paths, directory => {
      if (!directory) {
        throw new Error(`Path is null ${directory}`);
      }
      /**
       * Make directory if it doesn't exist
       */
      fs.mkdirpSync(directory);
      try {
        fs.accessSync(directory, fs.constants.R_OK | fs.constants.W_OK);
      } catch (err) {
        console.error(`Path ${directory} requires read and write both permissions`);
      }
    });
  };
}

export const config = Config.config(new Nconf.Provider({}));
