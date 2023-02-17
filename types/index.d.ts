import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';

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

export interface User {
  _id: ObjectId;
  name: string;
  sex: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  followers: ObjectId[] | [];
  following: ObjectId[] | [];
}
