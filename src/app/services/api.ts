import { Injectable } from '@angular/core';
import { Events, LoadingController } from 'ionic-angular';
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders
} from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';

@Injectable()
export class Api {
	private apiHost: string = 'https://ulight15.uid.me/';
	private headers: HttpHeaders = new HttpHeaders();
	constructor(
		private http: HttpClient
	)
	{
	}

	public get<T, U>(
		endPoint: string,
		search?: U,
		showLoader: boolean = true,
		headers: Object = null
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});

		let options = {
			search: this.createSearchParams(search),
			headers: this.headers
		};

		return this.http
			.get<T>(this.apiHost + endPoint, options)
			.catch(this.logError)
			.finally(() => {
				_.forEach(headers, (val, key) => {
					this.deleteHeader(key);
				});
			});
	}

	public post<T, U>(
		endPoint: string,
		body?: U,
		showLoader: boolean = true,
		headers: Object = null
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});

		let options = {
			headers: this.headers
		};

		return (
			this.http
				.post<T>(this.apiHost + endPoint, body, options)
				// .pipe(catchError(this.handleError<T>('PUT')))
				.catch(this.logError)
				.finally(() => {
					_.forEach(headers, (val, key) => {
						this.deleteHeader(key);
					});
				})
		);
	}

	public put<T, U>(
		endPoint: string,
		body?: U,
		showLoader: boolean = true,
		headers: Object = null
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});

		let options = {
			headers: this.headers
		};

		return this.http
			.put<T>(this.apiHost + endPoint, body, options)
			.catch(this.logError)
			.finally(() => {
				_.forEach(headers, (val, key) => {
					this.deleteHeader(key);
				});
			})
			.share();
	}

	public delete<T, U>(
		endPoint: string,
		showLoader: boolean = true,
		headers: Object = null
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});

		let options = {
			headers: this.headers
		};

		return this.http
			.delete<T>(this.apiHost + endPoint, options)
			.catch(this.logError)
			.finally(() => {
				_.forEach(headers, (val, key) => {
					this.deleteHeader(key);
				});
			})
			.share();
	}

	public setHeader(name: string, value: string): void {
		this.headers.set(name, value);
	}

	public deleteHeader(name: string): void {
		this.headers.delete(name);
	}

	protected createSearchParams(query: Object): URLSearchParams {
		let params = new URLSearchParams();
		_.forEach(query, (val, key) => {
			params.set(key, val.toString());
		});

		return params;
	}

	/**
	 * Обработчик не удавшихся результатов с оборачиванием в нулевой резльутат.
	 * @param result - опицонльаный параметр, значение которео следует вернутьпри нулевом результате
	 */
	private emptyResult<T>(result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead
			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	/**
	 * Обработчки ошибок
	 * @param error
	 * @returns {ErrorObservable}
	 */
	private logError(error: HttpErrorResponse) {
		console.log(error.message);
		return Observable.throw(error);
	}
}
