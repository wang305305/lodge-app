import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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


  }

  editLodge() {
    console.log("editLodge")
  }

}
