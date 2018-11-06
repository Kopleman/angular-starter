import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { Api } from '../../core/services/api';
import {
	IWhiteLabel,
	IWhiteLabelFilters,
	IWhiteLabelResponse
} from '../models/white-label';
import { WhiteLabelsData } from './white-labels-data';
import { INewWhiteLabelDialogData } from '../models/dialog';

describe('White labels service(module)', () => {
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
		api = TestBed.get(Api);
		whiteLabelsData = TestBed.get(WhiteLabelsData);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getTemplates', () => {
		let expectedAnswer: IWhiteLabelResponse;
		let filters: IWhiteLabelFilters;
		const regexp = new RegExp(`^${host}admin/rest/whiteLabels`);
		beforeEach(() => {
			expectedAnswer = {
				count: 1,
				whiteLabels: [
					{

						ip: '0.0.0.0',
						__v: '1',
						_id: 'mock',
					}
				]
			} as IWhiteLabelResponse;
			filters = {
				searchStr: 'mock',
				sortBy: 'id'
			} as IWhiteLabelFilters;
		});
		it('should return expected answer (called once)', () => {
			whiteLabelsData
				.getWhiteLabels(0, 10, filters)
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

	describe('#createNewWL', () => {
		let expectedAnswer: { status: string };
		let data: INewWhiteLabelDialogData;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			data = {
				ip: '0.0.0.0',
				_id: 'mock'
			};
		});
		it('should return status on request', () => {
			whiteLabelsData
				.createNewWL(data)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(`${host}admin/rest/whiteLabels`);
			expect(req.request.method).toEqual('POST');
		});
	});

	describe('#removeWL', () => {
		let expectedAnswer: { status: string };
		let whiteLabel: IWhiteLabel;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			whiteLabel = {
				ip: '0.0.0.0',
				_id: 'mock',
				__v: '1'
			};
		});
		it('should return status on request', () => {
			whiteLabelsData
				.removeWL(whiteLabel)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/whiteLabels/${whiteLabel._id}`
			);
			expect(req.request.method).toEqual('DELETE');
		});
	});

	describe('#editWL', () => {
		let expectedAnswer: { status: string };
		let whiteLabel: IWhiteLabel;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			whiteLabel = {
				ip: '0.0.0.0',
				_id: 'mock',
				__v: '1'
			};
		});
		it('should return status on request', () => {
			whiteLabelsData
				.editWL(whiteLabel)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/whiteLabels/${whiteLabel._id}`
			);

			expect(req.request.method).toEqual('PUT');
		});
	});
});
