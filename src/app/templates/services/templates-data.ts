import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { Api } from '../../core/services/api';
import {
	ITemplateFilters,
	ITemplateGulpStatusResponse,
	ITemplateQueryParams,
	ITemplateResponse
} from '../models/template';

@Injectable()
export class TemplatesData {
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

	public publishDemo(templateId: string, mode: string) {
    return this.api.get(`admin/rest/templates/${templateId}/demo/`, {mode});
  }
}
