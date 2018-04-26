import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Api } from '../../core/services/api';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { UsersData } from './users-data';
import { IUser } from '../models/users';

describe('Users data service', () => {
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
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getUsersForCloneAction', () => {
		let expectedAnswer: IUser[];
		beforeEach(() => {
			expectedAnswer = [{ email: 'mock@mock.ru', username: 'mock' }] as IUser[];
			api = TestBed.get(Api);
			usersData = TestBed.get(UsersData);
		});

		it('should return expected answer (called once)', () => {
			usersData
				.getUsersForCloneAction()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected users'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/userList/cloneTemplate`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});

		it(`should return expected users that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			usersData.getUsersForCloneAction().subscribe();
			usersData.getUsersForCloneAction().subscribe();
			usersData
				.getUsersForCloneAction()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected users'
						),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/userList/cloneTemplate`
			);
			expect(requests.length).toEqual(1, 'calls to getWhiteLabels()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});
});
