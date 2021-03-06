import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private as: AuthService,
    private cookieService: CookieService,
  ) {
    if (this.as.currentUser) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.cookieService.get('user'), Validators.required],
      password: ['', Validators.required],
      rememberme: [false],
    });

  }

  onSubmit(): void {
    this.as.checkAuth(this.loginForm.controls.username.value, this.loginForm.controls.password.value, this.loginForm.controls.rememberme.value)
    // this.as.get_welcome().subscribe( data => console.log(data));
  }

}
