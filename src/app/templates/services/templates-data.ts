import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';

import { Api } from '../../core/services/api';
import {
  ITemplate,
  ITemplateCreateReq, ITemplateDemoHost,
  ITemplateFilters,
  ITemplateGulpStatusResponse,
  ITemplateQueryParams,
  ITemplateResponse
} from '../models/template';

@Injectable()
export class TemplatesData {
  private demoHosts$: Observable<ITemplateDemoHost[]>;
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


  public getAvailableDemoHosts() {
    if(!this.demoHosts$) {
      this.demoHosts$ = this._getAvailableDemoHosts();
    }
    return this.demoHosts$;
  }

	public publishDemo(templateId: string, host: string) {
    return this.api.get(`admin/rest/templates/demo/${templateId}/${host}`);
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

  private _getAvailableDemoHosts() {
    return this.api.get<ITemplateDemoHost[], null>(`admin/rest/templates/getAvailableDemoHosts`)
      .shareReplay(1);
  }
}
