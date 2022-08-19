import { Router } from 'express';
import User from '../models/user';
import AuthRepo from '../repos/auth.repo';

const authRouter = Router();

authRouter.get('/login', async (req, res) => {
  console.log(`🚀 ~ file: auth.route.ts ~ line 8 ~ authRouter.get ~ req`, req);
  const email = req.body?.email;
  if (!email) return res.send(400).json({ error: 'Email is required' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'user not found' });
  const payload = await AuthRepo.login(user, res);
  return res.status(200).json(payload);
});

export default authRouter;
