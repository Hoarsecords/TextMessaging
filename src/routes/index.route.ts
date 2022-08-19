import { Router } from 'express';
import authRouter from './auth.route';
import chatRouter from './chatroom.route';
import messageRouter from './message.route';

const router = Router();

router.use(chatRouter);
router.use(authRouter);
router.use(messageRouter);

export default router;
