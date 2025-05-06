import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient);

  getProducts(params: { productType: string; color: string }) {
    return this.http.get<any[]>('./data/products.json').pipe(
      map((response) => {
        if (params.productType === '' && params.color === '') {
          return response;
        }

        return response.filter(
          (item) =>
            item.productType === params.productType &&
            item.color === params.color
        );
      })
    ) as Observable<any[]>;
  }
}
