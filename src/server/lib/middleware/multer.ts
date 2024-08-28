import multer from 'multer';
import path from 'path';
import { CONSTANT } from '../../utils/constants/constant';
import fs from 'fs';

const fileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, CONSTANT.FILE_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});
const fileUpload = multer({ storage: fileStorage });

export const multerUpload = {
  fileUpload
};