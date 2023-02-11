import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = getPort(configService);

  await app.listen(port);

  return port;
}

function getPort(configService: ConfigService) {
  return configService.get<number>('PORT');
}

bootstrap().then((port) => {
  const logger = new Logger('bootstrap');

  logger.log(`Server listening on PORT ${port}`);
});
