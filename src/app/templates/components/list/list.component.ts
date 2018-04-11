import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITemplate } from '../../models/template';
import { ISubject } from '../../models/subject';
import { ITemplateFilters } from '../../models/template';

@Component({
	selector: 'templates-list',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class TemplatesListComponent {
	@Input() public templates: ITemplate[];
}
