import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('MAIN');
  await app.listen('3000', 'app');
  // await app.listen(3000);
}
bootstrap();
