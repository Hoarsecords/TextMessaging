import { Router } from 'express';
import chatRouter from './chatroom.route';

const router = Router();

router.use(chatRouter);

export default router;
