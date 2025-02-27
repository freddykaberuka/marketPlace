import { INestApplication, UnauthorizedException } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";
import { IConstants } from "../interfaces/constants.interface";

/**
 * Defines the application config variables
 * @returns the Application config variables
 */
export function constants(): IConstants {
  return {
    port: +process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(","),
    env: process.env.NODE_ENV,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    serverUrl: process.env.SERVER_URL,
    brokerUrl: process.env.BROKER_URL || "localhost:9092",
  };
}

/**
 * Generates obj for the app's CORS configurations
 * @returns CORS configurations
 */
export function corsConfig(): CorsOptions {
  return {
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, Cookies",
    credentials: true,
    origin: (origin, callback) => {
      const appConfiguration = constants();
      const { allowedOrigins = [] } = appConfiguration;
      const canAllowUndefinedOrigin =
        origin === undefined && appConfiguration.env !== "production";

      if (allowedOrigins.indexOf(origin) !== -1 || canAllowUndefinedOrigin) {
        callback(null, true);
      } else {
        callback(
          new UnauthorizedException(
            `Not allowed by CORS for origin:${origin} on ${appConfiguration.env}`,
          ),
        );
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  };
}

/**
 * Configure app instance
 * @param {INestApplication} app - Application instance
 */
export function configure(app: INestApplication): void {
  app.setGlobalPrefix("api");
  app.enableCors(corsConfig());
}