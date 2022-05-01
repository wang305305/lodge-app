import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
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
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('create lodge', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      console.log(res.body)
      if (res.ok) {
        Swal.fire("Success!", "Lodge created", "success");
        this.router.navigate(['lodgeDetail'], {
          queryParams: {
            owner: res.body.owner
          }
        });
      } else {
        console.log(res)
      }
    });
  }

  getLodgeByName(lodgeName: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("lodgeName", lodgeName);
    console.log(queryParams)
    return this.http.get(
      this.api_url + '/getLodgeByName',
      { params: queryParams, withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('getLodgeByName', []))
    )
  }

  getLodgeByOwner(owner: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("owner", owner);
    console.log(queryParams)
    return this.http.get(
      this.api_url + '/getLodgeByOwner',
      { params: queryParams, withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('getLodgeByOwner', []))
    )
  }

  // updateUserProfile(data: any) {
  //   return this.http.post(
  //     this.api_url + '/updateUserProfile',
  //     {
  //       "username": data.username,
  //       "firstName": data.firstName,
  //       "lastName": data.lastName
  //     },
  //     {withCredentials : true, observe: 'response' as 'response'}
  //   ).pipe(
  //     catchError(this.handleError<any>('update user profile', []))
  //   )
  // }

}
