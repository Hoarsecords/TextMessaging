import { RepoError } from './../types/RepoError';
import { Result } from './../types/RepoResult';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { RepoResult } from './index.types';

const secret = 'secret';

export type PayloadType = {
  id: number;
  username: string;
  email: string;
};
export default class AuthRepo {
  static async generateJWTToken(payload: User): Promise<string> {
    const jwtExpirySeconds = 60 * 60 * 24 * 7; // 7 days

    const token = jwt.sign(payload, secret, {
      expiresIn: jwtExpirySeconds,
    });

    return token;
  }
  static async verifyJWTToken(token: string): Promise<boolean> {
    const payload = (await jwt.verify(token, secret)) as PayloadType;

    return payload.id !== undefined;
  }
  static async getPayload(token: string): Promise<RepoResult<PayloadType>> {
    try {
      const payload = (await jwt.verify(token, secret)) as PayloadType;
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
}
