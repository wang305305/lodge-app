import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LodgeService } from '../services/lodge.service';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {


  //data: any[] = [1122, 1123, 1111, 1100, 1022]; // mock data
  data: any[] = []
  autoCompleteList: any;
  inputData: any
  constructor(private ls: LodgeService) {

  }

  onType(event: any) {
    this.inputData = event.target.value;
    this.autoCompleteList = [];

    if (this.inputData.length >= 1) {
      // Lodge Name
      console.log(this.inputData)
      this.ls.autoCompleteLodges(this.inputData).subscribe((res: HttpResponse<any>) => {
        console.log('response from server:', res);
        if (res.ok) {
          this.autoCompleteList = res.body.lodges
        } else {
          console.error(res)
        }
      });
      //this.autoCompleteList = this.findMatch(this.data, inputData);
    }
  }

  onSearch() {
    console.log(this.inputData)
    this.ls.searchLodges({lodgeName: this.inputData})
  }
  // findMatch(arr: any, regex: any) {

  //   var pattern = new RegExp('^' + regex + '.*');

  //   let result = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     if (pattern.test(arr[i])) {
  //       result.push(arr[i]);
  //     }
  //   }
  //   return result;
  // };

  ngOnInit(): void {
  }

}
