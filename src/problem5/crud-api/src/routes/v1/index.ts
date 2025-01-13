import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import orderRoute from './order.route';

const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.use(`/v1/auth`, authRoute);
router.use(`/v1/user`, userRoute);
router.use(`/v1/order`, orderRoute);

export default router;
