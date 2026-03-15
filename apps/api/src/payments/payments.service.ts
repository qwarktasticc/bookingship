import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2024-04-10',
  });

  createPaymentIntent(amountCents: number, metadata: Record<string, string>) {
    return this.stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata,
    });
  }

  refundPayment(paymentIntentId: string, amountCents?: number) {
    return this.stripe.refunds.create({ payment_intent: paymentIntentId, amount: amountCents });
  }
}
