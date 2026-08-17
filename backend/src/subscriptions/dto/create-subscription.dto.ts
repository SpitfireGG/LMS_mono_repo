import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionDto {
  @ApiProperty({ example: "aashish@email.com" })
  @IsEmail()
  email: string;
}
