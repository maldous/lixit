import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

export function isMainModule(mainModule: typeof module | undefined): boolean {
  return mainModule === module;
}

// Only run bootstrap if this file is executed directly
if (isMainModule(require.main)) {
  bootstrap();
}
