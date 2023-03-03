import { Injectable } from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {ProductsRepositoryService} from "../services/products-repository.service";
import {AddProductAction, IAddProductAction} from "../actions/addProduct.actions";
import {IProduct} from "../types/products";
import {IRemoveProductAction, RemoveProductAction} from "../actions/removeProduct.actions";

export type IProductState = {
  products: IProduct[];
};

@State<IProductState>({
  name: 'products',
  defaults: { products: [] }
})
@Injectable()
export class ProductState {
  constructor(private productsRepositoryService: ProductsRepositoryService) {}

  @Action(AddProductAction)
  addProduct(context: StateContext<IProductState>, action: IAddProductAction) {
    const state = context.getState();
    context.setState({
      ...state,
      products: [
        ...state.products,
        action.product
      ]
    });
  }

  @Action(RemoveProductAction)
  removeProduct(context: StateContext<IProductState>, action: IRemoveProductAction) {
    const state = context.getState();
    context.setState({
      ...state,
      products: [
        ...state.products.filter(prod => prod.value !== action.product.value),
      ]
    });
  }
}
