import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/refresh-jwt.strategy";

@Module({
  imports: [
    ConfigModule, // Ensure this is imported
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Ensure ConfigModule is included
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"), // Ensure env variable is defined
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN"),
          issuer: "awesome-marketplace-api",
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, ConfigService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
