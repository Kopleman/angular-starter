import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { IChangePreviewDialogData } from '../../models/dialog';
import { TemplatesData } from '../../services/templates-data';

@Component({
  selector: 'change-previews-dialog',
  templateUrl: './change-previews-dialog.component.html',
  styleUrls: ['./change-previews-dialog.component.scss']
})
export class ChangePreviewsDialogComponent implements OnInit{
  @ViewChild('filesTable', {static: false}) public filesTable: MatTable<{
    uploaded: boolean;
    file: NgxFileDropEntry
  }>;
  public files: Array<{
      uploaded: boolean;
      file: NgxFileDropEntry
    }> = [];
  public displayedColumns = [];
  private availableLocales = [ 'ru' ];

  constructor(
    public dialogRef: MatDialogRef<ChangePreviewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IChangePreviewDialogData,
    private templateData: TemplatesData,
    private snackBar: MatSnackBar,
  ) {}

  public ngOnInit() {
    this.displayedColumns = [
      'relativePath',
      'fileLocale',
      'uploaded'
    ];
    this.availableLocales = this.availableLocales.concat(this.data.template.locales);
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const name = file.name.replace('.jpg', '');
          if(file.type !== 'image/jpeg'){
            this.snackBar.open(`Только jpeg`, 'Закрыть');
             return;
          }
          const fileLocale = name.split('_')[name.split('_').length - 1];
          if(this.availableLocales.indexOf(fileLocale) === -1) {
            this.snackBar.open(`Неизвестная локаль для этого шаблона: ${fileLocale}`, 'Закрыть');
            return;
          }
          const listData = {uploaded: false, fileLocale, file: droppedFile};
          this.files.push(listData);

          if (this.filesTable) {
            this.filesTable.renderRows();
          }

          this.templateData.uploadCustomPreview(
            this.data.template._id,
            file,
            droppedFile.relativePath)
            .subscribe((res) => {
              this.filesTable.renderRows();
              listData.uploaded = true;
              if(!this.data.template.overridePreviews.includes(fileLocale)){
                this.data.template.overridePreviews.push(fileLocale);
              }
            },
            errorResp => {
              this.snackBar.open(
                `Не удалось загрузить файл ${droppedFile.relativePath}: ${
                  errorResp.message
                  }`,
                'Закрыть'
              );
            });
        });
      }
    }
  }

  public onCloseClick() {
    this.dialogRef.close();
  }
}
