import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { Api } from '../../core/services/api';
import { TemplatesI18nData } from './template-i18n-data';
import { IUserRole } from '../../users/models/user';

describe('i18n service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let templatesI18nData: TemplatesI18nData;
	const host = APP_DI_CONFIG.host;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, TemplatesI18nData]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
		templatesI18nData = TestBed.get(TemplatesI18nData);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getTemplates', () => {
		let expectedAnswer: Array<{ [index: string]: string }>;
		beforeEach(() => {
			expectedAnswer = [{ _id: 'mock', title: 'mock' }] as Array<{ [index: string]: string }>;
		});
		it('should return expected answer (called once)', () => {
			templatesI18nData
				.getTemplates()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected locales'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/i18n/templates`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});
	});

	describe('#getActiveLocalesHash', () => {
		let expectedAnswer: { [index: string]: string };
		beforeEach(() => {
			expectedAnswer = { ru: 'Русский', en: 'English' } as { [index: string]: string };
		});
		it('should return expected answer (called once)', () => {
			templatesI18nData
				.getActiveLocalesHash()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected locales'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/i18n/activeLocalesHash`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});

		it(`should return expected subjects that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			templatesI18nData
				.getActiveLocalesHash().subscribe();
			templatesI18nData
				.getActiveLocalesHash().subscribe();
			templatesI18nData
				.getActiveLocalesHash()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected locales'),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/i18n/activeLocalesHash`
			);
			expect(requests.length).toEqual(1, 'calls to http');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});
});
