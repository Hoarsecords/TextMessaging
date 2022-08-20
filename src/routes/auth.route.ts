import { Router } from 'express';
import {
  login,
  randomLogin,
  me,
  loginWithRandomGeneratedUser,
} from '../resolvers/auth.resolver';

const authRouter = Router();

authRouter.get('/me', me);
authRouter.post('/login', login);
authRouter.post('/random-login', randomLogin);
authRouter.post('/random-login-generate', loginWithRandomGeneratedUser);
//
export default authRouter;
