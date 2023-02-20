import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export interface CustomError extends Error {
  statusCode: number;
  isOperational: boolean;
  columns: string;
  errors: string;
}

export interface CustomHttpServerError extends Error {
  syscall: string;
  code: string;
}

export interface CustomRequest extends Request {
  user: User;
}

export type AsyncFunction = (req: CustomRequest, res: Response, next: NextFunction) => Promise<T>;

// password 會有 undefined 是回傳資料時保護 password
export interface IUser {
  _id: Types.ObjectId;
  id: string;
  name: string;
  sex: string;
  email: string;
  password?: string;
  confirmPassword: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  followers: Types.ObjectId[] | [];
  following: Types.ObjectId[] | [];
}
