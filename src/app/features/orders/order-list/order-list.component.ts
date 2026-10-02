import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;

    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;

        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load orders', error);

        this.loading = false;
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-700';

      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';

      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';

      case 'DELIVERED':
        return 'bg-green-100 text-green-700';

      case 'CANCELLED':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
