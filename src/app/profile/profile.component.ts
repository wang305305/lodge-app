import { HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any
  editProfile: boolean = false
  profileForm: any;
  profileImage: any;
  constructor(
    private as: AuthService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private is: ImageService,
    ) {

    }

  ngOnInit(): void {
    console.log(this.cookieService.get('user'))
    this.as.getUserProfile(this.cookieService.get('user')).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      console.log(res.body)
      this.as.setCurrentUser(res.body.user)
      this.currentUser = res.body.user
      console.log(this.currentUser)
    });;

    this.is.getProfileImage(this.cookieService.get('user')).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      console.log(res.body)
      this.profileImage = res.body.img64
      window.scrollTo(0, Number(this.cookieService.get('scroll')));
    });;
  }

  toggleEditprofile() {
    this.editProfile = !this.editProfile;
    console.log(this.editProfile)
    this.profileForm = this.formBuilder.group({
      firstName: [this.currentUser.firstName],
      lastName: [this.currentUser.lastName]
    });
    console.log(this.profileForm)
  }

  submitEditProfile() {
    let body = {
      "username": this.currentUser.username,
      "firstName": this.profileForm.controls.firstName.value,
      "lastName": this.profileForm.controls.lastName.value,
    }
    console.log(body)
    this.as.updateUserProfile(body).subscribe((res: HttpResponse<any>) => {
      console.log('response from server:', res);
      console.log(res.body)
      this.as.setCurrentUser(res.body.user)
      this.currentUser = res.body.user
      console.log(this.currentUser)
      Swal.fire("Success!", "Update Profile Successful!", "success");
      this.editProfile = false;
      //this.router.navigateByUrl('/');
    });;
  }

  refreshImage(img: any) {
    this.profileImage = img
  }
  
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    this.cookieService.set( 'scroll', window.scrollY.toString() );
  }
  // onElementScroll(e: any) {
  //   console.log("scroll!!!!!!!!!!!!!!")
  //   this.cookieService.set( 'scroll', window.scrollY.toString() );
  // }
}
