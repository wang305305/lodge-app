import { HttpResponse } from '@angular/common/http';
import { RESTORED_VIEW_CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { LodgeService } from '../services/lodge.service';

@Component({
  selector: 'app-lodge-detail',
  templateUrl: './lodge-detail.component.html',
  styleUrls: ['./lodge-detail.component.css']
})
export class LodgeDetailComponent implements OnInit {
  lodgeObj: any
  allowEdit: any = false
  mapData: { type: string; address: string; } | undefined;
  reviewForm: any;
  
  constructor(
    private as: AuthService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private ls: LodgeService,
    private router: Router,
    private activeRoute: ActivatedRoute
    //private is: ImageService,
  ) {
    console.log(activeRoute.snapshot.queryParams, 'query params');
  }

  // this.router.navigate(['lodgeDetail'], { queryParams: {
  //   lodgeName: ''
  // }});

  ngOnInit(): void {
    // for non-owner
    if (this.activeRoute.snapshot.queryParams['lodgeName']) {
      this.ls.getLodges({lodgeName: this.activeRoute.snapshot.queryParams['lodgeName']}).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (res.ok) {
          this.lodgeObj = res.body.lodges[0]
          this.mapData = {type:"lodge", address: this.lodgeObj.streetAddress + ', ' + this.lodgeObj.municipality + ', ' + this.lodgeObj.province + ', ' + this.lodgeObj.country}
          if (this.lodgeObj.owner == this.as.currentUser?.username) {
            this.allowEdit = true
          }
        } else {
          console.error(res)
        }
      });
    } else if (this.activeRoute.snapshot.queryParams['owner']) {
      // for owner
      this.ls.getLodges({owner: this.activeRoute.snapshot.queryParams['owner']}).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (res.ok && res.body.lodges.length > 0) {
          this.lodgeObj = res.body.lodges[0]
          this.mapData = {type:"lodge", address: this.lodgeObj.streetAddress + ', ' + this.lodgeObj.municipality + ', ' + this.lodgeObj.province + ', ' + this.lodgeObj.country}
          if (this.lodgeObj.owner == this.as.currentUser?.username) {
            this.allowEdit = true
          }
        } else {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl('/createLodge');
          });
        }
      });
    }
    this.reviewForm = this.formBuilder.group({
      review: ['', Validators.required]
    });
  }

  editLodge() {
    console.log("editLodge")
  }

  submitReview() {
    
    let filter = {"lodgeName": "ron lodge"}
    let update
    if (!this.lodgeObj.reviews) {
      update = {"reviews": [this.reviewForm.controls.review.value]}
    }else {
      this.lodgeObj.reviews.push(this.reviewForm.controls.review.value)
      update = {"reviews": this.lodgeObj.reviews}
    }
    console.log("update", update)
    this.ls.updateLodges(filter, update).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (res.ok) {
          Swal.fire("Success!", "Submit Review Successful!", "success");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to submit review'
          })
        }
      });
  }
}
