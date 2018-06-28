import { NgModule } from '@angular/core';
import {
	MatButtonModule,
	MatIconModule,
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './navbar.component';

@NgModule({
	imports: [MatButtonModule, MatIconModule, RouterModule, CommonModule],
	exports: [NavBarComponent],
	declarations: [NavBarComponent]
})
export class NavBarModule {}
