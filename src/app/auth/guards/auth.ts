import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { tap } from 'rxjs/operators';
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private userData: AuthService, private router: Router) {}
	public canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if (!this.userData.loggedIn) {
      /**
       * проверяем а не залогинен ли уже пользовтель через сам юкит
       */
		  return this.userData.checkLogin().pipe(
		    tap(r => {
		      if(!r) {
            this.router.navigate(['/login']);
          }
        })
      );
		}

		if(this.userData.getRole() === 'guest') {
			this.router.navigate(['/404']);
			return false;
		}

		return true;
	}
}
