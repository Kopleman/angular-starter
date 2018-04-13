import { Action } from '@ngrx/store';

export class CustomAction implements Action{
  public type: string;
  public module: string;
}

export enum ModuleTypes {
  TEMPLATES = 'template',
  SUBJECTS = 'subjects',
}
