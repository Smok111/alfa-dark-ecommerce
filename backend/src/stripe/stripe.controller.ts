import { Controller, Post, Body, Headers, Req, UseGuards, Request, RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/stripe.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';


@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCheckoutSession(@Request() req, @Body() data: CreateCheckoutSessionDto) {
    return this.stripeService.createCheckoutSession(req.user.id, data);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.stripeService.handleWebhook(signature, req.rawBody);
  }
}