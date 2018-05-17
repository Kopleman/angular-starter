import { Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';

@Injectable()
export class SchemeData {
	private scheme$: Observable<any>
	constructor(private api: Api) {}

	public getScheme() {

		if(!this.scheme$) {
			this.scheme$ = this._getScheme().shareReplay(1);
		}

		return this.scheme$;
	}

	private _getScheme() {
		return this.api.get('admin/rest/templates/scheme');
	}
}
