import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsUrl,
  Min,
  Max,
  Matches,
  Length,
  ValidateNested,
  ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CardDetailsDto {
  @ApiProperty({ example: "4242424242424242", description: "PAN — never persisted, only the last 4 digits are kept" })
  @IsString()
  @Matches(/^[0-9 -]{12,25}$/, { message: "Card number must contain 12–19 digits" })
  number: string;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  expMonth: number;

  @ApiProperty({ example: 2030, description: "Two- or four-digit expiry year" })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2100)
  expYear: number;

  @ApiProperty({ example: "123", description: "Security code (CVC/CVV) — never persisted" })
  @IsString()
  @Matches(/^[0-9]{3,4}$/, { message: "Security code must be 3 or 4 digits" })
  cvc: string;

  @ApiPropertyOptional({ example: "Aashish Sharma" })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  holderName?: string;
}

export class CreateCheckoutDto {
  @ApiProperty({ example: "ccl-nepali" })
  @IsString()
  courseId: string;

  @ApiProperty({ enum: PaymentProvider, example: PaymentProvider.STRIPE })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiPropertyOptional({
    description: "Stripe.js payment method token — preferred over raw card details for the CARD provider",
    example: "pm_1PxyzABC",
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiPropertyOptional({ type: CardDetailsDto })
  @ValidateIf((dto: CreateCheckoutDto) => dto.provider === PaymentProvider.CARD && !dto.paymentMethodId)
  @ValidateNested()
  @Type(() => CardDetailsDto)
  card?: CardDetailsDto;

  @ApiPropertyOptional({ description: "Where to send the customer once the payment completes" })
  @IsOptional()
  @IsUrl({ require_tld: false })
  successUrl?: string;

  @ApiPropertyOptional({ description: "Where to send the customer if they abandon the payment" })
  @IsOptional()
  @IsUrl({ require_tld: false })
  cancelUrl?: string;
}

export class SandboxDecisionDto {
  @ApiProperty({ enum: ["approve", "decline"], example: "approve" })
  @IsEnum({ approve: "approve", decline: "decline" })
  decision: "approve" | "decline";
}

export class QueryPaymentDto {
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
