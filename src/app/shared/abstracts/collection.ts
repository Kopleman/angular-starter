import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { ICustomAction } from '../models/ngrx-action';

export abstract class Collection<T, U> implements OnDestroy {
	public collection: T;
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;
	protected actionSubjectSubscription: Subscription;
	protected filters$: Observable<U>;

	public ngOnDestroy() {
		if (this.actionSubjectSubscription) {
			this.actionSubjectSubscription.unsubscribe();
		}
	}

	protected abstract actionFilter(action: ICustomAction): boolean;
}
