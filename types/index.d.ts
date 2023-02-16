import { Request, Response, NextFunction } from 'express';

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

export type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<T>;
