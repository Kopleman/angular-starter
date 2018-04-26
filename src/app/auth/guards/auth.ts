import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private userData: AuthService, private router: Router) {}
	public canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if (!this.userData.loggedIn) {
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}
