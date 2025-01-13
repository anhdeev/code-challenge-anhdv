import express from 'express';
import authRoute from './auth.route';

const router = express.Router();

router.use(`/v1/auth`, authRoute);

export default router;
