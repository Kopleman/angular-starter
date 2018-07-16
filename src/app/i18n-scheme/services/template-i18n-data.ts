import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Api } from '../../core/services/api';

@Injectable()
export class TemplatesI18nData {
	private activeLocalesHash$: Observable<{ [index:string]: string }>;
	constructor(private api: Api) {}

	public getActiveLocalesHash() {
		if (!this.activeLocalesHash$) {
			this.activeLocalesHash$ = this._getActiveLocalesHash().pipe( shareReplay(1) );
		}
		return this.activeLocalesHash$;
	}

	public getTemplates() {
		return this.api.get(`admin/rest/i18n/templates`);
	}

	private _getActiveLocalesHash() {
		return this.api.get<{[index: string]: string}, null>(`admin/rest/i18n/activeLocalesHash`);
	}
}
