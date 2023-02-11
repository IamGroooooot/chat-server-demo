import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis/redis-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  return initServer(app);
}

async function initServer(app: INestApplication) {
  // get config
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT');
  const redisHost = configService.get('REDIS.HOST');

  // redis adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(`redis://${redisHost}`);

  // start server
  await app.useWebSocketAdapter(redisIoAdapter).listen(port);
}

bootstrap().then((port) => {
  const logger = new Logger('bootstrap');

  logger.log(`Server listening on PORT ${port}`);
});
