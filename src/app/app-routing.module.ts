import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CreateLodgeComponent } from './create-lodge/create-lodge.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LodgeDetailComponent } from './lodge-detail/lodge-detail.component';
import { LodgeListComponent } from './lodge-list/lodge-list.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { PaypalComponent } from './paypal/paypal.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { WishListComponent } from './wish-list/wish-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'map', component: MapComponent, canActivate: [AuthGuard]},
  { path: 'upload', component: UploadImageComponent, canActivate: [AuthGuard]},
  { path: 'searchbox', component: SearchboxComponent },
  { path: 'createLodge', component: CreateLodgeComponent, canActivate: [AuthGuard]},
  { path: 'lodgeDetail', component: LodgeDetailComponent },
  { path: 'lodgeList', component: LodgeListComponent },
  { path: 'wishList', component: WishListComponent, canActivate: [AuthGuard]},
  { path: 'paypal', component: PaypalComponent},
  { path: 'forgotPassword', component: ForgotPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
