import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { IUser, IUserQueryParams } from '../models/user';
import { UsersData } from '../services/users-data';
import { Collection } from '../../shared/abstracts/collection';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { ISubjectFilters } from '../../subjects/models/subject';
import { PageEvent } from '@angular/material';
import { UsersPaginate } from '../store/actions';

@Component({
	selector: 'users-page',
	styleUrls: ['./users.component.scss'],
	templateUrl: './users.component.html'
})
export class UsersPageComponent extends Collection<IUser[], IUserQueryParams>
	implements OnInit{
	constructor(private usersData: UsersData,
  private actionSubject: ActionsSubject,
  private store: Store<IUserQueryParams>) {
		super();
	}

	public ngOnInit() {
    this.filters$ = this.store.pipe(select(ModuleTypes.USERS));
    this.filters$.share().take(1).subscribe((state) => {
      this.pageIndex = state.skip / state.limit;
      this.pageSize = state.limit;
      this.getUsers(state);
    }).unsubscribe();

    this.actionSubjectSubscription = this.actionSubject
      .skip(1)
      .filter((action: ICustomAction) =>  this.actionFilter(action))
      .subscribe(() => {
        this.filters$.take(1).subscribe((state) => {
          this.getUsers(state);
        }).unsubscribe();
      });
  }

  public paginate($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    let skip = this.pageIndex * this.pageSize;
    this.store.dispatch(new UsersPaginate(skip, this.pageSize));
  }

  public createNewUser() {
	  console.log('stub');
  }

  protected actionFilter(action) {
    return action.feature === ModuleTypes.USERS;
  }

  private getUsers(state) {
    this.inProgress = true;
    let filters: ISubjectFilters = {
      searchStr: state.searchStr,
      sortBy: state.sortBy
    };

    this.usersData.getUsers(state.skip, state.limit, filters)
      .shareReplay()
      .subscribe(response => {
        this.inProgress = false;
        this.total = response.count;
        this.collection = response.users;
      });
  }
}
