import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './navbar.component';

@NgModule({
	imports: [MatButtonModule, MatIconModule, RouterModule, CommonModule],
	exports: [NavBarComponent],
	declarations: [NavBarComponent]
})
export class NavBarModule {}
