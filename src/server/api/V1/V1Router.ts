import express from 'express';
import api from '..';
import { userRouter } from './user.routers';
import { commonRouter } from './common.router';
const router: express.Router = express.Router({ mergeParams: true });

router.use('/user', userRouter);

router.get('/key', api.http(commonRouter.getKey));

export const V1Router = router;
