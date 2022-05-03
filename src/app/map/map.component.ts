import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import '@angular/google-maps';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() data : any
  map: google.maps.Map | undefined;
  lodgeLocation: any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.data.type == 'lodge') {
      //display lodge location
      console.log(this.data)
      this.getLocation(this.data.address)
    } else {
      //display user current location
      this.initMap()
    }
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
          title: "Your Current Location!",
        });
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
  getLocation(address: string) {
    const url = `https://maps.google.com/maps/api/geocode/json?address=${address}&sensor=false&key=AIzaSyDqxKMusIQ-HrR2ar5j6K9Z9tPZnG0rKNs`;
    return this.http.get<any>(url).subscribe(res => {
      console.log(res)
      if (res.status == "ZERO_RESULTS") {
        Swal.fire("Failed to find lodge adress, showing default map", "", "error")
        const map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom: 6,
            center: { lat: 43.651070, lng: -79.347015 },
          }
        );
      } else {
        this.lodgeLocation = res.results[0].geometry.location

        const map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom: 10,
            center: this.lodgeLocation,
          }
        );
      
        new google.maps.Marker({
          position: this.lodgeLocation,
          map,
          title: "Your Current Location!",
        });
      }
    });
  }
  
  //window.initMap = this.initMap;
}
