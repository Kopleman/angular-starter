import { Change } from './filters-change.action';
import { Reset } from './filters-reset.action';

export enum FiltersActionTypes {
  CHANGE = '[Filters] Change',
  RESET = '[Filters] Reset',
}

export type FiltersActionsUnion =
  | Change
  | Reset;
