import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { ConnectableObservable, Observable, of, Subject } from 'rxjs';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LodgeService } from './lodge.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: any | undefined;
  public isLoggedIn = new Subject();


  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private ls: LodgeService,
  ) {
  }

  api_url = environment.apiUrl

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      Swal.fire(operation + " Failed", error.error.message, "error")
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
    queryParams = queryParams.append("username", username);
    console.log(queryParams)
    return this.http.get(
      this.api_url + '/getUserProfile',
      { params: queryParams, withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('get user profile', []))
    )
  }

  updateUserProfile(data: any) {
    return this.http.post(
      this.api_url + '/updateUserProfile',
      {
        "username": data.username,
        "firstName": data.firstName,
        "lastName": data.lastName
      },
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('update user profile', []))
    )
  }

  checkAuth(username: string, password: string, rememberme: boolean) {
    console.log(username, password, rememberme)
    console.log(this.api_url + '/login')
    return this.http.post(
      this.api_url + '/login',
      {
        "username": username,
        "password": password
      },
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('Login', []))
    ).subscribe((res: HttpResponse<any>) => {
      // this api call is structured like: res.body.user.username
      console.log('response from server:', res);
      if (res.ok) {
        this.setCurrentUser(res.body)
        // this.cookieService.set('user', res.body.user.username);
        // this.cookieService.set('token', res.body.token);
        this.setToSession('user', res.body.user.username, 5)
        this.setToSession('token', res.body.token, 5)
        this.isLoggedIn.next(true)
        if (rememberme) {
          this.cookieService.set('user', res.body.user.username);
        } else {
          this.cookieService.delete('user');
        }
        Swal.fire("Welcome!", "Login Successful!", "success");
        if (res.body.user.lodgeOwner) {
          console.log("yes, this is a lodge owner")
          this.ls.getLodges({ owner: res.body.user.username }).subscribe((response: HttpResponse<any>) => {
            console.log('response from server:', response);
            if (response.status == 400 || response.body.lodges.length == 0) {
              console.log("no lodge found for this owner")
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigateByUrl('/createLodge');
              });
            } else {
              console.log("navigate to this owner's lodge")
              console.log(res.body)
              this.router.navigate(['lodgeDetail'], {
                queryParams: {
                  owner: res.body.user.username
                }
              });
            }
          });
        } else {
          this.router.navigateByUrl('/');
        }
      } else {
        console.log(res)
      }

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
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('register', []))
    ).subscribe((res: HttpResponse<any>) => {
      // this api call is structured like: res.body.username
      console.log('response from server:', res);
      console.log(res.body)
      if (res.ok) {
        this.setCurrentUser(res.body.user)
        // this.cookieService.set('user', res.body.user.username);
        // this.cookieService.set('token', res.body.token);
        this.setToSession('user', res.body.user.username, 5)
        this.setToSession('token', res.body.token, 5)
        this.isLoggedIn.next(true)
        Swal.fire("Welcome!", "Register Successful!", "success");
        if (res.body.user.lodgeOwner) {
          console.log("yes, this is a lodge owner")
          this.ls.getLodges({ owner: res.body.user.username }).subscribe((response: HttpResponse<any>) => {
            console.log('response from server:', response);
            if (response.status == 400 || response.body.lodges.length == 0) {
              console.log("no lodge found for this owner")
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigateByUrl('/createLodge');
              });
            } else {
              console.log("navigate to this owner's lodge")
              console.log(res.body)
              this.router.navigate(['lodgeDetail'], {
                queryParams: {
                  owner: res.body.username
                }
              });
            }
          });
        } else {
          this.router.navigateByUrl('/');
        }        
      } else {
        console.error(res)
      }
    });
  }

  logout() {
    console.log(this.api_url + '/logout')
    return this.http.post(
      this.api_url + '/logout',
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError<any>('log out', []))
    ).subscribe((res: HttpResponse<any>) => {
      console.log(res)
      if (res) {
        console.log('response from server:', res);
        this.setCurrentUser(undefined)
        this.isLoggedIn.next(false)
        // this.cookieService.delete('token');
        // this.cookieService.delete('user');
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
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

  setToSession(key: string, value: any, lifespan: any) {
    let expiredAt = new Date().getTime() + (60000 * lifespan); // lifespan in min
    let obj = {
      value: value,
      expiredAt: expiredAt
    }
    sessionStorage.setItem(key, JSON.stringify(obj));
  }

  obtainToken(username: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("username", username);
    return this.http.get(
      this.api_url + '/passwordReset',
      { params: queryParams, withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('passwordReset', []))
    )
  }

  submitNewPassword(body: any) {
    return this.http.patch(
      this.api_url + '/updatePassword',
      body,
      { withCredentials: true, observe: 'response' as 'response' }
    ).pipe(
      catchError(this.handleError<any>('updatePassword', []))
    )
  }
}
