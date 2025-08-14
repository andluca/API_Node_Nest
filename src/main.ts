import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Cadastro de Pessoas API')
    .setDescription('API REST para cadastro de pessoas com versionamento')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('users-v1', 'Usuários V1 - CRUD básico')
    .addTag('users-v2', 'Usuários V2 - Com endereço')
    .addTag('auth', 'Autenticação JWT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 5000;
  await app.listen(port);

  console.log(`API rodando em: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api`);
  console.log(`H2 Console: http://localhost:8082`);
}
void bootstrap();
