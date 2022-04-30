import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LodgeService {

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

  api_url = environment.apiUrl

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      Swal.fire(operation + " Failed", error.error.message, "error")
      return of(result as T);
    };
  }

  createlodge(body: any) {
    console.log(body)
    console.log(this.api_url + '/createLodge')
    return this.http.post(
      this.api_url + '/createLodge',
      body,
      {withCredentials : true, observe: 'response' as 'response'}
    ).pipe(
      catchError(this.handleError<any>('create lodge', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      console.log(res.body)
      if (res.ok) {
      Swal.fire("Success!", "Lodge created", "success");
      this.router.navigateByUrl('/');
      } else {
        console.log(res)
      }
    });
  }
}
