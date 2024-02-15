import * as session from 'express-session';

export const sessionConfig = {
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
};
