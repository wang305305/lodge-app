import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { LodgeService } from '../services/lodge.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-lodge',
  templateUrl: './create-lodge.component.html',
  styleUrls: ['./create-lodge.component.css']
})
export class CreateLodgeComponent implements OnInit {
  lodgeForm: any
  sessionUser: any;
  constructor(
    private formBuilder: FormBuilder,
    private ls: LodgeService,
    private as: AuthService,
    private router: Router,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.sessionUser = sessionStorage.getItem('user')
    if (!this.sessionUser) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You need to login to access this page!',
      })
      this.router.navigateByUrl('/');
    } else {
      this.as.getUserProfile(JSON.parse(this.sessionUser).value).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (!res.body.user.lodgeOwner) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You need to login as a lodgeowner to access this page!',
          })
        }
      });;
    }

    this.lodgeForm = this.formBuilder.group({
      lodgeName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      municipality: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      startingPrice: [0, Validators.required],
      flyIn: [false]
    });
  }

  onSubmit() {
    this.ls.getLodges({ owner: JSON.parse(this.sessionUser).value }).subscribe((response: HttpResponse<any>) => {
      console.log('response from server:', response);
      if (response.status == 400 || response.body.lodges.length == 0) {
        console.log("This owner hasn't created a lodge yet")
        console.log(this.lodgeForm)
        let body = this.lodgeForm.value
        body.owner = JSON.parse(this.sessionUser).value
        this.ls.createlodge(this.lodgeForm.value)
      } else {
        console.log("navigate to this owner's lodge")
        Swal.fire({
          title: 'You can only create 1 lodge',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['lodgeDetail'], {
              queryParams: {
                owner: JSON.parse(this.sessionUser).value
              }
            });
          }
        })
      }
    });
  }
}
