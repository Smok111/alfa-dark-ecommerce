import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto } from './dto/stripe.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(userId: string, data: CreateCheckoutSessionDto) {
    try {
      const line_items = data.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        metadata: {
          userId,
        },
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      throw new InternalServerErrorException('Error creating checkout session');
    }
  }

  async handleWebhook(signature: string, body: Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // You would typically find the order and mark it as PAID here
      // const userId = session.metadata.userId;
    }

    return { received: true };
  }
}