import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {


  data: any[] = [1122, 1123, 1111, 1100, 1022]; // mock data

  resList: any;

  constructor() {

  }

  onType(event: any) {
    let inputData = event.target.value;
    this.resList = [];

    if (inputData.length >= 1) {

        this.resList = this.findMatch(this.data, inputData);

    }
  }

  findMatch(arr: any, regex: any) {

    var pattern = new RegExp('^' + regex + '.*');

    let result = [];
    for (let i = 0; i < arr.length; i++) {
      if (pattern.test(arr[i])) {
        result.push(arr[i]);
      }
    }
    return result;
  };

  ngOnInit(): void {
  }

}
