import { Component, OnInit } from '@angular/core';
import { ITemplate, TemplatesData } from '../../providers/templates-data';
@Component({
	selector: 'templates-page',
	styleUrls: ['./templates.component.scss'],
	templateUrl: './templates.component.html'
})
export class TemplatesPageComponent implements OnInit {
	public templates: ITemplate[];
	constructor(private templatesData: TemplatesData) {}

	public ngOnInit() {
		this.getTemplates();
	}

	private getTemplates() {
		this.templatesData.getAllTemplates().subscribe(templates => {
			this.templates = templates;
			console.log(templates);
		});
	}
}
