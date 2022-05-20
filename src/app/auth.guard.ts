import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let sessionUser = sessionStorage.getItem('user')
    if (sessionUser) {
      console.log(sessionUser)
      let now = new Date()
      if (now.getTime() < JSON.parse(sessionUser).expiredAt) {
        return true
      } else {
        console.log("unauthorized")
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
        return false
      }
    }
    return false
  }
  
}
