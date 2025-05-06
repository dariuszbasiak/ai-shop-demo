import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { ProductsService } from '../service/products.service';
import { Router } from '@angular/router';

interface SearchParams {
  productType: 't-shirt' | 'jacket' | 'trousers';
  color: string;
}
@Component({
  selector: 'app-product-filters',
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
})
export class ProductFiltersComponent {
  @Input() params = {
    productType: '',
    color: '',
  };
  route = inject(Router);
  productsService = inject(ProductsService);
  colors = ['red', 'green', 'blue'];

  formGroup = new FormGroup({
    productType: new FormControl(''),
    color: new FormControl(''),
  });

  ngOnInit() {
    if (this.params.productType) {
      this.formGroup.controls.productType.setValue(this.params.productType);
    }
    if (this.params.color) {
      this.formGroup.controls.color.setValue(this.params.color);
    }
  }

  searchProduct() {
    console.log(this.formGroup.value);

    this.route.navigate(['/products'], {
      queryParams: {
        ...this.formGroup.value,
      },
    });
  }
}
