import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';


@Injectable()
export class UsersGuard implements CanActivate {
	constructor(private userData: AuthService, private router: Router) {}
	public canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		if(this.userData.getRole() === 'admin') {
			return true;
		}
		this.router.navigate(['/templates']);
		return false;
	}
}
