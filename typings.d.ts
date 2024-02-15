import { Request } from 'express';

declare module 'express' {
  interface Request {
    flash(type: string, message?: string): any;
  }
}
