import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST;
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT ?? "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      this.logger.warn("SMTP not configured — emails will be logged to console only");
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const link = `${frontendUrl}/verify-email?token=${token}`;

    const subject = "Verify your email — NAATI Excellence Academy";
    const text = `Hello,\n\nPlease verify your email by clicking the link:\n${link}\n\nThis link expires in 24 hours.\n\n— NAATI Excellence Academy`;

    await this.send({ to: email, subject, text });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const link = `${frontendUrl}/reset-password?token=${token}`;

    const subject = "Reset your password — NAATI Excellence Academy";
    const text = `Hello,\n\nYou requested a password reset. Click the link:\n${link}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\n— NAATI Excellence Academy`;

    await this.send({ to: email, subject, text });
  }

  private async send({ to, subject, text }: { to: string; subject: string; text: string }) {
    if (this.transporter) {
      const from = process.env.SMTP_FROM ?? "noreply@naatiexcellence.com.au";
      await this.transporter.sendMail({ from, to, subject, text });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } else {
      this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}\n${text}`);
    }
  }
}
