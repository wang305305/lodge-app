import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Object | undefined;

  constructor(private http: HttpClient) { }

  api_url = environment.apiUrl

  // get_welcome() {
  //   console.log(this.api_url)
  //   this.http.get(
  //     this.api_url
  //   ).pipe(map(mes => {
  //     console.log(mes)
  //     // store user details and jwt token in local storage to keep user logged in between page refreshes

  //     return ;
  // }));
  // }

  checkAuth(username: string, password: string) {
    console.log(username, password)
    console.log(this.api_url + '/login')
    this.http.post(
      this.api_url + '/login',
      {
        "username": username,
        "password": password
      }
    ).pipe(map(user => {
      console.log(user)
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      return user;
  }));
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
