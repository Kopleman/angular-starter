import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { IChangePropsDialogData } from '../../models/dialog';
import { WhiteLabelsData } from '../../services/whitelabels-data';
import { IWhiteLabel } from '../../models/whitelabel';

@Component({
  selector: 'properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.scss'],
})
export class PropertiesDialogComponent implements OnInit{
  public propertiesForm: FormGroup;
  public langs: string[];
  public whiteLables: IWhiteLabel[];
  public currentTags: { [key: string]: string };
  constructor(
    public dialogRef: MatDialogRef<PropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IChangePropsDialogData,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private whiteLabelsData: WhiteLabelsData) { }

  public ngOnInit() {
    this.langs = this.getTemplateLangs();
    this.currentTags = {};
    let controls = {
      selectedSubject: [null, Validators.required],
      selectedWhiteLabel: [null, null],
    };
    this.langs.forEach((key) => {
      controls[`title-${key}`] = [null, Validators.required];
      controls[`tag-${key}`] = [null, null];
      let tags = this.data.template.i18nTags[key];
      this.currentTags[key] = tags ? tags.join(',') : '';
    });
    this.propertiesForm = this.formBuilder.group(controls);
    this.whiteLabelsData.getWhiteLabels().subscribe((wls) => {
      this.whiteLables = wls;
    });
    /**
     * https://github.com/angular/angular/issues/17572
     */
    this.changeDetector.detectChanges();
  }

  public onTagsChange(lang) {
    this.data.template.i18nTags[lang] = this.currentTags[lang].split(',').map((v) => v.trim());
  }

  public onCloseClick() {
    this.dialogRef.close();
  }

  public getTemplateLangs() {
    return Object.keys(this.data.template.i18nTitles);
  }
}
