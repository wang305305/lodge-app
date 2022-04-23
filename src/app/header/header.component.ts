import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: any;
  public jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(
    private as: AuthService,
    private cookieService: CookieService,
    ) {
  }

  ngOnInit(): void {

    this.as.isLoggedIn.subscribe(res => this.loggedIn = res);

    if (this.jwtHelper.isTokenExpired(document.cookie.slice(6,))) {
      console.log("token expired")
    } else {
      console.log("token valid")
      this.as.isLoggedIn.next(true)
      console.log(this.cookieService.get('user'));
      this.as.getUserProfile(this.cookieService.get('user'))
    }
  }

  logout() {
    console.log(this.as.currentUser)
    this.as.logout()
  }

}
