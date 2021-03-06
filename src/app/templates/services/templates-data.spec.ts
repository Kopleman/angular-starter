import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_DI_CONFIG, AppConfigModule } from '../../config.module';
import { Api } from '../../core/services/api';
import { TemplatesData } from './templates-data';
import {
	ISiteBlank, ISiteBlankUpdateBody,
	ITemplate,
	ITemplateCreateReq,
	ITemplateFilters,
	ITemplateGulpStatusResponse,
	ITemplateHost,
	ITemplateResponse
} from '../models/template';

describe('Templates data service', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let api: Api;
	let templatesData: TemplatesData;
	const host = APP_DI_CONFIG.host;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// Import the HttpClient mocking services
			imports: [HttpClientTestingModule, AppConfigModule],
			// Provide the service-under-test and its dependencies
			providers: [Api, TemplatesData]
		});

		httpClient = TestBed.get(HttpClient);
		httpTestingController = TestBed.get(HttpTestingController);
		api = TestBed.get(Api);
		templatesData = TestBed.get(TemplatesData);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	describe('#getTemplates', () => {
		let expectedAnswer: ITemplateResponse;
		let filters: ITemplateFilters;
		let regexp = new RegExp(`^${host}admin/rest/templates`);
		beforeEach(() => {
			expectedAnswer = {
				count: 10,
				templates: [
					{
						_id: 'mock',
						lessEditHistory: [],
						i18nTags: { ru: ['mock', 'mock2'] },
						i18nTitles: { ru: 'mockTitle' },
						whitelabelsIds: [],
						subjectIds: ['mock'],
						dateCreate: 'string',
						title: 'string',
						author: {
							email: 'mock@mock.ru'
						},
						sourceTemplate: 'none',
						status: 'complete',
						cloneNames: [],
						editHistory: [],
						colorThemes: {
							default: {
								site: {
									theme1: {
										preview: [],
										previewColorBlock: []
									}
								}
							},
							site: {
								theme1: {
									preview: [],
									previewColorBlock: []
								}
							}
						},
						gulpStatus: 'online'
					}
				]
			} as ITemplateResponse;
			filters = {
				searchStr: 'mock',
				selectedCategory: 'mock'
			} as ITemplateFilters;
		});
		it('should return expected answer (called once)', () => {
			templatesData
				.getTemplates(0, 10, filters)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected templates'),
					fail
				);

			const req = httpTestingController.expectOne(_req => regexp.test(_req.url));
			expect(req.request.method).toEqual('GET');
			expect(req.request.params.get('skip')).toEqual('0');
			expect(req.request.params.get('limit')).toEqual('10');
			expect(req.request.params.get('searchStr')).toEqual('mock');
			expect(req.request.params.get('selectedCategory')).toEqual('mock');

			req.flush(expectedAnswer);
		});
	});

	describe('#updateSettings', () => {
		let template: ITemplate;
		let expectedAnswer: { status: string };
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			template = {
				_id: 'mock',
				lessEditHistory: [],
				i18nTags: { ru: ['mock', 'mock2'] },
				i18nTitles: { ru: 'mockTitle' },
				whitelabelsIds: [],
				subjectIds: ['mock'],
				dateCreate: 'string',
				title: 'string',
				author: {
					email: 'mock@mock.ru'
				},
				sourceTemplate: 'none',
				status: 'complete',
				cloneNames: [],
				editHistory: [],
				colorThemes: {
					default: {
						site: {
							theme1: {
								preview: [],
								previewColorBlock: []
							}
						}
					},
					site: {
						theme1: {
							preview: [],
							previewColorBlock: []
						}
					}
				},
				gulpStatus: 'online'
			};
		});

		it('should return status on request', () => {
			templatesData
				.updateSettings(template)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${template._id}/saveProps`
			);
			expect(req.request.method).toEqual('PUT');
			expect(req.request.body).toBeDefined();
			expect(req.request.body.subjectIds).toEqual(template.subjectIds);
			expect(req.request.body.whitelabelsIds).toEqual(template.whitelabelsIds);
			expect(req.request.body.i18nTitles).toEqual(template.i18nTitles);
			expect(req.request.body.i18nTags).toEqual(template.i18nTags);
		});
	});

	describe('#changeGulpStatus', () => {
		let expectedAnswer: ITemplateGulpStatusResponse;
		let templateId = 'mock';
		beforeEach(() => {
			expectedAnswer = { status: 'online' } as ITemplateGulpStatusResponse;
		});
		it('should return gulp status', () => {
			templatesData
				.changeGulpStatus(templateId, expectedAnswer.status)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected templates'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${templateId}/changePm2GulpStatus`
			);
			expect(req.request.method).toEqual('POST');
		});
	});

	describe('#delete', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on delete request', () => {
			templatesData
				.delete(templateId)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(`${host}admin/rest/templates/${templateId}`);
			expect(req.request.method).toEqual('DELETE');
		});
	});

	describe('#refreshSettings', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.refreshSettings(templateId)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${templateId}/settings/reload`
			);
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#refreshCloneSettings', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.refreshCloneSettings(templateId)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${templateId}/settingsClones/reload`
			);
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#compileClones', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.compileClones(templateId)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${templateId}/compileClones`
			);
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#compileAll', () => {
		let expectedAnswer: { status: string };
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.compileAll()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/compileAllTemplates`
			);
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#getAvailableDemoHosts', () => {
		let expectedAnswer: ITemplateHost[];
		beforeEach(() => {
			expectedAnswer = [
				{ label: 'mock-host', host: 'mock-host', withDeploy: false }
			] as ITemplateHost[];
			api = TestBed.get(Api);
			templatesData = TestBed.get(TemplatesData);
		});

		it('should return expected answer (called once)', () => {
			templatesData
				.getAvailableDemoHosts()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected hosts'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/getAvailableDemoHosts`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});

		it(`should return expected whiteLabels that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			templatesData.getAvailableDemoHosts().subscribe();
			templatesData.getAvailableDemoHosts().subscribe();
			templatesData
				.getAvailableDemoHosts()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected hosts'),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/templates/getAvailableDemoHosts`
			);
			expect(requests.length).toEqual(1, 'calls to getAvailableDemoHosts()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});

	describe('#getAvailablePubHosts', () => {
		let expectedAnswer: ITemplateHost[];
		beforeEach(() => {
			expectedAnswer = [
				{ label: 'mock-host', host: 'mock-host', withDeploy: false }
			] as ITemplateHost[];
			api = TestBed.get(Api);
			templatesData = TestBed.get(TemplatesData);
		});

		it('should return expected answer (called once)', () => {
			templatesData
				.getAvailablePubHosts()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected hosts'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/getAvailablePubHosts`
			);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});

		it(`should return expected whiteLabels that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			templatesData.getAvailablePubHosts().subscribe();
			templatesData.getAvailablePubHosts().subscribe();
			templatesData
				.getAvailablePubHosts()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected hosts'),
					fail
				);

			const requests = httpTestingController.match(
				`${host}admin/rest/templates/getAvailablePubHosts`
			);
			expect(requests.length).toEqual(1, 'calls to getAvailablePubHosts()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});

	describe('#publishDemo', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		let destHost = 'mock-host';
		let regexp = new RegExp(`^${host}admin/rest/templates/demo/${templateId}/${destHost}`);
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});

		it('should return status on request', () => {
			templatesData
				.publishDemo(templateId, destHost)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(_req => regexp.test(_req.url));
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#publish', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		let destHost = 'mock-host';
		let regexp = new RegExp(`^${host}admin/rest/templates/publish/${templateId}/${destHost}`);
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});

		it('should return status on request', () => {
			templatesData
				.publish(templateId, destHost)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(_req => regexp.test(_req.url));
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#commitTemplate', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		let regexp = new RegExp(`^${host}admin/rest/templates/${templateId}/commit`);
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});

		it('should return status on request', () => {
			templatesData
				.commitTemplate(templateId)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(_req => regexp.test(_req.url));
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#createTemplate', () => {
		let expectedAnswer: { status: string };
		let data: ITemplateCreateReq;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			data = {
				templateId: 'mock',
				title: 'mock',
				subjectIds: [],
				about: 'mock'
			};
		});
		it('should return status on request', () => {
			templatesData
				.createTemplate(data)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(`${host}admin/rest/templates`);
			expect(req.request.method).toEqual('POST');
		});
	});

	describe('#createClone', () => {
		let expectedAnswer: { status: string };
		let templateId = 'mock';
		let cloneName = 'mock-clone';
		let author = 'mock@mock.ru';
		let pageLess = true;

		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.createClone(templateId, cloneName, author, pageLess)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${templateId}/clone`
			);
			expect(req.request.method).toEqual('POST');
			expect(req.request.body).toBeDefined();
			expect(req.request.body.templateId).toEqual(templateId);
			expect(req.request.body.cloneName).toEqual(cloneName);
			expect(req.request.body.author).toEqual(author);
			expect(req.request.body.pageLess).toEqual(pageLess);
		});
	});

	describe('#getActiveLocalesHash', () => {
		let expectedAnswer: { [index: string]: string };

		beforeEach(() => {
			expectedAnswer = { ru: 'Russian', en: 'English' };
		});

		it('should return expected answer (called once)', () => {
			templatesData
				.getActiveLocalesHash()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected list'),
					fail
				);

			const req = httpTestingController.expectOne(`${host}admin/rest/i18n/activeLocalesHash`);
			expect(req.request.method).toEqual('GET');

			req.flush(expectedAnswer);
		});
		it(`should return expected list that got on first request 
		and shared on  other attempts (called multiple times)`, () => {
			templatesData.getActiveLocalesHash().subscribe();
			templatesData.getActiveLocalesHash().subscribe();
			templatesData
				.getActiveLocalesHash()
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected list'),
					fail
				);

			const requests = httpTestingController.match(`${host}admin/rest/i18n/activeLocalesHash`);
			expect(requests.length).toEqual(1, 'calls to getSubjects()');

			// Respond to each request with different mock hero results
			requests[0].flush(expectedAnswer);
		});
	});

	describe('#getSiteBlanks', () => {
		let expectedAnswer: { [index: string]: ISiteBlank };
		const templateId = 'test';
		beforeEach(() => {
			expectedAnswer = {
				en: {
					whitelabelsIds: [],
					ready: true
				}
			};
		});
		it('should return list of blanks', () => {
			templatesData
				.getSiteBlanks(templateId)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/templates/${templateId}/blanks`
			);
			expect(req.request.method).toEqual('GET');
		});
	});

	describe('#createSiteBlank', () => {
		let expectedAnswer: { status: string };
		const templateId = 'test';
		const lang = 'en';
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.createSiteBlank(templateId, lang)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/i18n/${templateId}/siteblank/${lang}`
			);
			expect(req.request.method).toEqual('POST');
		});
	});

	describe('#updateSiteBlank', () => {
		let expectedAnswer: { status: string };
		const templateId = 'test';
		let body: ISiteBlankUpdateBody;
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
			body = {
				lang: 'en',
				whitelabelsIds: [],
				ready: true
			}
		});
		it('should return status on request', () => {
			templatesData
				.updateSiteBlank(templateId, body)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/i18n/${templateId}/siteblank`
			);
			expect(req.request.method).toEqual('PUT');
		});
	});

	describe('#removeSiteBlank', () => {
		let expectedAnswer: { status: string };
		const templateId = 'test';
		const lang = 'en';
		beforeEach(() => {
			expectedAnswer = { status: 'ok' } as { status: string };
		});
		it('should return status on request', () => {
			templatesData
				.removeSiteBlank(templateId, lang)
				.subscribe(
					answer => expect(answer).toEqual(expectedAnswer, 'should return expected answer'),
					fail
				);

			const req = httpTestingController.expectOne(
				`${host}admin/rest/i18n/${templateId}/siteblank/${lang}`
			);
			expect(req.request.method).toEqual('DELETE');
		});
	});
});
