import { Component, Input, OnInit  } from '@angular/core';
import {ProductsRepositoryService} from '../../services/products-repository.service'
import {FilterService} from "../../services/filter.service";
import {IProduct, IProductFromServer} from "../../types/products";
import {Select, Store} from "@ngxs/store";
import {CONVERTER_PRODUCTS} from "../../converters/products-converter";
import {AddProductAction} from "../../actions/addProduct.actions";
import {ProductState} from "../../state/product.state";
import {Observable, withLatestFrom} from "rxjs";

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  @Select(ProductState) products: Observable<IProduct[]>;

  isLoadingProducts: boolean = false;
  constructor(private httpService: ProductsRepositoryService, private filterService: FilterService, private store: Store) {}
  title = 'TP3';
  ngOnInit() {
    this.isLoadingProducts = true;

    this.httpService.getData().then((productsFromServer: IProductFromServer[])=>{
      productsFromServer.map((productFromServer: IProductFromServer)=>{
        this.store.dispatch(new AddProductAction(CONVERTER_PRODUCTS.serverToApp(productFromServer)))
      })
    }).then(()=>{
      this.isLoadingProducts = false;
    })

    this.products.subscribe(() => this.form.reset());
  }

  addProduct(product: IProduct) {
    this.store
      .dispatch(new AddProductAction(product))
      // @ts-ignore
      .pipe(withLatestFrom(this.products))
      .subscribe(([_, products]) => {
        console.log("products", products);
      });
  }

  // getFilteredProducts() {
  //   return (this.products ?? []).filter(product =>
  //     (product.price <= this.filterService.filterPrice || this.filterService.filterPrice === 0) &&
  //     (product.title.toLowerCase().includes(this.filterService.filterName.toLowerCase()) || this.filterService.filterName === "")
  //   )
  // }

  filter() {

  }
}
