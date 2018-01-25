import { Component, Input } from '@angular/core';
import { ITemplate } from '../../../providers/templates-data';

@Component({
  selector: 'templates-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class TemplatesListComponent {
  @Input() public templates: ITemplate;

  public getTemplateType(template: ITemplate) {
    return 'prototype';
  }

  public getTempalteLangs(template: ITemplate) {
    return Object.keys(template.i18nTitles);
  }
}
