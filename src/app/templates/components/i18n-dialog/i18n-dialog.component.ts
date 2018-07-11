import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ii18NDialogData } from '../../models/dialog';
import { TemplatesData } from '../../services/templates-data';
import { map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs/index';
import { ISiteBlank } from '../../models/template';
import { WhiteLabelsData } from '../../../shared/services/whitelabels-data';
import { IWhiteLabel } from '../../../shared/models/whitelabel';
import { AuthService } from '../../../auth/services/auth';

@Component({
	selector: 'i18n-dialog',
	templateUrl: './i18n-dialog.component.html',
	styleUrls: ['./i18n-dialog.component.scss']
})
export class I18nDialogComponent implements OnInit {
	public siteBlanksForm: FormGroup;
	public activeLangs: string[];
	public siteBlanks: { [index: string]: ISiteBlank };
	public whiteLables: IWhiteLabel[];
	public isAllowedToCommit$: Observable<boolean>;
	constructor(
		public dialogRef: MatDialogRef<I18nDialogComponent>,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Ii18NDialogData,
		private snackBar: MatSnackBar,
		private templatesData: TemplatesData,
		private auth: AuthService,
		private whiteLabelsData: WhiteLabelsData
	) {}

	public ngOnInit() {
		this.isAllowedToCommit$ = this.auth.allowToCommit();
		const activeLangs$ = this.templatesData.getActiveLocalesHash().pipe(
			map(response => {
				return Object.keys(response);
			})
		);
		const siteBlanks$ = this.templatesData.getSiteBlanks(this.data.template._id);
		const whiteLables$ = this.whiteLabelsData.getWhiteLabels();
		zip(activeLangs$, siteBlanks$, whiteLables$).subscribe(results => {
			const langs = results[0];
			const index = langs.indexOf('ru');
			if (index > -1) {
				langs.splice(index, 1);
			}
			this.activeLangs = langs;
			const blanks = results[1];
			this.siteBlanks = blanks;
			this.whiteLables = results[2];
			let controls = {};
			this.activeLangs.forEach(key => {
				controls[`ready-${key}`] = blanks[key]
					? [{ value: blanks[key].ready, disabled: blanks[key].ready }, null]
					: [false, null];
				controls[`wl-${key}`] =
					blanks[key] && blanks[key].whitelabelsIds && blanks[key].whitelabelsIds.length
						? [blanks[key].whitelabelsIds[0], null]
						: ['', null];
			});
			this.siteBlanksForm = this.formBuilder.group(controls);
		});
	}

	public onCloseClick() {
		this.dialogRef.close();
	}

	public saveBlankData(lang) {
		const blank = this.siteBlanks[lang];

		if (!blank) {
			return;
		}
		const body = {
			ready: this.siteBlanksForm.get(`ready-${lang}`).value,
			whitelabelsIds: [this.siteBlanksForm.get(`wl-${lang}`).value],
			lang
		};
		this.snackBar.open(`Сохраняем изменения в локали`, 'Закрыть');
		this.templatesData.updateSiteBlank(this.data.template._id, body).subscribe(
			() => {
				this.snackBar.open(`Изменения сохранены`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(
					`Произошла ошибка при сохранений: ${errorResp.message}`,
					'Закрыть'
				);
			}
		);
	}

	public deleteBlank(lang) {
		this.snackBar.open(`Удаляем локаль ${lang}`, 'Закрыть');
		this.templatesData.removeSiteBlank(this.data.template._id, lang).subscribe(
			() => {
				this.snackBar.open(`Локаль удалена`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(`Произошла ошибка при удалений: ${errorResp.message}`, 'Закрыть');
			}
		);
	}
}
