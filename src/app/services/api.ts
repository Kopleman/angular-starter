import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders, HttpParams
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
	private headers: HttpHeaders = new HttpHeaders({'isSPA': 'true'});
	constructor(
		private http: HttpClient
	)
	{
	}

	public get<T, U>(
		endPoint: string,
		search?: U,
    withCredentials?: boolean,
		showLoader: boolean = true,
		headers: Object = null
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});
		let options = {
      HttpParams: this.createSearchParams(search),
			headers: this.headers,
      withCredentials
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
    withCredentials?: boolean,
		showLoader: boolean = true,
		headers: Object = null,
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});

		let options = {
			headers: this.headers,
      withCredentials: true
		};


		return (
			this.http
				.post<T>(this.apiHost + endPoint, body, options)
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
			headers: this.headers,
      withCredentials: true
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
			headers: this.headers,
      withCredentials: true
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
		this.headers = this.headers.set(name, value);
	}

	public deleteHeader(name: string): void {
    this.headers = this.headers.delete(name);
	}

  /**
   * Обработчик не удавшихся результатов с оборачиванием в нулевой резльутат.
   * @param result - опицонльаный параметр, значение которео следует вернутьпри нулевом результате
   */
  public emptyResult<T>(result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

	protected createSearchParams(query: Object): HttpParams {
		let params = new HttpParams();
		_.forEach(query, (val, key) => {
			params.set(key, val.toString());
		});

		return params;
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
