import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NoAuthGuard implements CanActivate {

  constructor(private userData: AuthService, private router: Router) {}
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userData.loggedIn) {
      this.router.navigate(['/templates']);
      return false;
    }
    return true;
  }
}
