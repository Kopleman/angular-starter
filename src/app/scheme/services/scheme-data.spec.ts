import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Api } from '../../core/services/api';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { SchemeData } from './scheme-data';

describe('Schema data service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let schemaData: SchemeData;
	const host = APP_DI_CONFIG.host;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, SchemeData]
		});
		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
		schemaData = TestBed.get(SchemeData);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getScheme', () => {
		let expectedAnswer: Array<{[index: string]: string}>;
		beforeEach(() => {
			expectedAnswer = [{ _id: 'mockId', title: 'mockTitle' }] as Array<{[index: string]: string}>;
		});

		it('should return expected answer (called once)', () => {
			schemaData
				.getScheme()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected subjects'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/scheme`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});
		it(`should return expected subjects that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			schemaData
				.getScheme().subscribe();
			schemaData
				.getScheme().subscribe();
			schemaData
				.getScheme()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected subjects'),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/templates/scheme`
			);
			expect(requests.length).toEqual(1, 'calls to getSubjects()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});
});
