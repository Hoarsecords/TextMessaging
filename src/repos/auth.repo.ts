import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { JWT_TOKEN_SECRET } from '../utils/constants';
import { RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import { RepoResult } from './index.types';

export type PayloadType = {
  id: number;
  username: string;
  email: string;
};
export default class AuthRepo {
  static async generateJWTToken(user: User): Promise<string> {
    const jwtExpirySeconds = 60 * 60 * 24 * 7; // 7 days

    const payload: PayloadType = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(payload, JWT_TOKEN_SECRET, {
      expiresIn: jwtExpirySeconds,
    });

    return token;
  }
  static async verifyJWTToken(token: string): Promise<boolean> {
    const payload = (await jwt.verify(token, JWT_TOKEN_SECRET)) as PayloadType;

    return payload.id !== undefined;
  }
  static async getPayload(token: string): Promise<RepoResult<PayloadType>> {
    try {
      const payload = (await jwt.verify(
        token,
        JWT_TOKEN_SECRET
      )) as PayloadType;
      if (!payload.id || !payload.username || !payload.email)
        return Result.fail<RepoError>({
          code: 400,
          message: 'Invalid token',
          name: 'token',
        });
      return Result.ok(payload);
    } catch (e) {
      const code = e instanceof jwt.JsonWebTokenError ? 401 : 400;
      return Result.fail<RepoError>({
        code,
        message: 'Invalid token',
        name: 'token',
      });
    }
  }

  static async saveCookie(token: string, res: Response): Promise<void> {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }

  static async login(user: User, res: Response): Promise<string> {
    const token = await this.generateJWTToken(user);

    await this.saveCookie(token, res);

    return token;
  }
  static async getLoggedInUser(req: Request): Promise<User | null> {
    if (!req.cookies?.token) {
      return null;
    }
    const payload = await this.getPayload(req.cookies.token);
    const { data } = payload.getResult();
    if (!data) return null;
    const user = await User.findByPk(data.id);
    return user ? user : null;
  }
}
