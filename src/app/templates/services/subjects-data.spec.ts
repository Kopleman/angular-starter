import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Api } from '../../core/services/api';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { SubjectsData } from './subjects-data';
import { ISubject } from '../models/subject';

describe('Subjects data service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let subjectsData: SubjectsData;
	const host = APP_DI_CONFIG.host;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, SubjectsData]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
		subjectsData = TestBed.get(SubjectsData);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getSubjects', () => {
		let expectedAnswer: ISubject[];
		beforeEach(() => {
			expectedAnswer = [{ _id: 'mockId', title: 'mockTitle' }] as ISubject[];
		});

		it('should return expected answer (called once)', () => {
			subjectsData
				.getSubjects()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected subjects'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/subjects/short`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});
	});
});
