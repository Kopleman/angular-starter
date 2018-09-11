// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//   inject,
//   async,
//   TestBed,
//   ComponentFixture
// } from '@angular/core/testing';
//
// /**
//  * Load the implementations that should be tested
//  */
// import { AppComponent } from './app.component';
// import { AppState } from './app.service';
// import { AuthService } from '../../auth/services/auth';
// import { Api } from '../services/api';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { AppConfigModule } from '../../config.module';
// import { Router } from '@angular/router';
// const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
// describe(`App`, () => {
//   let comp: AppComponent;
//   let fixture: ComponentFixture<AppComponent>;
//
//   /**
//    * async beforeEach
//    */
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
// 	    imports: [HttpClientTestingModule, AppConfigModule],
//       declarations: [ AppComponent ],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [{ provide: Router,      useValue: routerSpy }, Api, AuthService]
//     })
//     /**
//      * Compile template and css
//      */
//     .compileComponents();
//   }));
//
//   /**
//    * Synchronous beforeEach
//    */
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     comp    = fixture.componentInstance;
//
//     /**
//      * Trigger initial data binding
//      */
//     fixture.detectChanges();
//   });
//
//   it(`should be readly initialized`, () => {
//     expect(fixture).toBeDefined();
//     expect(comp).toBeDefined();
//   });
//
//
// 	it('should log ngOnInit', () => {
// 		spyOn(console, 'log');
// 		expect(console.log).not.toHaveBeenCalled();
//
// 		// comp.ngOnInit();
// 		expect(console.log).toHaveBeenCalled();
// 	});
//
// });
