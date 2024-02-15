import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import * as methodOverride from 'method-override';
 // import * as flash from 'express-flash';
import flash = require('connect-flash');
import * as expressSession from 'express-session';
import * as connectFlash from 'connect-flash';
import { sessionConfig } from './session.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  // Get the underlying express instance
  const expressApp = app.getHttpAdapter().getInstance();

  // Set the views directory
  expressApp.set('views', path.join(__dirname, '..', 'views'));

  // Set the view engine
  expressApp.set('view engine', 'ejs');

  app.use(methodOverride('_method'));

  // Add session middleware
  app.use(expressSession(sessionConfig));

  //  middleware connect-flash for flash messages
  app.use(connectFlash());

  await app.listen(3000);
}
bootstrap();

