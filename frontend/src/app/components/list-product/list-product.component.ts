import { Component, Input, OnInit  } from '@angular/core';
import {ProductsRepositoryService} from '../../services/products-repository.service'
import {FilterService} from "../../services/filter.service";
import {IProduct, IProductFromServer} from "../../types/products";
import {Select, Store} from "@ngxs/store";
import {CONVERTER_PRODUCTS} from "../../converters/products-converter";
import {AddProductAction} from "../../actions/addProduct.actions";
import {ProductState} from "../../state/product.state";
import {Observable, withLatestFrom} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RemoveProductAction} from "../../actions/removeProduct.actions";

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {

  // @ts-ignore
  @Select(ProductState) products: Observable<IProduct[]>;
  filteredProducts: IProduct[] = [];

  public ProductFormIdentification!: FormGroup;

  isLoadingProducts: boolean = false;
  constructor(private formBuilder: FormBuilder,
              private httpService: ProductsRepositoryService,
              private filterService: FilterService,
              private store: Store) {}
  title = 'TP3';
  ngOnInit() {
    this.ProductFormIdentification = this.formBuilder.group({
      label: ['',Validators.required],
      price: ['',Validators.required]
    });

    this.isLoadingProducts = true;
    this.httpService.getData().then((productsFromServer: Observable<IProductFromServer[]>) => {
      productsFromServer
        .pipe()
        .subscribe((products) => {
          const convertedProducts = products.map(prod => CONVERTER_PRODUCTS.serverToApp(prod));
          convertedProducts.map((product) => {
            this.store.dispatch(new AddProductAction(product));
          })

          this.filteredProducts = this.getFilteredProducts(convertedProducts);
        });

    }).then(()=>{
      this.isLoadingProducts = false;
    })

    this.products.subscribe(() => {});
  }

  submitAddProduct() {
    const product = {
      title: this.ProductFormIdentification.get('label')?.value ?? "",
      price: this.ProductFormIdentification.get('price')?.value ?? 0,
    };
    this.addProduct(product);
  }
  submitRemoveProduct(product: IProduct) {
    this.removeProduct(product);
  }

  addProduct(product: IProduct) {
    this.store
      .dispatch(new AddProductAction(product))
      // @ts-ignore
      .pipe(withLatestFrom(this.products))
      .subscribe(([_, products]) => {
        // @ts-ignore
        this.filteredProducts = products.products;
      });
  }

  removeProduct(product: IProduct) {
    this.store
      .dispatch(new RemoveProductAction(product))
      // @ts-ignore
      .pipe(withLatestFrom(this.products))
      .subscribe(([_, products]) => {
        // @ts-ignore
        this.filteredProducts = products.products;
      });
  }

  getFilteredProducts(products: IProduct[]) {
    return products.filter(product =>
      (product.price <= this.filterService.filterPrice || this.filterService.filterPrice === 0) &&
      (product.title.toLowerCase().includes(this.filterService.filterName.toLowerCase()) || this.filterService.filterName === "")
    )
  }

  filter() {

  }
}
