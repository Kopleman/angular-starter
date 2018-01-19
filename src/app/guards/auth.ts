import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserData } from '../providers/user-data';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userData: UserData, private router: Router) {}
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.userData.loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
