import { AuthTokens, ServiceError } from "@shared/types";
import prisma from "./database";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { createServiceError } from "@shared/utils";

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;
  private readonly jwtRefreshSecret: string;
  private readonly bcryptSaltRounds: number;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET!;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
    this.bcryptSaltRounds = parseInt(
      process.env.BCRYPT_SALT_ROUNDS || "10",
      10,
    );

    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      throw new Error("JWT secrets must be defined in environment variables");
    }
  }

  async register(email: string, password: string): Promise<AuthTokens> {
    console.log("Registering user with email: +++", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createServiceError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return this.generateTokens(user.id, user.email);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      jwt.verify(refreshToken, this.jwtRefreshSecret);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw createServiceError("Invalid or expired refresh token", 401);
      }

      const tokens = await this.generateTokens(
        storedToken.user.id,
        storedToken.user.email,
      );

      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      return tokens;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw createServiceError("Invalid refresh token", 401, error);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw createServiceError("Invalid token: user does not exist", 404);
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createServiceError("Invalid token", 401);
      }

      throw createServiceError("Token validation failed", 500, error);
    }
  }

  async getUserById(
    userId: string,
  ): Promise<{ id: string; email: string } | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw createServiceError("User not found", 404);
    }
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw createServiceError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload = { userId, email };

    const accessTokenOptions: SignOptions = {
      expiresIn: this.jwtExpiresIn as StringValue,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, accessTokenOptions);

    const refreshTokenOptions: SignOptions = {
      expiresIn: this.jwtRefreshExpiresIn as StringValue,
    };

    const refreshToken = jwt.sign(
      payload,
      this.jwtRefreshSecret,
      refreshTokenOptions,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
