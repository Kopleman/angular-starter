import { UsersCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class UsersResetFilters implements ICustomAction {
  public readonly type = UsersCollectionActionTypes.RESET_FILTERS;
  public readonly feature = ModuleTypes.USERS;
}
