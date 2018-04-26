import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
@Component({
	selector: 'login-page',
	styleUrls: ['./login.component.scss'],
	templateUrl: './login.component.html'
})
export class LoginPageComponent implements OnInit {
	public loginForm: FormGroup;
	public login: { email?: string; password?: string } = {};
	public errorMessage: string;
	constructor(
		private userData: AuthService,
		private router: Router,
		private formBuilder: FormBuilder
	) {}

	public ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, Validators.required]
		});
	}

	public onLogin() {
		this.userData.login(this.login.email, this.login.password).subscribe(
			r => {
				this.router.navigate(['/templates']);
			},
			response => {
				this.errorMessage = response.error.error;
			}
		);
	}
}
