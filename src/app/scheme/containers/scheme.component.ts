import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { SchemeData } from '../services/scheme-data.service';

@Component({
	selector: 'scheme-page',
	styleUrls: ['./scheme.component.scss'],
	templateUrl: './scheme.component.html'
})
export class SchemePageComponent implements OnInit{
	@ViewChild('accordion') public accordion: MatAccordion;
	public tiers: any;

	constructor(private schemaData: SchemeData) {}

	public ngOnInit() {
		this.schemaData.getScheme().subscribe((schema) => this.tiers = schema);
	}
}
