import { HttpResponse } from '@angular/common/http';
import { RESTORED_VIEW_CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Attribute, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { LodgeService } from '../services/lodge.service';
import { WishlistService } from '../services/wishlist.service';

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
  avg_rating: number | undefined;
  rated: any;
  loggedIn: unknown;
  currentUser: any;
  added: boolean | undefined;

  constructor(
    private as: AuthService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private ls: LodgeService,
    private wls: WishlistService,
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
    this.as.isLoggedIn.subscribe(res => this.loggedIn = res);

    let sessionUser = sessionStorage.getItem('user')
    if (sessionUser) {
      let now = new Date()
      if (now.getTime() < JSON.parse(sessionUser).expiredAt) {
        this.as.isLoggedIn.next(true)
        this.currentUser = JSON.parse(sessionUser).value
      }
    }
    // for non-owner
    if (this.activeRoute.snapshot.queryParams['lodgeName']) {
      this.ls.getLodges({ lodgeName: this.activeRoute.snapshot.queryParams['lodgeName'] }).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (res.ok) {
          this.lodgeObj = res.body.lodges[0]
          this.avg_rating = this.calc_avg_rating(this.lodgeObj.ratings.attributes)
          this.rated = this.lodgeObj.ratings.attributes.filter((e: { user: any; }) => e.user==this.as.currentUser?.username).length > 0
          this.mapData = { type: "lodge", address: this.lodgeObj.streetAddress + ', ' + this.lodgeObj.municipality + ', ' + this.lodgeObj.province + ', ' + this.lodgeObj.country }
          if (this.lodgeObj.owner == this.as.currentUser?.username) {
            this.allowEdit = true
          }
          if (this.currentUser) {
            this.checkIfLodgeInWishList()
          }
        } else {
          console.error(res)
        }
      });
    } else if (this.activeRoute.snapshot.queryParams['owner']) {
      // for owner
      this.ls.getLodges({ owner: this.activeRoute.snapshot.queryParams['owner'] }).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (res.ok && res.body.lodges.length > 0) {
          this.lodgeObj = res.body.lodges[0]
          this.avg_rating = this.calc_avg_rating(this.lodgeObj.ratings.attributes)
          this.rated = this.lodgeObj.ratings.attributes.filter((e: { user: any; }) => e.user==this.as.currentUser?.username).length > 0
          this.mapData = { type: "lodge", address: this.lodgeObj.streetAddress + ', ' + this.lodgeObj.municipality + ', ' + this.lodgeObj.province + ', ' + this.lodgeObj.country }
          if (this.lodgeObj.owner == this.as.currentUser?.username) {
            this.allowEdit = true
          }
          if (this.currentUser) {
            this.checkIfLodgeInWishList()
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

    let filter = { "lodgeName": this.lodgeObj.lodgeName }
    let update
    if (!this.lodgeObj.reviews) {
      update = { "reviews": [this.reviewForm.controls.review.value] }
    } else {
      this.lodgeObj.reviews.push(this.reviewForm.controls.review.value)
      update = { "reviews": this.lodgeObj.reviews }
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

  onClickStar(event: any) {
    console.log(event.rating)
    let filter = { "lodgeName": this.lodgeObj.lodgeName }
    let update
    if (!this.lodgeObj.ratings) {
      update = {
        "ratings":
        {
          "attributes": [{
            user: this.as.currentUser?.username,
            rating: event.rating
          }]
        }

      }
    } else {
      this.lodgeObj.ratings.attributes.push(
        {
          user: this.as.currentUser?.username,
          rating: event.rating
        }
      )
      console.log(this.lodgeObj.ratings)
      update = { "ratings": this.lodgeObj.ratings }
    }
    console.log("update", update)
    this.ls.updateLodges(filter, update).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      if (res.ok) {
        Swal.fire("Success!", "Submit rating Successful!", "success");
        this.avg_rating = this.calc_avg_rating(this.lodgeObj.ratings.attributes)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to submit rating'
        })
      }
    });
  }

  calc_avg_rating(array: any) {
    let sum = 0
    array.forEach((element: any) => {
      sum = sum + element.rating
    });
    return sum / array.length
  }

  addToWishList(lodgeName: any) {
    this.wls.addToWishList(lodgeName, this.currentUser).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      if (res.ok) {
        this.added = true
        Swal.fire("Success!", "Added To Wish List", "success");

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add to Wish List'
        })
      }
    });
  }

  removeFromWishList(lodgeName: any) {
    this.wls.removeFromWishList(lodgeName, this.currentUser).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      if (res.ok) {
        this.added = false
        Swal.fire("Success!", "Removed From Wish List", "success");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to remove from Wish List'
        })
      }
    });
  }

  checkIfLodgeInWishList() {
    this.wls.isLodgeInWishList(this.lodgeObj.lodgeName, this.currentUser).subscribe((res: HttpResponse<any>) => {
      console.log("!!!!!!!!!!!!!!")
      console.log('response from server:', res);
      if (res.ok) {
        this.added = res.body.added
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to check lodge in Wish List'
        })
      }
    });
  }
}
