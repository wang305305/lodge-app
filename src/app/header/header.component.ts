import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: any;
  constructor(private as: AuthService) {
  }

  ngOnInit(): void {
    this.as.isLoggedIn.subscribe(res => this.loggedIn = res);
  }

  logout() {
    this.as.logout()
  }

}
