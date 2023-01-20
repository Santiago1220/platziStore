import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  limit = 10;
  offset = 0;
  products: Product[] = [];
  productId: string | null = null;
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts(this.limit, this.offset)
    .subscribe(data =>{
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
    this.route.queryParamMap.subscribe(params =>{
      this.productId = params.get('product');
      console.log(this.productId)
    })
  }

  onLoadMore() {
    this.productService.getProductsByPage(this.limit, this.offset)
    .subscribe(data =>{
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
