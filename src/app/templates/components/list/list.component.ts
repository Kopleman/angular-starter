import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITemplate} from '../../models/template';
import { ISubject } from '../../models/subject';
import * as _ from 'lodash';
import { ITemplateFilters } from '../../models/template';

@Component({
  selector: 'templates-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class TemplatesListComponent {
  @Input() public templates: ITemplate[];
  @Input() public subjects: ISubject[];
  @Output()
  public onFilterChange: EventEmitter<ITemplateFilters> = new EventEmitter();
  @Output()
  public onDelete: EventEmitter<{templateId: string}> = new EventEmitter();

  public translateSubjects(subjects: string[]) {
    let ret = [];
    subjects.forEach((subjectId) => {
      let subject = _.find(this.subjects, s => s._id === subjectId);
      ret.push(subject ? subject : {_id: subjectId, title: subjectId})
    });
    return ret;
  }

  public filterTemplates($event){
    this.onFilterChange.emit($event);
  }

  public refresh($event) {
    this.onDelete.emit($event)
  }
}
