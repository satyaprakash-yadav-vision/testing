import express from 'express';
import api from '..';
import { userController } from './user.controller';

const router: express.Router = express.Router({ mergeParams: true });
// api.http(auth.validateUser)
router.post('/', api.http(userController.createUser));
router.put('/:id', api.http(userController.updateUser));
router.get('/', api.http(userController.getAllUser));


export const userRouter = router;
