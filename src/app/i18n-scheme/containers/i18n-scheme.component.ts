import { Component, OnInit } from '@angular/core';
import { TemplatesI18nData } from '../services/template-i18n-data';
import { zip } from 'rxjs/index';
import { map } from 'rxjs/operators';


@Component({
	selector: 'i18n-scheme-page',
	styleUrls: ['./i18n-scheme.component.scss'],
	templateUrl: './i18n-scheme.component.html'
})
export class I18nSchemePageComponent implements OnInit {
	public locales: any;
	public templates: any;
	constructor(private i18nData: TemplatesI18nData) {}

	public ngOnInit() {
		zip(
			this.i18nData.getTemplates(),
			this.i18nData.getActiveLocalesHash().pipe(
				map(response => {
					const locales = [];
					Object.keys(response).forEach(hash => {
						if (hash !== 'ru') {
							locales.push({
								title: response[hash],
								hash
							});
						}
					});
					return locales;
				})
			)
		).subscribe(results => {
			this.templates = results[0];
			this.locales = results[1];
		});
	}
}
