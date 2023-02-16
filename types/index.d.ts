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