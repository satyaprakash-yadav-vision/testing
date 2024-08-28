import _ from 'lodash';
import fs from 'fs-extra';
import { NextFunction, Request, Response } from 'express';
import debugImport from 'debug';

const debug = debugImport('base:reaper');

/**
 * Delete the file at the given path
 * @param filePath
 */
const removeFile = async (filePath: string) => {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return;
    }

    debug(`removing file ${filePath}`);
    await fs.unlink(filePath);
  } catch (e) { }
};

/**
 * Auto remove any uploaded files on response end
 * to persist uploaded files, simply move them to a permanent location,
 * or delete the req.files[key] before the response end.
 *
 */
export function ReapUpload() {
  /**
   * Return express request handler
   */
  return function (req: Request, res: Response, next: NextFunction) {
    const reapFiles = async (err: Error) => {
      // Remove listeners to avoid multiple invocations
      res.removeListener('finish', reapFiles);
      res.removeListener('close', reapFiles);

      const filesToDelete = [];

      // for single file uploads
      if (req.file) {
        filesToDelete.push(req.file);
      }

      /**
       * For multiple file uploads
       * multiple files could be either an array of file objects
       * or object of multiple files keyed by field name
       */
      if (req.files) {
        const filesArray = _.isArray(req.files)
          ? req.files
          : _.reduce(req.files, (acc, files) => acc.concat(files), []);

        for (const fileToDelete of filesArray) {
          filesToDelete.push(fileToDelete);
        }
      }

      // delete all files
      // await Promise.map(filesToDelete, multerFile => removeFile(multerFile.path), {
      //   concurrency: 4
      // });
    };

    res.on('finish', reapFiles);
    res.on('close', reapFiles);

    next();
  };
}
