import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
	name: 'myMomentDate'
})
export class MomentDate implements PipeTransform {
	public transform(date: string): string {
		return moment(date).format('DD.MM.YYYY');
	}
}
