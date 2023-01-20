import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http'
import { catchError, retry, map } from 'rxjs/operators'
import { throwError } from 'rxjs'
import { Product, createProductDTO, updateProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';
import { checkTime } from '../interceptors/time.interceptor'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api`
  constructor(
    private http: HttpClient
  ) { }

  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, { params })
  }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {params, context: checkTime() })
    .pipe(
      retry(3)
    );
  }

  getProduct(id:string){
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status === HttpStatusCode.InternalServerError) {
          return throwError('Algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas autorizado');
        }
        return throwError('Ups algo salió mal');
      })
    )
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`,{
      params: { limit, offset}
    })
    .pipe(
      map(products => products.map(item =>{
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    )
    }

    getOne(id: string) {
      return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.InternalServerError) {
            return throwError('Algo esta fallando en el server');
          }
          if (error.status === HttpStatusCode.NotFound) {
            return throwError('El producto no existe');
          }
          if (error.status === HttpStatusCode.Unauthorized) {
            return throwError('No estas permitido');
          }
          return throwError('Ups algo salio mal');
        })
      )
    }

  create(dto: createProductDTO){
    return this.http.post<Product>(`${this.apiUrl}/products/`,dto);
  }

  update(id: string, dto: updateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
