import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";


const { verify } = jwt;

const auth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'ei tokenia' });
  }

  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  verify(
    token as string,
    process.env.JWT_SECRET as string,
    (err: VerifyErrors | null, decoded?: string | JwtPayload) => {
      if (err) {
        return res.status(401).json({ message: 'virheellinen token' });
      }

      
      if (typeof decoded === 'object' && decoded !== null && 'user_id' in decoded) {
        req.user = decoded as JwtPayload & { user_id: number };
        next();
      } else {
        return res.status(401).json({ message: 'Invalid token payload' });
      }
    }
  );
};

export { auth };
