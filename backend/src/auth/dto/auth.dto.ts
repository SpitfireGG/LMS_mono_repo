import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({ example: "Aashish Sharma" })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: "aashish@email.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: "aashish@email.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  password: string;
}

export class GoogleLoginDto {
  @ApiProperty({ example: "google-oauth-id-123" })
  @IsString()
  googleId: string;

  @ApiProperty({ example: "user@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  name: string;

  @ApiProperty({ example: "https://example.com/photo.jpg", required: false })
  @IsOptional()
  @IsString()
  image?: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: "abc123token" })
  @IsString()
  token: string;
}

export class ResendVerificationDto {
  @ApiProperty({ example: "aashish@email.com" })
  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: "refresh-token-value" })
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: "aashish@email.com" })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: "reset-token-value" })
  @IsString()
  token: string;

  @ApiProperty({ example: "NewSecurePass123!" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
