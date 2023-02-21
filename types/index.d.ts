import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export interface ICustomError extends Error {
  statusCode: number;
  isOperational: boolean;
  columns: string;
  errors: string;
}

export interface ICustomHttpServerError extends Error {
  syscall: string;
  code: string;
}

export interface ICustomRequest extends Request {
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

export interface IPost {
  userID: Types.ObjectId;
  content: string;
  image: string;
  likes: Types.ObjectId[] | [];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  comment: string;
  createdAt: Date;
  userID: Types.ObjectId;
  postID: Types.ObjectId;
}
