import { Component, Input, OnInit } from '@angular/core';
import { ISubject } from '../../models/subject';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'subjects-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class SubjectsListComponent implements OnInit{
  @Input() public subjects: ISubject[];
  public displayedColumns = [];

  public ngOnInit() {
    this.displayedColumns = ['_id', 'title', 'controls'];
  }

  public createDataSource(subjects: ISubject[]) {
    return new MatTableDataSource(subjects);
  }
}
