import { UsersCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class UsersPaginate implements ICustomAction {
  public readonly type = UsersCollectionActionTypes.PAGINATE;
  public readonly feature = ModuleTypes.USERS;
  constructor(public skip: number, public limit: number) {}
}
