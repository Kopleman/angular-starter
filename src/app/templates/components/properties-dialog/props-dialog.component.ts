import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IChangePropsDialogData } from '../../models/dialog';
import { WhiteLabelsData } from '../../../shared/services/whitelabels-data';
import { IWhiteLabel } from '../../../shared/models/whitelabel';

@Component({
	selector: 'properties-dialog',
	templateUrl: './properties-dialog.component.html',
	styleUrls: ['./properties-dialog.component.scss']
})
export class PropsDialogComponent implements OnInit {
	public propertiesForm: FormGroup;
	public langs: string[];
	public whiteLables: IWhiteLabel[];
	public currentTags: { [key: string]: string };
	constructor(
		public dialogRef: MatDialogRef<PropsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: IChangePropsDialogData,
		private formBuilder: FormBuilder,
		private changeDetector: ChangeDetectorRef,
		private whiteLabelsData: WhiteLabelsData
	) {}

	public ngOnInit() {
		this.langs = this.getTemplateLangs();
		this.currentTags = {};
		const controls = {
			selectedSubject: [this.data.selectedSubject, Validators.required],
			selectedWhiteLabel: [this.data.selectedWhiteLabel, null]
		};
		this.langs.forEach(key => {
			const tags = this.data.template.i18nTags[key];
			this.data.newTags[key] = tags ? tags.join(',') : '';
			controls[`title-${key}`] = [this.data.template.i18nTitles[key], Validators.required];
			controls[`tag-${key}`] = [this.data.newTags[key], null];
		});
		this.propertiesForm = this.formBuilder.group(controls);
		this.whiteLabelsData.getWhiteLabels().subscribe(wls => {
			this.whiteLables = wls;
		});
		/**
		 * https://github.com/angular/angular/issues/17572
		 */
		this.changeDetector.detectChanges();
	}

	public onCloseClick() {
		this.dialogRef.close();
	}

	public onSaveClick() {
		const formData = this.propertiesForm.value;
		this.langs.forEach(key => {
			this.data.template.i18nTitles[key]  = formData[`title-${key}`];
			this.data.newTags[key] = formData[`tag-${key}`];
		});
		this.data.selectedSubject = formData.selectedSubject;
		this.data.selectedWhiteLabel = formData.selectedWhiteLabel;

		this.dialogRef.close(this.data);
	}

	public getTemplateLangs() {
    const langs = [ 'ru' ].concat(this.data.template.locales);
    /**
     * Подымае ру и ен локаль в топ
     */
    return langs
      .sort((lang) => lang === 'ru' ? -1 : 1)
      .sort((lang) => {
        if (lang === 'ru') {
          return  0;
        }
        return lang === 'en' ? -1 : 1;
      });
	}
}
