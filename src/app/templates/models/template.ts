export interface ITemplateFilters {
	searchStr?: string;
	selectedCategory?: string;
	sortBy?: string;
}

export interface ITemplateQueryParams extends ITemplateFilters {
	skip: number;
	limit: number;
}

export interface IEditHistory {
	user: string;
	lang: 'ru' | 'en';
	time: string;
}

export interface ILessEditHistory {
	user: string;
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
	lessEditHistory: ILessEditHistory[];
	i18nTitles: { [key: string]: string };
	locales: string[];
	i18nTags: { [key: string]: string[] };
	sourceTemplate: string;
	colorThemes: IColorThemes;
	status: 'inProcess' | 'test' | 'complete';
	cloneNames: string[];
	gulpStatus: 'stopped' | 'online';
	whitelabelsIds: string[];
  overridePreviews: string[];
}

export interface ITemplateResponse {
	count: number;
	templates: ITemplate[];
}

export interface ITemplateGulpStatusResponse {
	status: string;
}

export interface ITemplateCreateReq {
	templateId: string;
	title: string;
	subjectIds: string[];
	about: string;
}

export interface ITemplateHost {
	label: string;
	host: string;
	withDeploy?: boolean;
}

export interface ISiteBlank {
	whitelabelsIds: string[];
	ready: boolean;
}

export interface ISiteBlankUpdateBody {
	whitelabelsIds: string[];
	ready: boolean;
	lang: string;
}
