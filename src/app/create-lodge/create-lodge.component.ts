import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LodgeService } from '../services/lodge.service';

@Component({
  selector: 'app-create-lodge',
  templateUrl: './create-lodge.component.html',
  styleUrls: ['./create-lodge.component.css']
})
export class CreateLodgeComponent implements OnInit {
  lodgeForm: any
  constructor(
    private formBuilder: FormBuilder,
    private ls: LodgeService
    ) { }

  ngOnInit(): void {
    this.lodgeForm = this.formBuilder.group({
      lodgeName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      municipality: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      flyIn: [false]
    });
  }
  
  onSubmit() {
    console.log(this.lodgeForm)
    this.ls.createlodge(this.lodgeForm.value)
  }
}
