import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductsListComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
];
