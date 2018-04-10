import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'subjects-page',
	styleUrls: ['./subjects.component.scss'],
	templateUrl: './subjects.component.html'
})
export class SubjectsPageComponent implements OnInit {
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;

	public ngOnInit() {
		console.log('inited');
	}
}
