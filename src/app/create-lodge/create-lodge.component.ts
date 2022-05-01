import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { LodgeService } from '../services/lodge.service';

@Component({
  selector: 'app-create-lodge',
  templateUrl: './create-lodge.component.html',
  styleUrls: ['./create-lodge.component.css']
})
export class CreateLodgeComponent implements OnInit {
  lodgeForm: any
  constructor(
    private formBuilder: FormBuilder,
    private ls: LodgeService,
    private as: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (!this.as.currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You need to login as a lodgeowner to access this page!',
      })
      this.router.navigateByUrl('/');
    }
    this.lodgeForm = this.formBuilder.group({
      lodgeName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      municipality: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      flyIn: [false]
    });
  }
  
  onSubmit() {
    console.log(this.lodgeForm)
    let body = this.lodgeForm.value
    body.owner = this.as.currentUser?.username
    this.ls.createlodge(this.lodgeForm.value)
  }
}
