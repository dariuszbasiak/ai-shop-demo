import { Component, inject } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductFiltersComponent } from '../product-filters/product-filters.component';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { WorkerService } from '../service/worker.service';

@Component({
  selector: 'app-products-list',
  imports: [
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    ProductCardComponent,
    ProductFiltersComponent,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  worker = inject(WorkerService).worker;
  colors = ['red', 'green', 'blue'];
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);
  productList: any[] = [];

  params: any = {
    productType: '',
    color: '',
  };

  ngOnInit() {
    this.route.queryParamMap.subscribe((value) => {
      console.log('on sub', value);

      if (value.has('productType')) {
        this.params.productType = value.get('productType');
      }
      if (value.has('color')) {
        const color = this.colors.includes(value.get('color') ?? '')
          ? value.get('color')
          : 'other';
        this.params.color = color;
      }

      this.getProducts(value.has('summarize'));
    });
  }

  getProducts(summarize: boolean) {
    this.productsService.getProducts(this.params).subscribe((v: any[]) => {
      this.productList = v;

      if (summarize) {
        this.worker.postMessage({
          type: 'summarize',
          data: 'Summarize found items' + JSON.stringify(v),
        });
      }
    });
  }
}
