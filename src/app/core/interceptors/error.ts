import 'rxjs/add/operator/do';
import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private injector: Injector) {}
	public intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(req).do(
			(event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					console.log(event);
				}
			},
			(err: any) => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 403 || err.status === 401) {
						const userData = this.injector.get(AuthService);
						userData.logout();
					}
				}
			}
		);
	}
}
