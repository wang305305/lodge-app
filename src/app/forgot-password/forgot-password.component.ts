import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: any;
  obtainTokenForm: any;
  showTokenText: boolean | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private as: AuthService,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.obtainTokenForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
    this.forgotForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      resetToken: ['', Validators.required],
    });
    this.showTokenText = false
  }


  obtainToken() {
    this.as.obtainToken(this.obtainTokenForm.controls.username.value).subscribe((res: HttpResponse<any>) => {
      // this api call is structured like: res.body.user.username
      console.log('response from server:', res);
      if (res.ok) {
        this.showTokenText = true
      } else {
        console.log(res)
        Swal.fire({
          icon: 'error',
          title: 'Failed to obtain token'
        })
      }
    });;
  }

  onSubmitNewPassword() {
    if (this.forgotForm.controls.password.value != this.forgotForm.controls.repeatPassword.value) {
      Swal.fire({
        icon: 'error',
        title: 'New passwords does not match'
      })
      return
    }
    let body = {
      username: this.forgotForm.controls.username.value,
      password: this.forgotForm.controls.password.value,
      token: this.forgotForm.controls.resetToken.value,
    }
    console.log(body)
    this.as.submitNewPassword(body).subscribe((res: HttpResponse<any>) => {
      // this api call is structured like: res.body.user.username
      console.log('response from server:', res);
      if (res.ok) {
        Swal.fire("Success!", "Update Password Successful! Please login with your new password", "success");
        this.router.navigateByUrl('/login');
      } else {
        console.log(res)
        Swal.fire({
          icon: 'error',
          title: 'Failed to submit new password'
        })
      }
    });;
  }

}
