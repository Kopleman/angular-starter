import { Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { IWhiteLabel } from '../models/whitelabel';

@Injectable()
export class WhiteLabelsData {
	private whiteLabels$: Observable<IWhiteLabel[]>;
	constructor(private api: Api) {}

	public getWhiteLabels() {
		if (!this.whiteLabels$) {
			this.whiteLabels$ = this._getWhiteLabels();
		}
		return this.whiteLabels$;
	}

	private _getWhiteLabels() {
		return this.api
			.get<IWhiteLabel[], null>('admin/rest/whiteLabelsShort')
			.pipe( shareReplay(1) );
	}
}
