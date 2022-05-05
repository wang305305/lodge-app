import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  currentUser: any;
  constructor(
    private as: AuthService,
    private cookieService: CookieService,
    private router: Router,
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
      this.as.getUserProfile(this.cookieService.get('user')).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        console.log(res.body)
        this.as.setCurrentUser(res.body.user)
        this.currentUser = res.body.user
        //this.router.navigateByUrl('/');
      });;
    }
  }

  logout() {
    console.log(this.as.currentUser)
    this.as.logout()
  }

  toLodgeDetail(username: string) {
    // have to go to dummy route so the lodge detail reload when this func is called
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['lodgeDetail'], {
        queryParams: {
          owner: username
        }
      });
    });
  }
}
