import { Component, Input } from '@angular/core';
import { IColorThemes } from '../../../../providers/templates-data';


@Component({
  selector: 'color-themes',
  styleUrls: ['./color-themes.component.scss'],
  templateUrl: './color-themes.component.html'
})
export class ColorThemesComponent {
  @Input() public colorThemes: IColorThemes;

  public getColors() {
    let colors = [];
    Object.keys(this.colorThemes.site).reverse().forEach((v) => {
      colors.push(this.colorThemes.site[v].preview[0]);
    });
    return colors;
  }
}
