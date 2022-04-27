import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ImageService } from '../services/image.service';



@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
  imageForm: any;
  currentUser: string | undefined;
  @Output() updateImage = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private is: ImageService,
  ) {

  }

  ngOnInit(): void {
    this.currentUser = this.cookieService.get('user')
    this.imageForm = this.formBuilder.group({
      img: ['', Validators.required],
    });
  }
  uploadImage(event: any) {
    console.log("onsubmit")
    let fileList: FileList = event.target.files;
    console.log(fileList)

    if (fileList.length > 0) {
      let file: File = fileList[0];
      console.log(file)
      let formData: FormData = new FormData();
      formData.append('username', this.cookieService.get('user'));
      formData.append('uploaded_file', file);

      this.is.uploadProfileImage(formData).subscribe(res => {
        console.log("uploadProfileImage finished " + res)
        this.is.getProfileImage(this.cookieService.get('user')).subscribe(res => {
          console.log(res)
          this.updateImage.emit(res.body.img64);
          Swal.fire("Success!", "Update Profile Image Successful!", "success");
        })
      })

    }
    // console.log(body)
    // this.as.register(body)
  }
}
