import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../auth/services/auth';

/**
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./app.component.scss'],
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	constructor(private userData: AuthService) {}

	public ngOnInit() {
		console.log(this.userData.loggedIn, 'aaa');
		if (!this.userData.loggedIn) {
			this.userData.logout();
		}
	}
}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
