import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: any;

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
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      lodgeOwner: [false],
      firstName: [''],
      lastName: ['']
    });
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
    this.as.register(body)
  }

}
