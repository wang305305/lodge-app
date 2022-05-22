import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private http: HttpClient
  ) { }
  
  api_url = environment.apiUrl

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      Swal.fire(operation + " Failed", error.error.message, "error")
      return of(result as T);
    };
  }

  addToWishList(lodgeName: any, username: any) {
    console.log(lodgeName, username)
    let body = {"lodgeName": lodgeName, "username": username}
    return this.http.post(
      this.api_url + '/addToWishList',
      body,
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('addToWishList', []))
    )
  }

  removeFromWishList(lodgeName: any, username: any) {
    console.log(lodgeName, username)
    let body = {"lodgeName": lodgeName, "username": username}
    return this.http.post(
      this.api_url + '/deleteFromWishList',
      body,
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('removeFromWishList', []))
    )
  }

  isLodgeInWishList(lodgeName: any, username: any) {
    console.log(lodgeName, username)
    let body = {"lodgeName": lodgeName, "username": username}
    return this.http.post(
      this.api_url + '/isLodgeInWishList',
      body,
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('isLodgeInWishList', []))
    )
  }
}
