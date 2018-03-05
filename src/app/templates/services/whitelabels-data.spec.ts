import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Api } from '../../core/services/api';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { WhiteLabelsData } from './whitelabels-data';
import { IWhiteLabel } from '../models/whitelabel';

describe('WhiteLabels data service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let whiteLabelsData: WhiteLabelsData;
	const host = APP_DI_CONFIG.host;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, WhiteLabelsData]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getWhiteLabels', () => {
		let expectedAnswer: IWhiteLabel[];
		beforeEach(() => {
			expectedAnswer = [{ _id: 'mockId', ip: '0.0.0.0' }] as IWhiteLabel[];
			api = TestBed.get(Api);
			whiteLabelsData = TestBed.get(WhiteLabelsData);
		});

		it('should return expected answer (called once)', () => {
			whiteLabelsData
				.getWhiteLabels()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected labels'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/whitelables`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});

		it(`should return expected whiteLabels that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			whiteLabelsData.getWhiteLabels().subscribe();
			whiteLabelsData.getWhiteLabels().subscribe();
			whiteLabelsData
				.getWhiteLabels()
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected labels'
						),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/whitelables`
			);
			expect(requests.length).toEqual(1, 'calls to getWhiteLabels()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});
});
