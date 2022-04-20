import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Object | undefined;

  constructor(private http: HttpClient) { }

  api_url = environment.apiUrl

  get_welcome() {
    console.log(this.api_url)
    return this.http.get<any>(
      this.api_url
    ).pipe(
      catchError(this.handleError<any>('get_welcome', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  checkAuth(username: string, password: string) {
    console.log(username, password)
    console.log(this.api_url + '/login')
    return this.http.post(
      this.api_url + '/login',
      {
        "username": username,
        "password": password
      }
    ).pipe(
      catchError(this.handleError<any>('get_welcome', []))
    );
  //   .pipe(map(user => {
  //     console.log(user)
  //     // store user details and jwt token in local storage to keep user logged in between page refreshes
  //     localStorage.setItem('currentUser', JSON.stringify(user));
  //     this.currentUser = user;
  //     return user;
  // }));
  }

  register(body: any) {
    console.log(body)
    console.log(this.api_url + '/register')
    this.http.post(
      this.api_url + '/register',
      body
    ).pipe(map(user => {
      console.log(user)
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      return user;
  }));
  }
}
