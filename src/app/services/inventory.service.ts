import { Injectable } from '@angular/core';
import { Product } from '../modal/product';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
    products:Product []=[];
   baseUri: string = 'http://localhost:3000/product';
   headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Add Product
  addProduct(data: Product): Observable<any> {
    let url = `${this.baseUri}/add`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  // Get all product
  getProducts():Observable<any> {
    return this.http.get(`${this.baseUri}`);
  }

  // Get product
  getProduct(id:number): Observable<any> {
    let url = `${this.baseUri}/get/${id}`;
    return this.http.get(url, {headers: this.headers});
  }

  // Get product
  getProductsByCategory(category:string): Observable<any> {
    let url = `${this.baseUri}/get/category/${category}`;
    return this.http.get(url, {headers: this.headers});
  }

  // Update employee
  updateProduct(id:number, data:Product): Observable<any> {
    let url = `${this.baseUri}/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete employee
  deleteProduct(id:number): Observable<any> {
    let url = `${this.baseUri}/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }



  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
