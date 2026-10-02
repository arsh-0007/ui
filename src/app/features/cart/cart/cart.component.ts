import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { Cart, CartItem } from '../../../core/models/cart';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
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

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      return;
    }

    this.checkingOut = true;

    this.orderService.checkout().subscribe({
      next: (order) => {
        this.checkingOut = false;

        this.openRazorpayCheckout(order);
      },

      error: (error) => {
        console.error('Checkout failed', error);

        this.checkingOut = false;
      },
    });
  }

  openRazorpayCheckout(order: Order): void {
    this.paymentService.createPaymentOrder(order.orderId).subscribe({
      next: (paymentOrder) => {
        const options = {
          key: paymentOrder.keyId,

          amount: paymentOrder.amount * 100,

          currency: paymentOrder.currency,

          name: 'GardenCare',

          description: `GardenCare Order #${order.orderId}`,

          order_id: paymentOrder.razorpayOrderId,

          handler: (response: any) => {
            this.verifyPayment(order.orderId, response);
          },

          prefill: {
            name: '',
            email: '',
          },

          theme: {
            color: '#16a34a',
          },
        };

        const razorpay = new Razorpay(options);

        razorpay.open();
      },

      error: (error) => {
        console.error('Failed to create Razorpay order', error);

        this.checkingOut = false;
      },
    });
  }

  verifyPayment(orderId: number, response: any): void {
    this.paymentService
      .verifyPayment({
        orderId: orderId,

        razorpayOrderId: response.razorpay_order_id,

        razorpayPaymentId: response.razorpay_payment_id,

        razorpaySignature: response.razorpay_signature,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/orders', orderId]);
        },

        error: (error) => {
          console.error('Payment verification failed', error);
        },
      });
  }
}
