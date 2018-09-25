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
		switch (this.profile.role) {
			case 'admin':
				return {
					subjects: 'Категории',
					templates: 'Шаблоны',
					scheme: 'Схема шаблонов',
					i18n: 'i18n-схема',
					users: 'Пользователи',
					whiteLabels: 'Вайт-лейблы',
				};
			case 'guest':
				return {};
			default:
				return {
					templates: 'Шаблоны',
				};
		}
	}

	get sectionKeys() {
		switch (this.profile.role) {
			case 'admin':
				return ['subjects', 'templates', 'scheme', 'i18n', 'users', 'whiteLabels'];
			case 'guest':
				return [];
			default:
				return ['templates'];
		}
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
