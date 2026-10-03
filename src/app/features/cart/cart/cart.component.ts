import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { Cart, CartItem } from '../../../core/models/cart';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import {
  CreatePaymentOrderResponse,
  PaymentService,
  VerifyPaymentRequest,
} from '../../../core/services/payment.service';
import { Order } from '../../../core/models/order';
import { timeout, catchError, throwError } from 'rxjs';

declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);

  cart: Cart | null = null;

  loading = true;
  updatingProductId: number | null = null;
  clearingCart = false;
  checkingOut = false;
  isPaymentProcessing = false;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;

        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load cart', error);

        this.loading = false;
      },
    });
  }

  increase(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    if (item.quantity <= 1) {
      return;
    }

    this.updateQuantity(item, item.quantity - 1);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      return;
    }

    this.updatingProductId = item.productId;

    this.cartService.updateQuantity(item.productId, quantity).subscribe({
      next: (cart) => {
        this.cart = cart;

        this.updatingProductId = null;
      },

      error: (error) => {
        console.error('Failed to update quantity', error);

        this.updatingProductId = null;
      },
    });
  }

  removeItem(item: CartItem): void {
    this.updatingProductId = item.productId;

    this.cartService.removeItem(item.productId).subscribe({
      next: (cart) => {
        this.cart = cart;

        this.updatingProductId = null;
      },

      error: (error) => {
        console.error('Failed to remove item', error);

        this.updatingProductId = null;
      },
    });
    this.loadCart();
  }

  clearCart(): void {
    this.clearingCart = true;

    this.cartService.clearCart().subscribe({
      next: (cart) => {
        this.cart = null;

        this.clearingCart = false;
      },

      error: (error) => {
        console.error('Failed to clear cart', error);

        this.clearingCart = false;
      },
    });
    this.loadCart();
  }

  // checkout(): void {
  //   if (!this.cart || this.cart.items.length === 0) {
  //     return;
  //   }

  //   this.checkingOut = true;

  //   this.orderService.checkout().subscribe({
  //     next: (order) => {
  //       console.log('Order created:', order);

  //       this.checkingOut = false;

  //       this.router.navigate(['/orders']);
  //     },

  //     error: (error) => {
  //       console.error('Checkout failed', error);

  //       this.checkingOut = false;
  //     },
  //   });
  // }

  payNow(): void {
    this.paymentService.createPaymentOrder().subscribe({
      next: (response) => {
        console.log('Payment order:', response);

        this.openRazorpayCheckout(response);
      },

      error: (error) => {
        console.error('Unable to create payment order', error);
      },
    });
  }

  openRazorpayCheckout(response: CreatePaymentOrderResponse): void {
    const options: any = {
      key: response.keyId,

      amount: response.amount * 100,

      currency: 'INR',

      name: 'GardenCare',

      description: 'GardenCare Order',

      order_id: response.razorpayOrderId,

      handler: (paymentResponse: any) => {
        console.log('Razorpay payment response:', paymentResponse);

        this.verifyPayment(response.orderId, paymentResponse);
      },

      prefill: {
        name: 'user',
        email: 'user@gmail.com',
        contact: '1234567890',
      },

      theme: {
        color: '#3399cc',
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.open();
  }

  verifyPayment(orderId: number, response: any): void {
    const request: VerifyPaymentRequest = {
      orderId: orderId,

      razorpayOrderId: response.razorpay_order_id,

      razorpayPaymentId: response.razorpay_payment_id,

      razorpaySignature: response.razorpay_signature,
    };

    this.paymentService.verifyPayment(request).subscribe({
      next: (message) => {
        console.log('Payment verified:', message);

        alert('Payment successful!');

        this.router.navigate(['/orders']);

        // Reload cart/orders
        this.loadCart();
      },

      error: (error) => {
        console.error('Payment verification failed:', error);

        alert('Payment verification failed.');
      },
    });
  }
}
