import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { Api } from '../../core/services/api';
import { UsersData } from './users-data';
import { INewUser, IUser, IUserFilters, IUserRole, IUsersResponse } from '../models/user';

describe('Users data service(module)', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let usersData: UsersData;
	const host = APP_DI_CONFIG.host;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, UsersData]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
		usersData = TestBed.get(UsersData);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});


	describe('#getUsers', () => {
		let expectedAnswer: IUsersResponse;
		let filters: IUserFilters;
		let regexp = new RegExp(`^${host}admin/rest/users`);
		beforeEach(() => {
			expectedAnswer = {
				count: 1,
				users: [
					{
						_id: 'mock',
						email: 'mock@mock.ru',
						created: '2015-09-23T13:21:55.757Z',
						firstName: 'first',
						lastName: 'last',
						role: 'admin',
						phone: '123456789',
					}
				],
			} as IUsersResponse;
			filters = {
				searchStr: 'mock',
				sortBy: 'email'
			} as IUserFilters;
		});
		it('should return expected answer (called once)', () => {
			usersData
				.getUsers(0, 10, filters)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected users'),
					fail
				);

			const req = httpTestingController.expectOne(_req => regexp.test(_req.url));
			expect(req.request.method).toEqual('GET');
			expect(req.request.params.get('skip')).toEqual('0');
			expect(req.request.params.get('limit')).toEqual('10');
			expect(req.request.params.get('searchStr')).toEqual('mock');
			expect(req.request.params.get('sortBy')).toEqual('email');

			req.flush(expectedAnswer);
		});
	});

	describe('#createNewUser', () => {
		let expectedAnswer: { status: string };
		let data: INewUser;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			data = {
				email: 'mock@mock.ru',
				password: 'test',
				firstName: 'first',
				lastName: 'last',
				role: 'admin',
				phone: '123456789',
			};
		});
		it('should return status on request', () => {
			usersData
				.createNewUser(data)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(`${host}admin/rest/users`);
			expect(req.request.method).toEqual('POST');
		});
	});

	describe('#editUser', () => {
		let expectedAnswer: { status: string };
		let user: IUser;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			user = {
				_id: 'mock',
				email: 'mock@mock.ru',
				created: '2015-09-23T13:21:55.757Z',
				firstName: 'first',
				lastName: 'last',
				role: 'admin',
				phone: '123456789',
			};
		});
		it('should return status on request', () => {
			usersData
				.editUser(user)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/users`
			);

			expect(req.request.method).toEqual('PUT');
		});
	});

	describe('#removeUser', () => {
		let expectedAnswer: { status: string };
		let user: IUser;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			user = {
				_id: 'mock',
				email: 'mock@mock.ru',
				created: '2015-09-23T13:21:55.757Z',
				firstName: 'first',
				lastName: 'last',
				role: 'admin',
				phone: '123456789',
			};
		});
		it('should return status on request', () => {
			usersData
				.removeUser(user)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/users/${user._id}`
			);
			expect(req.request.method).toEqual('DELETE');
		});
	});

	describe('#getRolesList', () => {
		let expectedAnswer: IUserRole[];
		beforeEach(() => {
			expectedAnswer = [{ name: 'mock', value: 'mockValue' }] as IUserRole[];
		});
		it('should return expected answer (called once)', () => {
			usersData
				.getRolesList()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected subjects'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/users/roles`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});
		it(`should return expected subjects that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			usersData
				.getRolesList().subscribe();
			usersData
				.getRolesList().subscribe();
			usersData
				.getRolesList()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected subjects'),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/users/roles`
			);
			expect(requests.length).toEqual(1, 'calls to getSubjects()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	})
});
