import { Component } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
	selector: 'login-page',
	styleUrls: ['./login.component.scss'],
	templateUrl: './login.component.html'
})
export class LoginPageComponent {
	public login: { email?: string; password?: string } = {};
	public errorMessage: string;
	protected emailFormControl = new FormControl('', [
		Validators.required,
		Validators.pattern(EMAIL_REGEX)
	]);
	protected pwdFormControl = new FormControl('', [Validators.required]);
	constructor(private userData: UserData, private router: Router) {}

	protected onLogin(form: NgForm) {
		if (form.valid) {
			this.userData.login(this.login.email, this.login.password).subscribe(
				r => {
					this.router.navigate(['/templates'])
				},
				response => {
					console.log(response);
					this.errorMessage = response.error;
				}
			);
		}
	}
}
