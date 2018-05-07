import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';
import { IProfile } from '../../../auth/models/user';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent implements OnInit {
	public profile: IProfile;
	constructor(private userData: AuthService) {}
	get sections() {
		return {
			subjects: 'Категории',
			templates: 'Шаблоны',
			users: 'Пользователи',
      whiteLabels: 'Вайт-лейблы',
		};
	}

	get sectionKeys() {
		return ['subjects', 'templates', 'users', 'white-labels'];
	}

	public logout() {
		this.userData.logout();
	}

	public ngOnInit() {
		this.userData.getProfile().subscribe(profile => {
			this.profile = profile;
		});
	}
}
