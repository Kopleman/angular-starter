import { Injectable } from '@angular/core';
import { Api } from '../services/api';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

export interface ITemplateFilters {
  searchStr?: string;
  selectedCategory?: string;
}

export interface ITemplateQueryParams extends ITemplateFilters{
	skip: number;
	limit: number;
}
export interface IEditHistory {
	user: string;
	lang: 'ru' | 'en';
	time: string;
}
export interface IColorThemeBlock {
	preview: string[];
	previewColorBlock: string[];
}
export interface IColorThemes {
	default: {
		site: { [key: string]: IColorThemeBlock };
	};
	site: { [key: string]: IColorThemeBlock };
}
export interface ITemplate {
	_id: string;
	subjectIds: string[];
	dateCreate: string;
	title: string;
	author: {
		email: string;
	};
	editHistory: IEditHistory[];
	i18nTitles: { [key: string]: string };
	sourceTemplate: string;
	colorThemes: IColorThemes;
	status: string;
	cloneNames: string[];
  gulpStatus: 'stopped' | 'online';
}

export interface ITemplateResponse {
	count: number;
	templates: ITemplate[];
}

export interface ITemplateGulpStatusResponse {
  status: string;
}

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
	public getTemplates(
		skip: number,
		limit: number,
		filters?: ITemplateFilters
	) {
		return this.api.get<ITemplateResponse, ITemplateQueryParams>(
			'admin/rest/templates',
			{ skip, limit, ...filters }
		);
		// .pipe(catchError(this.api.emptyResult([])));
	}

  public changeGulpStatus(templateId: string, action: string) {
    return this.api.post<ITemplateGulpStatusResponse, {action: string}>(
      `admin/rest/templates/${templateId}/changePm2GulpStatus`, {action}
    );
  }

  public delete(templateId: string) {
    return this.api.delete(
      `admin/rest/templates/${templateId}`
    );
  }

  public refreshSettings(templateId: string) {
	  return this.api.get(`admin/rest/templates/${templateId}/settings/reload`);
  }

  public refreshCloneSettings(templateId: string) {
    return this.api.get(`admin/rest/templates/${templateId}/settingsClones/reload`);
  }
}
