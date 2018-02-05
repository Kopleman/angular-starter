import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { ITemplate } from '../../../providers/templates-data';
import { ISubject } from '../../../providers/subjects-data';


@Component({
  selector: 'templates-list-item',
  styleUrls: ['./list-item.component.scss'],
  templateUrl: './list-item.component.html'
})
export class TemplateListItemComponent {
  @Input() public subjects: ISubject[];
  @Input() public template: ITemplate;

  public getTemplateType() {
    return  this.template.sourceTemplate === 'none' ? 'parent' : 'clone';
  }

  public getTempalteLangs() {
    return Object.keys(this.template.i18nTitles);
  }

  /**
   * Переводить название сабжекта
   * TODO: Возможно тут лучше не пробрасывать сабжекты от родителя, а сделать через @Output
   * @param {string} subjectId
   * @returns {string}
   */
  public translateSubject(subjectId: string) {
    let subject = _.find(this.subjects, (s) => s._id === subjectId);
    return subject ? subject.title : subjectId;
  }
}
