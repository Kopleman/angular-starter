import { Component, Input } from '@angular/core';
import { ITemplate } from '../../models/template';

@Component({
	selector: 'templates-list',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class TemplatesListComponent {
	@Input() public templates: ITemplate[];
}
