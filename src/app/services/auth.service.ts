import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Object | undefined;
  public isLoggedIn = new Subject();


  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    ) { }

  api_url = environment.apiUrl

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      Swal.fire(operation + " Failed", error.error, "error")
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  get_welcome() {
    console.log(this.api_url)
    return this.http.get<any>(
      this.api_url
    ).pipe(
      catchError(this.handleError<any>('Get Welcome', []))
    );
  }

  getUserProfile(username: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("username",username);
    return this.http.get(
      this.api_url + '/getUserProfile',
      {params : queryParams, withCredentials : true, observe: 'response' as 'response'}
    ).pipe(
      catchError(this.handleError<any>('get user profile', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      console.log(res.body)
      this.setCurrentUser(res.body.user)

      //this.router.navigateByUrl('/');
    });;
  }

  checkAuth(username: string, password: string) {
    console.log(username, password)
    console.log(this.api_url + '/login')
    return this.http.post(
      this.api_url + '/login',
      {
        "username": username,
        "password": password
      },
      {withCredentials : true, observe: 'response' as 'response'}
    ).pipe(
      catchError(this.handleError<any>('Login', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      this.setCurrentUser(res.body.user)
      this.cookieService.set( 'user', res.body.user.username );
      this.isLoggedIn.next(true)
      Swal.fire("Welcome!", "Login Successful!", "success");
      this.router.navigateByUrl('/');
    });;
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
    return this.http.post(
      this.api_url + '/register',
      body,
      {withCredentials : true, observe: 'response' as 'response'}
    ).pipe(
      catchError(this.handleError<any>('register', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      this.setCurrentUser(res.body.user)
      this.cookieService.set( 'user', res.body.user.username );
      this.isLoggedIn.next(true)
      Swal.fire("Welcome!", "Register Successful!", "success");
      this.router.navigateByUrl('/');
    });
  }

  logout() {
    console.log(this.api_url + '/logout')
    return this.http.post(
      this.api_url + '/logout',
      {withCredentials : true}
    ).pipe(
      catchError(this.handleError<any>('log out', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log(res)
      if (res) {
        console.log('response from server:', res);
        this.setCurrentUser(undefined)
        this.isLoggedIn.next(false)
        this.cookieService.delete('token');
        this.cookieService.delete('user');
        Swal.fire("Bye", "Logged out!", "success");
        this.router.navigateByUrl('/');
      } else {
        Swal.fire("Failed to logout", "error")
      }
    });
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }
}
