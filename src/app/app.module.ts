import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import '../styles/styles.scss';
import '../styles/headings.css';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';
import { AppConfigModule } from './config.module';
import { AppComponent } from './core/containers/app.component';
import { TemplatesModule } from './templates/templates.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';

// Application wide providers
const APP_PROVIDERS = [];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
	bootstrap: [AppComponent],
	/**
	 * Import Angular's modules.
	 */
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		RouterModule.forRoot(ROUTES, {
			useHash: Boolean(history.pushState) === false,
			preloadingStrategy: PreloadAllModules
		}),
		AppConfigModule,
		CoreModule,
		AuthModule,
		TemplatesModule,
		SubjectsModule
	],
	/**
	 * Expose our Services and Providers into Angular's dependency injection.
	 */
	providers: [APP_PROVIDERS]
})
export class AppModule {}
