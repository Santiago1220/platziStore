import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { switchMap } from 'rxjs/operators'
import { zip } from 'rxjs'
import { Product, createProductDTO, updateProductDTO } from 'src/app/models/product.model';
import { StoreService } from '../../../services/store.service'
import { ProductsService } from '../../../services/products.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @Input() products: Product[] = [];
  // @Input() productId: string | null = null;
  @Input() set productId(id: string | null){
    if(id) {
      this.onShowDetail(id);
    }
  }
  @Output() loadMore = new EventEmitter();
  myShoppingCart: Product[] = [];
  total = 0;
  today = new Date();
  date = new Date(2024, 1, 21);
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    title: '',
    price: 0,
    images: [],
    description: '',
    category: {
      id: '',
      name: ''
    }
  };

  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  // ngOnInit(): void {
  //   this.loadMore();
  // }

  onAddToShoppingCart(product:Product){
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productService.getProduct(id)
    .subscribe(data =>{
      this.productChosen = data;
      this.statusDetail = 'success';
    }, errorMessage => {
      window.alert(errorMessage);
      this.statusDetail = 'error';
    })
  }

  readAndUpdate(id: string) {
    this.productService.getProduct(id)
    .pipe(
      switchMap((product)=>{
        return this.productService.update(product.id, {title: 'change'})
      })
    )
    .subscribe(data => {
      console.log(data)
    });
    zip(
      this.productService.getProduct(id),
      this.productService.update(id, {title: 'change'}),
    )
    .subscribe(response =>{
      const read = response[0];
      const update = response[1];
    })
  }

  createNewProduct() {
    const product: createProductDTO = {
      title: 'Product',
      description: 'Lorem',
      images: ['https://placeimg.com/640/480/any'],
      price: 1000,
      categoryId: 1

    }
    this.productService.create(product)
    .subscribe(data =>{
      console.log('Creado', data);
      this.products.unshift(data);
    })
  }

  updateProduct(){
    const changes: updateProductDTO = {
      title: 'new title XD'
    }
    const id = this.productChosen.id;
    this.productService.update(id, changes)
    .subscribe(data =>{
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex]=data;
    })
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productService.delete(id)
    .subscribe(() =>{
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    })
  }

  OnLoadMore(){
    this.loadMore.emit();
  }

}
