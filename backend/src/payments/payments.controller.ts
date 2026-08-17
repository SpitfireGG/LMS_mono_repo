import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  Headers,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiExcludeEndpoint } from "@nestjs/swagger";
import type { Request } from "express";
import { PaymentsService, AuthUser } from "./payments.service";
import { CreateCheckoutDto, QueryPaymentDto, SandboxDecisionDto } from "./dto/payment.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";

/** Express request with the raw body Nest keeps for signature verification. */
type RawBodyRequest = Request & { rawBody?: Buffer };

@ApiTags("Payments")
@Controller("api/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Get("config")
  @ApiOperation({ summary: "Payment methods available to the checkout page" })
  config() {
    return this.paymentsService.getConfig();
  }

  @Post("checkout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Start a checkout for a course (Stripe, Payoneer or card)" })
  checkout(@CurrentUser() user: AuthUser, @Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createCheckout(user, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List my payments" })
  findMine(@CurrentUser() user: AuthUser, @Query() query: QueryPaymentDto) {
    return this.paymentsService.findMine(user.id, query);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get one of my payments" })
  findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.paymentsService.findOne(user, id);
  }

  @Post(":id/refresh")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Re-read the payment status from the provider" })
  refresh(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.paymentsService.refresh(user, id);
  }

  @Post(":id/sandbox")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Settle a payment in sandbox mode (only while provider credentials are absent)",
  })
  sandbox(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: SandboxDecisionDto,
  ) {
    return this.paymentsService.sandboxDecision(user, id, dto.decision);
  }

  @Public()
  @Post("webhook/stripe")
  @HttpCode(200)
  @ApiExcludeEndpoint()
  stripeWebhook(
    @Req() req: RawBodyRequest,
    @Headers("stripe-signature") signature?: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.rawBody ?? JSON.stringify(req.body), signature);
  }

  @Public()
  @Post("webhook/payoneer")
  @HttpCode(200)
  @ApiExcludeEndpoint()
  payoneerWebhook(
    @Req() req: RawBodyRequest,
    @Headers("x-payoneer-signature") signature?: string,
  ) {
    return this.paymentsService.handlePayoneerNotification(
      req.rawBody ?? JSON.stringify(req.body),
      signature,
      req.body,
    );
  }
}
