import { Injectable } from '@angular/core';
import 'rxjs/add/operator/shareReplay';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../core/services/api';
import {
  IWhiteLabelFilters,
  IWhiteLabelQueryParams,
  IWhiteLabelResponse
} from '../models/white-label';

@Injectable()
export class WhiteLabelsData {
  constructor(private api: Api) {}

  public getWhiteLabels(skip: number, limit: number, filters?: IWhiteLabelFilters) {
    return this.api.get<IWhiteLabelResponse, IWhiteLabelQueryParams>('admin/rest/whiteLabels', {
      skip,
      limit,
      ...filters
    });
  }
}
