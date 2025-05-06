import { Component, Input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderDocument } from '../model/order-document.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-order-item',
  imports: [MatExpansionModule, CurrencyPipe, DatePipe],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent {
  @Input() expanded = false;
  @Input({ required: true }) order: OrderDocument | null = null;
  readonly panelOpenState = signal(false);
}
