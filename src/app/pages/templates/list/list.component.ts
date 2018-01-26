import { Component, Input } from '@angular/core';
import { ITemplate } from '../../../providers/templates-data';

@Component({
  selector: 'templates-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class TemplatesListComponent {
  @Input() public templates: ITemplate[];
}
