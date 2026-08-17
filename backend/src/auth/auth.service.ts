import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import { SignupDto, LoginDto, GoogleLoginDto } from "./dto/auth.dto";
import * as argon2 from "argon2";
import { randomBytes, createHash } from "crypto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException("Email already registered");

    const hashed = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashed,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.sendVerificationEmail(user.email);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      message: "Account created. Please verify your email.",
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isEmailVerified: user.isEmailVerified },
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          googleId: dto.googleId,
          image: dto.image,
          isEmailVerified: true,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: dto.googleId, image: dto.image ?? user.image, isEmailVerified: true },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image, isEmailVerified: true },
    };
  }

  async verifyEmail(token: string) {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const record = await this.prisma.verificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!record) throw new BadRequestException("Invalid or expired verification token");
    if (record.used) throw new BadRequestException("Token already used");
    if (record.type !== "email_verify") throw new BadRequestException("Invalid token type");
    if (record.expiresAt < new Date()) throw new BadRequestException("Token has expired");

    await this.prisma.$transaction([
      this.prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } }),
      this.prisma.user.update({ where: { email: record.email }, data: { isEmailVerified: true } }),
    ]);

    return { message: "Email verified successfully" };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException("User not found");
    if (user.isEmailVerified) throw new BadRequestException("Email already verified");

    await this.sendVerificationEmail(email);
    return { message: "Verification email sent" };
  }

  async refreshToken(token: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET ?? (process.env.JWT_SECRET ?? "fallback") + "-refresh",
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedException("Refresh token has been revoked");
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: "Logged out successfully" };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "If that email exists, a reset link has been sent." };

    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");

    await this.prisma.verificationToken.create({
      data: {
        email,
        token: hashedToken,
        type: "password_reset",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await this.mailService.sendPasswordResetEmail(email, rawToken);
    return { message: "If that email exists, a reset link has been sent." };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const record = await this.prisma.verificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!record) throw new BadRequestException("Invalid or expired reset token");
    if (record.used) throw new BadRequestException("Token already used");
    if (record.type !== "password_reset") throw new BadRequestException("Invalid token type");
    if (record.expiresAt < new Date()) throw new BadRequestException("Token has expired");

    const hashed = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    await this.prisma.$transaction([
      this.prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } }),
      this.prisma.user.update({
        where: { email: record.email },
        data: { password: hashed, refreshToken: null },
      }),
    ]);

    return { message: "Password reset successfully" };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, image: true, isEmailVerified: true, createdAt: true },
    });
    return user;
  }

  private async sendVerificationEmail(email: string) {
    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");

    await this.prisma.verificationToken.create({
      data: {
        email,
        token: hashedToken,
        type: "email_verify",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await this.mailService.sendVerificationEmail(email, rawToken);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? "15m") as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? (process.env.JWT_SECRET ?? "fallback") + "-refresh",
      expiresIn: "7d" as any,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }
}
