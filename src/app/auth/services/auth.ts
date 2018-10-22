import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { shareReplay, tap, map } from 'rxjs/operators';
import { Api } from '../../core/services/api';
import { ILoginModel, ILoginResponse, IProfile } from '../models/user';
import { catchError } from 'rxjs/internal/operators';

@Injectable()
export class AuthService {
	public LOGGEDIN = 'LOGGEDIN';
	public loggedIn: boolean = JSON.parse(localStorage.getItem(this.LOGGEDIN));
	public loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
	public userAllowToCommit$: Observable<boolean>;
	private PROFILE = 'PROFILE';
	private profile: IProfile = JSON.parse(localStorage.getItem(this.PROFILE));
	private profile$ = new BehaviorSubject<IProfile>(this.profile);
	constructor(private api: Api, private router: Router) {}

	/**
	 * Авторизация
	 * @param {string} email
	 * @param {string} password
	 * @returns {Observable<ILoginResponse>}
	 */
	public login(email: string, password: string) {
		const data = {
			email,
			password
		};

		return this.api.post<ILoginResponse, ILoginModel>('login', data, true).pipe(
			tap(response => {
				localStorage.setItem(this.PROFILE, JSON.stringify(response.user));
				localStorage.setItem(this.LOGGEDIN, JSON.stringify(true));
				this.setLoggedIn(true);
				this.setProfile(response.user);
			})
		);
	}

	public checkLogin() {
	  return this.api.get<ILoginResponse, null>('admin/rest/isLogedIn').pipe(
      map(response => {
        localStorage.setItem(this.PROFILE, JSON.stringify(response.user));
        localStorage.setItem(this.LOGGEDIN, JSON.stringify(true));
        this.setLoggedIn(true);
        this.setProfile(response.user);
        return true;
      }),
      catchError(this.api.emptyResult<boolean>(false))
    );
  }

	/**
	 * Логаут, с очисткой профиля и стауса, и переходом на главную
	 */
	public logout(): void {
    localStorage.removeItem(this.PROFILE);
    localStorage.removeItem(this.LOGGEDIN);
    this.setProfile(null);
    this.setLoggedIn(false);
    this.router.navigate(['/']);
	}

	/**
	 * Установить статус логина
	 * @param {boolean} value
	 */
	public setLoggedIn(value: boolean) {
		this.loggedIn$.next(value);
		this.loggedIn = value;
	}

	/**
	 * Получить профиля авторизованного пользака
	 * @returns {BehaviorSubject<IProfile>}
	 */
	public getProfile(): BehaviorSubject<IProfile> {
		return this.profile$;
	}

	public getRole(): string {
		return this.profile.role;
	}

	/**
	 * Установить профиль
	 * @param {IProfile} profile
	 */
	public setProfile(profile: IProfile) {
		this.profile$.next(profile);
		this.profile = profile;
	}

	public isAdmin() {
	return this.getProfile().getValue().role === 'admin';
	}

	public allowToCommit() {
		if( !this.userAllowToCommit$ ) {
			this.userAllowToCommit$ = this._allowToCommit().pipe(shareReplay(1));
		}
		return  this.userAllowToCommit$;
	}

	private _allowToCommit() {
		return this.api
			.get<boolean, null>(`admin/rest/userAllowToCommit/${this.profile.email}`)
	}
}
