import { Injectable } from '@angular/core';
import { Api } from '../services/api';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface ILoginModel {
	email: string;
	password: string;
}

export interface IProfile {
	email: string;
}

interface ILoginResponse {
	user: IProfile;
}

@Injectable()
export class UserData {
	public loggedIn: boolean;
	public loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
	private PROFILE = 'PROFILE';
	private profile: IProfile = JSON.parse(localStorage.getItem(this.PROFILE));
	private profile$ = new BehaviorSubject<IProfile>(this.profile);
	constructor(private api: Api, private router: Router) {
		if (!!localStorage.getItem(this.PROFILE)) {
			this.setLoggedIn(true);
		} else {
			this.logout();
		}
	}

	public login(email: string, password: string) {
		let data = {
			email,
			password
		};

		return this.api
			.post<ILoginResponse, ILoginModel>('login', data)
			.do(response => {
				localStorage.setItem(this.PROFILE, JSON.stringify(response.user));
				this.setLoggedIn(true);
				this.setProfile(response.user);
			});
	}

	public logout(): void {
		localStorage.removeItem(this.PROFILE);
		this.profile$.next(null);
		this.setLoggedIn(false);
		this.router.navigate(['/']);
	}

	public setLoggedIn(value: boolean) {
		this.loggedIn$.next(value);
		this.loggedIn = value;
	}

	public getProfile(): BehaviorSubject<IProfile> {
		return this.profile$;
	}

	public setProfile(value: IProfile) {
		this.profile$.next(value);
		this.profile = value;
	}
}
