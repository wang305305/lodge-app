import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient,) { }
  
  api_url = environment.apiUrl

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      Swal.fire(operation + " Failed", error.error.message, "error")
      return of(result as T);
    };
  }

  reservePayment(username: any) {
    console.log("reservePayment request")
    let body = {"username": username}
    return this.http.post(
      this.api_url + '/reservePayment',
      body,
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('reservePayment', []))
    )
  }

  
}
