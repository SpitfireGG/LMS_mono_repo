import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateContactDto {
  @ApiProperty({ example: "General enquiry" })
  @IsString()
  enquiryType: string;

  @ApiProperty({ example: "Aashish" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Sharma" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "aashish@email.com" })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: "412345678" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseOfInterest?: string;

  @ApiPropertyOptional({ example: "Email" })
  @IsOptional()
  @IsString()
  preferredContact?: string;

  @ApiProperty({ example: "I want to prepare for NAATI CCL..." })
  @IsString()
  message: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  consented: boolean;
}
