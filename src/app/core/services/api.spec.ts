import {
	HttpClientTestingModule,
	HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { catchError } from 'rxjs/operators';

interface IMockOkResponse {
	status: 'ok';
}

interface IMockNotOkResponse {
	status: 'not-ok';
}

describe('Api service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	const host = APP_DI_CONFIG.host;
	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#GET', () => {
		let expectedAnswer: IMockOkResponse;
		const mockEndPoint = 'mock';
    const search = {
			foo: 'bar',
			bar: null
		};
    const headers = {
			bar: 'foo'
		};

		beforeEach(() => {
			api = TestBed.get(Api);
			expectedAnswer = { status: 'ok' } as IMockOkResponse;
		});

		it('should return expected answer (called once)', () => {
			api
				.get(mockEndPoint, search, false, headers)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}${mockEndPoint}?foo=bar`
			);
			expect(req.request.method).toEqual('GET');
			expect(req.request.params.get('foo')).toEqual('bar');
			expect(req.request.headers.get('bar')).toEqual('foo');
			expect(req.request.withCredentials).toBeFalsy();

			req.flush(expectedAnswer);
		});

		it('should return error on server-error (called once)', () => {
			api
				.get(mockEndPoint)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					error =>
						expect(error.status).toEqual(500, 'should return 500 error code')
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('GET');

			const msg = 'deliberate 500 error';
			req.flush(msg, { status: 500, statusText: 'We are not ok' });
		});
	});
	describe('#POST', () => {
		let expectedAnswer: IMockOkResponse;
    const mockEndPoint = 'mock';
    const body = {
			foo: 'bar'
		};
    const headers = {
			bar: 'foo'
		};
		beforeEach(() => {
			api = TestBed.get(Api);
			expectedAnswer = { status: 'ok' } as IMockOkResponse;
		});

		it('should return expected answer (called once)', () => {
			api
				.post(mockEndPoint, body, true, headers)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					fail
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('POST');
			expect(req.request.body).toBeDefined();
			expect(req.request.body.foo).toEqual('bar');
			expect(req.request.headers.get('bar')).toEqual('foo');
			expect(req.request.withCredentials).toBeTruthy();
			req.flush(expectedAnswer);
		});

		it('should return error on server-error (called once)', () => {
			api
				.post(mockEndPoint)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					error =>
						expect(error.status).toEqual(500, 'should return 500 error code')
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('POST');

			const msg = 'deliberate 500 error';
			req.flush(msg, { status: 500, statusText: 'We are not ok' });
		});
	});
	describe('#PUT', () => {
		let expectedAnswer: IMockOkResponse;
    const mockEndPoint = 'mock';
    const body = {
			foo: 'bar'
		};
    const headers = {
			bar: 'foo'
		};
		beforeEach(() => {
			api = TestBed.get(Api);
			expectedAnswer = { status: 'ok' } as IMockOkResponse;
		});

		it('should return expected answer (called once)', () => {
			api
				.put(mockEndPoint, body, headers)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					fail
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('PUT');
			expect(req.request.body).toBeDefined();
			expect(req.request.body.foo).toEqual('bar');
			expect(req.request.headers.get('bar')).toEqual('foo');
			expect(req.request.withCredentials).toBeTruthy();

			req.flush(expectedAnswer);
		});

		it('should return error on server-error (called once)', () => {
			api
				.put(mockEndPoint)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					error =>
						expect(error.status).toEqual(500, 'should return 500 error code')
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('PUT');

			const msg = 'deliberate 500 error';
			req.flush(msg, { status: 500, statusText: 'We are not ok' });
		});
	});
	describe('#DELETE', () => {
		let expectedAnswer: IMockOkResponse;
    const mockEndPoint = 'mock';
    const headers = {
			bar: 'foo'
		};

		beforeEach(() => {
			api = TestBed.get(Api);
			expectedAnswer = { status: 'ok' } as IMockOkResponse;
		});

		it('should return expected answer (called once)', () => {
			api
				.delete(mockEndPoint, headers)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					fail
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('DELETE');
			expect(req.request.headers.get('bar')).toEqual('foo');
			expect(req.request.withCredentials).toBeTruthy();

			req.flush(expectedAnswer);
		});

		it('should return error on server-error (called once)', () => {
			api
				.delete(mockEndPoint)
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					error =>
						expect(error.status).toEqual(500, 'should return 500 error code')
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('DELETE');

			const msg = 'deliberate 500 error';
			req.flush(msg, { status: 500, statusText: 'We are not ok' });
		});
	});
	describe('#emptyResult', () => {
		let expectedAnswer: IMockNotOkResponse;
    const mockEndPoint = 'mock';

		beforeEach(() => {
			api = TestBed.get(Api);
			expectedAnswer = { status: 'not-ok' } as IMockNotOkResponse;
		});

		it('should turn 505 into an empty  result', () => {
			api
				.get(mockEndPoint)
				.pipe(catchError(api.emptyResult<IMockNotOkResponse>(expectedAnswer)))
				.subscribe(
					answer =>
						expect(answer).toEqual(
							expectedAnswer,
							'should return expected answer'
						),
					fail
				);

			const req = httpTestingController.expectOne(`${host}${mockEndPoint}`);
			expect(req.request.method).toEqual('GET');

			const msg = 'deliberate 500 error';
			req.flush(msg, { status: 500, statusText: 'We are not ok' });
		});
	});
});
