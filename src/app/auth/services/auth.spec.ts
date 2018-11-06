import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../core/services/api';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { AuthService } from './auth';
import { ILoginModel, ILoginResponse, IProfile } from '../models/user';
import { Router } from '@angular/router';

describe('Auth service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let authService: AuthService;
	const host = APP_DI_CONFIG.host;
	const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, AuthService, { provide: Router, useValue: routerSpy }]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
		authService = TestBed.get(AuthService);
	});

	describe('#login', () => {
		let profile: IProfile;
		let expectedAnswer: ILoginResponse;
		let loginData: ILoginModel = {
			email: 'mock@mock',
			password: '123321'
		};

		beforeEach(() => {
			api = TestBed.get(Api);
			authService = TestBed.get(AuthService);
			profile = { email: 'mock@mock', role: 'admin' };
			expectedAnswer = {
				user: profile
			} as ILoginResponse;
		});

		afterEach(() => {
			// After every test, assert that there are no more pending requests.
			httpTestingController.verify();
		});

		it('should return error on  non-successful attempt', () => {
			authService.login(loginData.email, loginData.password).subscribe(
				answer =>
					expect(answer).toEqual(
						expectedAnswer,
						'should return expected answer'
					),
				error => {
					expect(error.status).toEqual(403, 'should return 403 error code');
					expect(authService.loggedIn).toBeFalsy();
					expect(authService.loggedIn$.getValue()).toBeFalsy();
					expect(JSON.parse(localStorage.getItem('LOGGEDIN'))).toBeNull();
					expect(JSON.parse(localStorage.getItem('PROFILE'))).toBeNull();
					expect(authService.getProfile().getValue()).toBeNull();
				}
			);

			const req = httpTestingController.expectOne(`${host}login`);
			expect(req.request.method).toEqual('POST');

			const msg = 'deliberate 403 error';
			req.flush(msg, { status: 403, statusText: 'Not authorized' });
		});

		it('should return login-response and log-in user on successful attempt', () => {
			authService
				.login(loginData.email, loginData.password)
				.subscribe(response => {
					expect(response).toEqual(
						expectedAnswer,
						'should return log-in response'
					);
					expect(authService.loggedIn).toBeTruthy();
					expect(authService.loggedIn$.getValue()).toBeTruthy();
					expect(JSON.parse(localStorage.getItem('LOGGEDIN'))).toBeTruthy();
					expect(JSON.parse(localStorage.getItem('PROFILE'))).toEqual(profile);
					expect(authService.getProfile().getValue()).toEqual(profile);
				}, fail);

			const req = httpTestingController.expectOne(`${host}login`);
			expect(req.request.method).toEqual('POST');
			expect(req.request.body).toBeDefined();
			expect(req.request.body.email).toEqual(loginData.email);
			expect(req.request.body.password).toEqual(loginData.password);
			expect(req.request.withCredentials).toBeTruthy();

			req.flush(expectedAnswer);
		});
	});

	describe('#logout', () => {
		let profile: IProfile;
		let expectedAnswer: ILoginResponse;
		const loginData: ILoginModel = {
			email: 'mock@mock',
			password: '123321'
		};

		beforeEach(done => {
			api = TestBed.get(Api);
			authService = TestBed.get(AuthService);
			profile = { email: 'mock@mock', role: 'admin' };
			expectedAnswer = {
				user: profile
			} as ILoginResponse;
			authService
				.login(loginData.email, loginData.password)
				.subscribe(response => {
					done();
				});

			const req = httpTestingController.expectOne(`${host}login`);
			expect(req.request.method).toEqual('POST');
			req.flush(expectedAnswer);
		});

		afterEach(() => {
			httpTestingController.verify();
		});

		it('should logout user and navigate to mainpage', () => {
			authService.logout();
			const spy = routerSpy.navigate as jasmine.Spy;
			const navArgs = spy.calls.first().args[0];

			expect(authService.loggedIn).toBeFalsy();
			expect(authService.loggedIn$.getValue()).toBeFalsy();
			expect(JSON.parse(localStorage.getItem('LOGGEDIN'))).toBeNull();
			expect(JSON.parse(localStorage.getItem('PROFILE'))).toBeNull();
			expect(authService.getProfile().getValue()).toBeNull();
			expect(navArgs).toEqual(['/'], 'should nav to mainpage');
		});
	});

	describe('#allowToCommit', () => {
		let profile: IProfile;
		let expectedAnswer: boolean;
		let expectedLoginAnswer: ILoginResponse;
		const loginData: ILoginModel = {
			email: 'mock@mock',
			password: '123321'
		};

		beforeEach(done => {
			expectedAnswer = true;
			api = TestBed.get(Api);
			authService = TestBed.get(AuthService);
			profile = { email: 'mock@mock', role: 'admin' };
			expectedLoginAnswer = {
				user: profile
			} as ILoginResponse;
			authService
				.login(loginData.email, loginData.password)
				.subscribe(() => {
					done();
			});
			const req = httpTestingController.expectOne(`${host}login`);
			req.flush(expectedLoginAnswer);
		});

		it('should return expected answer (called once)', () => {
			authService
				.allowToCommit()
				.subscribe(
					answer =>
						expect(answer).toBeTruthy(
							'should return true'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/userAllowToCommit/${loginData.email}`
			);
			expect(req.request.method).toEqual('GET');
			/**
			 * https://github.com/angular/angular/issues/20690
			 */
			req.flush(1);
		});
		it(`should return true that got on first request
		and shared on other attempts (called multiple times)`, () => {
			authService
				.allowToCommit().subscribe();
			authService
				.allowToCommit().subscribe();
			authService
				.allowToCommit()
				.subscribe(
					answer => expect(answer).toBeTruthy('should return true'),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/userAllowToCommit/${loginData.email}`
			);
			expect(requests.length).toBeTruthy( 'calls to allowToCommit()');

			requests[0].flush(1);
		});
	});
});
