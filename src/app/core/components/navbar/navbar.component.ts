import { Component, NgModule, OnInit } from '@angular/core';
import { IProfile, AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent implements OnInit{
  public profile: IProfile ;
  constructor(private userData: AuthService) {}
  get sections() {
    return {
      templates: 'Шаблоны'
    };
  }

  get sectionKeys() {
    return ['templates'];
  }

  public logout() {
    this.userData.logout();
  }

  public ngOnInit() {
    this.userData.getProfile().subscribe((profile) => {
      this.profile = profile;
    });
  }
}
