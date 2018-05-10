import { Injectable } from '@angular/core';
import 'rxjs/add/operator/shareReplay';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../core/services/api';
import {
	IWhiteLabel,
	IWhiteLabelFilters,
	IWhiteLabelQueryParams,
	IWhiteLabelResponse
} from '../models/white-label';
import {
	IEditWhiteLabelDialogData,
	INewWhiteLabelDialogData
} from '../models/dialog';

@Injectable()
export class WhiteLabelsData {
	constructor(private api: Api) {}

	public getWhiteLabels(
		skip: number,
		limit: number,
		filters?: IWhiteLabelFilters
	) {
		return this.api.get<IWhiteLabelResponse, IWhiteLabelQueryParams>(
			'admin/rest/whiteLabels',
			{
				skip,
				limit,
				...filters
			}
		);
	}

	public createNewWL(newWhiteLabel: INewWhiteLabelDialogData) {
		return this.api.post('admin/rest/whiteLabels', newWhiteLabel);
	}

	public editWL(whiteLabel: IEditWhiteLabelDialogData) {
		return this.api.put(`admin/rest/whiteLabels/${whiteLabel._id}`, whiteLabel);
	}

	public removeWL(whiteLabel: IWhiteLabel) {
		return this.api.delete(`admin/rest/whiteLabels/${whiteLabel._id}`);
	}
}
