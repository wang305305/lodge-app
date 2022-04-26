import { Component, OnInit } from '@angular/core';
import '@angular/google-maps';
import Swal from 'sweetalert2';

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(res => {
        console.log(res)
        let userLocation = { lat: res.coords.latitude, lng: res.coords.longitude };
        const map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom: 8,
            center: userLocation,
          }
        );
      
        new google.maps.Marker({
          position: userLocation,
          map,
          title: "Hello World!",
        });43.651070
      });
    } else {
      Swal.fire("Unable to get geolocation")
    }
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 6,
        center: { lat: 43.651070, lng: -79.347015 },
      }
    );
    
  }
  
  //window.initMap = this.initMap;
}
