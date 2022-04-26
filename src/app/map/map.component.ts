import { Component, OnInit } from '@angular/core';
import '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: google.maps.Map | undefined;
  constructor() { }

  ngOnInit(): void {
    this.initMap()
  }

  initMap() {
    console.log("initMap")
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
  
  //window.initMap = this.initMap;
}
