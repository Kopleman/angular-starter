import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { Api } from '../../core/services/api';
import { SubjectsData } from './subjects-data';
import {
	ISubject,
	ISubjectFilters,
	ISubjectsResponse
} from '../models/subject';

describe('Subjects service(module)', () => {
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
		let expectedAnswer: ISubjectsResponse;
		let filters: ISubjectFilters;
		let regexp = new RegExp(`^${host}admin/rest/subjects`);

		beforeEach(() => {
			expectedAnswer = {
				count: 1,
				subjects: [
					{
						whitelabelsIds: ['mock'],
						_id: 'mock',
						title: 'mock',
					}
				]
			} as ISubjectsResponse;
			filters = {
				searchStr: 'mock',
				sortBy: 'id'
			} as ISubjectFilters;
		});

		it('should return expected answer (called once)', () => {
			subjectsData
				.getSubjects(0, 10, filters)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected wls'),
					fail
				);

			const req = httpTestingController.expectOne(_req => regexp.test(_req.url));
			expect(req.request.method).toEqual('GET');
			expect(req.request.params.get('skip')).toEqual('0');
			expect(req.request.params.get('limit')).toEqual('10');
			expect(req.request.params.get('searchStr')).toEqual('mock');
			expect(req.request.params.get('sortBy')).toEqual('id');

			req.flush(expectedAnswer);
		});
	});

	describe('#editWL', () => {
		let expectedAnswer: { status: string };
		let subject: ISubject;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			subject = {
				whitelabelsIds: ['mock'],
				_id: 'mock',
				title: 'mock',
			};
		});
		it('should return status on request', () => {
			subjectsData
				.saveChanges(subject)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/subjects/${subject._id}`
			);

			expect(req.request.method).toEqual('PUT');
		});
	});
});
