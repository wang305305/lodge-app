import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  api_url = environment.apiUrl

  constructor(
    private http: HttpClient,
  ) { }

  getProfileImage(username: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("username",username);
    console.log(queryParams)
    return this.http.get(
      this.api_url + '/getProfileImage',
      {params : queryParams, withCredentials : true, observe: 'response' as 'response'}
    ).pipe(
      catchError(this.handleError<any>('get profile image', []))
    )
  }
  
  uploadProfileImage(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      withCredentials: true,
      observe: 'response' as 'response'
    };
    console.log(data)
    return this.http.post(
      this.api_url + '/uploadProfileImage',

      data,
      httpOptions
    ).pipe(
      catchError(this.handleError<any>('update user profile', []))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      Swal.fire(operation + " Failed", error.error.message, "error")
      return of(result as T);
    };
  }

}
