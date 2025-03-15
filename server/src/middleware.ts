import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminJwtPayload } from './types';



const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    req.admin = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
    return; 
  }
};
