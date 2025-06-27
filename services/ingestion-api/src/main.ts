import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_MAX ?? 100),
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: "v",
  });

  app.enableCors({
    origin:
      process.env.NODE_ENV === "development" ? true : ["https://lixit.local"],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, "0.0.0.0");
}

/*  ❱❱  Prevent double-execution inside the same process  */
if (require.main === module) {
  bootstrap();
}
