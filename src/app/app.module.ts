import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

import { CookieService } from 'ngx-cookie-service';
import { ProfileComponent } from './profile/profile.component';
import { MapComponent } from './map/map.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { CreateLodgeComponent } from './create-lodge/create-lodge.component';
import { LodgeDetailComponent } from './lodge-detail/lodge-detail.component';
import { LodgeListComponent } from './lodge-list/lodge-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    MapComponent,
    UploadImageComponent,
    SearchboxComponent,
    CreateLodgeComponent,
    LodgeDetailComponent,
    LodgeListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    FileUploadModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
