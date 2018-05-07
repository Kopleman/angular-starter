import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';
import { ICustomAction } from '../models/ngrx-action';

export abstract class AbstractFilters<T> implements OnDestroy {
	public filters: T;
	public filters$: Observable<T>;
	protected actionSubjectSubscription: Subscription;

	public ngOnDestroy() {
		if (this.actionSubjectSubscription) {
			this.actionSubjectSubscription.unsubscribe();
		}
	}

	protected onInit() {
		this.filters$
			.share()
			.take(1)
			.subscribe(state => {
				this.filters = _.merge(this.filters, state);
			});
	}

	protected abstract actionFilter(action: ICustomAction): boolean;
}
