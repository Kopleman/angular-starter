import { Component } from '@angular/core';
import { UserData } from '../../providers/user-data';
@Component({
  selector: 'templates-page',
  styleUrls: ['./templates.component.scss'],
  templateUrl: './templates.component.html'
})
export class TemplatesPageComponent {

  constructor(private userData: UserData) {}
}
