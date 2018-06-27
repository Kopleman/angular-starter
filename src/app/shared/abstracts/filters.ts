import { OnDestroy } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';
import { share, take } from 'rxjs/operators';
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
			.pipe(share(), take(1))
			.subscribe(state => {
				this.filters = _.merge(this.filters, state);
			});
	}

	protected abstract actionFilter(action: ICustomAction): boolean;
}
