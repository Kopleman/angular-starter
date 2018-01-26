import { Component, Input } from '@angular/core';
import { ITemplate } from '../../../providers/templates-data';


@Component({
  selector: 'templates-list-item',
  styleUrls: ['./list-item.component.scss'],
  templateUrl: './list-item.component.html'
})
export class TemplateListItemComponent {
  @Input() public template: ITemplate;

  public getTemplateType() {
    return  this.template.sourceTemplate === 'none' ? 'parent' : 'clone';
  }

  public getTempalteLangs() {
    return Object.keys(this.template.i18nTitles);
  }
}
