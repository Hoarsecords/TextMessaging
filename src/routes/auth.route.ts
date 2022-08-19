import { Router } from 'express';
import { login, randomLogin, me } from '../resolvers/auth.resolver';

const authRouter = Router();

authRouter.get('/me', me);
authRouter.post('/login', login);
authRouter.post('/random-login', randomLogin);
//
export default authRouter;
