import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Api } from '../../core/services/api';
import {
	ITemplate,
	ITemplateCreateReq,
	ITemplateHost,
	ITemplateFilters,
	ITemplateGulpStatusResponse,
	ITemplateQueryParams,
	ITemplateResponse, ISiteBlank, ISiteBlankUpdateBody
} from '../models/template';

@Injectable()
export class TemplatesData {
	private demoHosts$: Observable<ITemplateHost[]>;
	private pubHosts$: Observable<ITemplateHost[]>;
	private activeLocalesHash$: Observable<{ [index:string]: string }>;
	constructor(private api: Api) {}

	/**
	 * Получить шаблоны с бэкенда
	 * @param {number} skip — количество элементов дл пропуска
	 * @param {number} limit — лимит выдаваемых
	 * @param {string} filters — различные фильтры для коллекции
	 * @returns {Observable<ITemplateResponse>}
	 */
	public getTemplates(skip: number, limit: number, filters?: ITemplateFilters) {
		return this.api.get<ITemplateResponse, ITemplateQueryParams>(
			'admin/rest/templates',
			{ skip, limit, ...filters }
		);
		// .pipe(catchError(this.api.emptyResult([])));
	}

	public changeGulpStatus(templateId: string, action: string) {
		return this.api.post<ITemplateGulpStatusResponse, { action: string }>(
			`admin/rest/templates/${templateId}/changePm2GulpStatus`,
			{ action }
		);
	}

	public delete(templateId: string) {
		return this.api.delete(`admin/rest/templates/${templateId}`);
	}

	public refreshSettings(templateId: string) {
		return this.api.get(`admin/rest/templates/${templateId}/settings/reload`);
	}

	public refreshCloneSettings(templateId: string) {
		return this.api.get(
			`admin/rest/templates/${templateId}/settingsClones/reload`
		);
	}

	public compileClones(templateId: string) {
		return this.api.get(`admin/rest/templates/${templateId}/compileClones`);
	}

	public compileAll() {
		return this.api.get(`admin/rest/templates/compileAllTemplates`);
	}

	public createClone(
		templateId: string,
		cloneName: string,
		author: string,
		pageLess: boolean
	) {
		return this.api.post(`admin/rest/templates/${templateId}/clone`, {
			templateId,
			cloneName,
			author,
			pageLess
		});
	}

	public getAvailablePubHosts() {
		if (!this.pubHosts$) {
			this.pubHosts$ = this._getAvailablePubHosts().pipe( shareReplay(1) );
		}
		return this.pubHosts$;
	}

	public getAvailableDemoHosts() {
		if (!this.demoHosts$) {
			this.demoHosts$ = this._getAvailableDemoHosts().pipe( shareReplay(1) );
		}
		return this.demoHosts$;
	}

	public publishDemo(templateId: string, host: string) {
		return this.api.get(`admin/rest/templates/demo/${templateId}/${host}`);
	}
	public publish(templateId: string, host: string) {
		return this.api.get(`admin/rest/templates/publish/${templateId}/${host}`);
	}

	public createTemplate(data: ITemplateCreateReq) {
		return this.api.post('admin/rest/templates', data);
	}

	public updateSettings(template: ITemplate) {
		return this.api.put(`admin/rest/templates/${template._id}/saveProps`, {
			subjectIds: template.subjectIds,
			whitelabelsIds: template.whitelabelsIds,
			i18nTitles: template.i18nTitles,
			i18nTags: template.i18nTags
		});
	}

	public commitTemplate(templateId: string) {
		return this.api.get(`admin/rest/templates/${templateId}/commit`);
	}

	public getActiveLocalesHash() {
		if (!this.activeLocalesHash$) {
			this.activeLocalesHash$ = this._getActiveLocalesHash().pipe( shareReplay(1) );
		}
		return this.activeLocalesHash$;
	}


	public getSiteBlanks(templateId) {
		return this.api.get<{ [index: string]: ISiteBlank }, null>(
			`admin/rest/templates/${templateId}/blanks`
		);
	}

	public createSiteBlank(templateId, lang: string) {
		return this.api.post(`admin/rest/i18n/${templateId}/siteblank/${lang}`);
	}

	public updateSiteBlank(temlateId, body: ISiteBlankUpdateBody) {
			return this.api.put(`admin/rest/i18n/${temlateId}/siteblank`, body);
	}

	public removeSiteBlank(temlateId, lang: string) {
		return this.api.delete(`admin/rest/i18n/${temlateId}/siteblank/${lang}`);
	}

	public changeTemplateStatus(templateId, status: 'inProcess' | 'test' | 'complete') {
    return this.api.put(`admin/rest/templates/${templateId}/setStatus`, {status});
  }

  public uploadCustomPreview(templateId, file, relativePath) {
    const formData = new FormData();
    formData.append('preview', file, relativePath);
	  return this.api.put(`admin/rest/templates/${templateId}/uploadCustomPreview`, formData);
  }

	private _getActiveLocalesHash() {
		return this.api.get<{[index: string]: string}, null>(`admin/rest/i18n/activeLocalesHash`);
	}

	private _getAvailableDemoHosts() {
		return this.api.get<ITemplateHost[], null>(
			`admin/rest/templates/getAvailableDemoHosts`
		);
	}

	private _getAvailablePubHosts() {
		return this.api.get<ITemplateHost[], null>(
			`admin/rest/templates/getAvailablePubHosts`
		);
	}
}
