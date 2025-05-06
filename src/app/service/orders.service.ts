import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OrderDocument } from '../model/order-document.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  http = inject(HttpClient);

  getOrders() {
    return this.http.get<OrderDocument[]>('./data/orders.json');
  }
}
