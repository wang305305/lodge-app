import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: any;
  strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
  mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
  passwordStrength: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private as: AuthService
  ) {

    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }
  ngOnInit(): void {
    this.passwordStrength = ''
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      lodgeOwner: [false],
      firstName: [''],
      lastName: ['']
    });
    if (this.as.currentUser) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    console.log("onsubmit")
    console.log(this.registerForm.controls)
    let body = {
      "username": this.registerForm.controls.username.value,
      "password": this.registerForm.controls.password.value,
      "email": this.registerForm.controls.email.value,
      "lodgeOwner": this.registerForm.controls.lodgeOwner.value,
      "firstName": this.registerForm.controls.firstName.value,
      "lastName": this.registerForm.controls.lastName.value,
    }
    console.log(body)
    this.as.register(body)
  }

  onType(event: any) {
    let inputData = event.target.value;

    if (inputData.length >= 1) {

        if (this.strongPassword.test(inputData)) {
          this.passwordStrength = "strong"
        } else if (this.mediumPassword.test(inputData)) {
          this.passwordStrength = "medium"
        } else {
          this.passwordStrength = "weak"
        }

    }
  }

}
