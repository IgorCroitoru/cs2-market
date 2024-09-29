import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';
import { SteamOauthGuard } from './auth/guards/steam-oauth.guard';
import session from 'express-session';
import passport from 'passport';
import { SessionSerializer } from './auth/serializer';
import serveStatic from 'serve-static';
import cookieParser from 'cookie-parser'
import { default as Redis } from 'ioredis';
import RedisStore from "connect-redis"
import path = require('path');
import { ResponseWrapperInterceptor } from './interceptors/custom-response';
import { ValidationPipe } from '@nestjs/common';
import { SeederService } from './seeds/seeder.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seeder = app.get(SeederService);
   await seeder.seedCategories()
   
  // await seeder.seedTypes();

  const redisClient = new Redis({
    host: String(process.env.REDIS_SESSION_HOST),
    port: Number(process.env.REDIS_SESSION_PORT)

  });
  const redisStore = new RedisStore({client:redisClient}
    
  )
  app.use(serveStatic(path.join(__dirname, '..', 'public')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove non-whitelisted properties
      forbidNonWhitelisted: false, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to DTO instances
      disableErrorMessages:true
    }),
  );
  //app.useGlobalFilters(new CustomUnauthorizedExceptionFilter());
  app.use(session({
    store: redisStore,
    secret: 'sas', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 15 * 1000,
      httpOnly: true,

    },
    
  }));
  app.use(cookieParser())
  app.use(passport.initialize());
  app.use(passport.session());
 
  // Register your session serializer
  //app.useGlobalGuards(new SteamOauthGuard)
  await app.listen(3000,()=>{console.log(`Server started at port ${3000}`)});
}
bootstrap();
