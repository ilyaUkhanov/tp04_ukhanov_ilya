import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IProductFromServer} from "../types/products";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductsRepositoryService {
  constructor(private http: HttpClient) { }

  async getData(): Promise<Observable<IProductFromServer[]>> {
    try {
      // @ts-ignore
      return this.http.get('../assets/mock/mock-products.json');
    } catch (error) {
      return Promise.reject();
    }
  }

}
