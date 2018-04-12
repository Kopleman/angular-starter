import { Component, Input } from '@angular/core';
import { ISubject } from '../../models/subject';


@Component({
  selector: 'subjects-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class SubjectsListComponent {
  @Input() public templates: ISubject[];
}
