import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

const router = express.Router();

router.use(`/v1/auth`, authRoute);
router.use(`/v1/user`, userRoute);

export default router;
