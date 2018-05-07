import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { IWhiteLabel, IWhiteLabelQueryParams } from '../../models/white-label';

@Component({
	selector: 'wl-list',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class WhiteLabelsListComponent implements OnInit {
	@Input() public whiteLabels: IWhiteLabel[];
	public displayedColumns = [];
	constructor(
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private store: Store<IWhiteLabelQueryParams>
	) {}

	public ngOnInit() {
		this.displayedColumns = ['Host ID', 'Host IP'];
	}

	public createDataSource(whiteLabels: IWhiteLabel[]) {
		return new MatTableDataSource(whiteLabels);
	}
}
