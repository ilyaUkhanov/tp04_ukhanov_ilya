import { Component, Input, OnInit  } from '@angular/core';
import {ProductsRepositoryService} from '../../services/products-repository.service'
import {FilterService} from "../../services/filter.service";
import {IProduct, IProductFromServer} from "../../types/products";
import {Actions, ofActionDispatched, Select, Store} from "@ngxs/store";
import {AddProductAction} from "../../actions/addProduct.actions";
import {IProductState, ProductState} from "../../state/product.state";
import {Observable, withLatestFrom} from "rxjs";
import {RemoveProductAction} from "../../actions/removeProduct.actions";
import {AddProductPanierAction} from "../../actions/addProductPanier.actions";
import {RemoveProductPanierAction} from "../../actions/removeProductPanier.actions";

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  @Select((state: IProductState) => state.panierProducts) panierProducts!: Observable<IProduct[]>;
  products: IProduct[] = [];

  constructor(private actions: Actions,
              private httpService: ProductsRepositoryService,
              private filterService: FilterService,
              private store: Store) {}
  ngOnInit() {
    this.actions
      .pipe(ofActionDispatched(AddProductPanierAction))
      .subscribe((products) => {
        console.log("CHANGE PANIER PRODS", products);
        const store = this.store.selectSnapshot(ProductState);
        this.products = store.panierProducts;
      });

    this.actions
      .pipe(ofActionDispatched(RemoveProductPanierAction))
      .subscribe((products) => {
        console.log("CHANGE PANIER PRODS", products);
        const store = this.store.selectSnapshot(ProductState);
        this.products = store.panierProducts;
      });
  }

  submitRemoveProduct(product: IProduct) {
    this.removeProduct(product);
  }

  removeProduct(product: IProduct) {
    this.store
      .dispatch(new RemoveProductPanierAction(product))
      // @ts-ignore
      .pipe(withLatestFrom(this.products))
      .subscribe(([_, products]) => {
        // @ts-ignore
        this.filteredProducts = products.products;
      });
  }
}
