import { UsersCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class UsersRefresh implements ICustomAction {
  public readonly type = UsersCollectionActionTypes.REFRESH;
  public readonly feature = ModuleTypes.USERS;
}
