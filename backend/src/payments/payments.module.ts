import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { StripeProvider } from "./providers/stripe.provider";
import { PayoneerProvider } from "./providers/payoneer.provider";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeProvider, PayoneerProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
