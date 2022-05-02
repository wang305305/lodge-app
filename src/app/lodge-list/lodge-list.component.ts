import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LodgeService } from '../services/lodge.service';

@Component({
  selector: 'app-lodge-list',
  templateUrl: './lodge-list.component.html',
  styleUrls: ['./lodge-list.component.css']
})
export class LodgeListComponent implements OnInit {
  lodgeList: any = []
  constructor(
    private cookieService: CookieService,
    private ls: LodgeService,
    private router: Router,
    private activeRoute: ActivatedRoute
    ) {
      
    }

  ngOnInit(): void {
    this.ls.searchResultLodges.subscribe(res => this.lodgeList = res);
    this.ls.getAllLodges().subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      if (res.ok) {
        this.lodgeList = res.body.lodges
        this.ls.allLodges = res.body.lodges
        this.ls.searchResultLodges.next(res.body.lodges)
        console.log(this.lodgeList)
      } else {
        console.error(res)
      }
    });
  }

  toLodgeDetail(lodgeName: String) {
    this.router.navigate(['lodgeDetail'], {
      queryParams: {
        lodgeName: lodgeName
      }
    });
  }
}
