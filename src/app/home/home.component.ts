import { Component, HostListener, OnInit } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    ) { }

  ngOnInit(): void {
  }



}
