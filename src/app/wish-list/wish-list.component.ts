import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  wishList: any
  currentUser: any;
  constructor(
    private as: AuthService,
    private wls: WishlistService,
    ) { }

  ngOnInit(): void {
    let sessionUser = sessionStorage.getItem('user')
    if (sessionUser) {
      let now = new Date()
      if (now.getTime() < JSON.parse(sessionUser).expiredAt) {
        this.as.isLoggedIn.next(true)
      }
      this.as.getUserProfile(JSON.parse(sessionUser).value).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        console.log(res.body)
        this.as.setCurrentUser(res.body.user)
        this.currentUser = res.body.user
        this.wishList = res.body.user.wishList
        //this.router.navigateByUrl('/');
      });;
    }
  }
  remove(lodgeName: string) {
    console.log(this.currentUser)
    this.wls.removeFromWishList(lodgeName, this.currentUser.username).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      if (res.ok) {
        Swal.fire("Success!", "Removed From Wish List", "success");
        this.ngOnInit()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to remove from Wish List'
        })
      }
    });
  }
  
    
  
}
