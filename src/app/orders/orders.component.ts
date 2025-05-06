import { Component, inject } from '@angular/core';
import { OrderItemComponent } from '../order-item/order-item.component';
import { OrderDocument } from '../model/order-document.interface';
import { OrdersService } from '../service/orders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [OrderItemComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  route = inject(ActivatedRoute);
  ordersService = inject(OrdersService);
  orders: OrderDocument[] = [];
  selectedOrderId: string | null = '';
  ngOnInit() {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });

    this.route.queryParamMap.subscribe((params) => {
      if (params.has('orderId')) {
        this.selectedOrderId = params.get('orderId');
      }
    });
  }
}
