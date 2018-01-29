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

/**
 * Обертка над ангуларовым HttpClient для работы с бэкендом
 */
@Injectable()
export class Api {
  /**
   * Хост для запросов, с настроеным на нем CORS(!)
   * @type {string}
   */
	private apiHost: string = 'https://ulight15.uid.me/';
  /**
   * Имутабельный обьект заголовков
   * Добавленый isSPA — костыль для текущего бэкенда(29.01.2018)
   * В противном случае, любой запросы к потрохам бэкенда, в случае не авторизации приводит к 302
   * (UKIT: routes/user.js)
   * @type {HttpHeaders}
   */
	private headers: HttpHeaders = new HttpHeaders({'isSPA': 'true'});
	constructor(
		private http: HttpClient
	)
	{
	}

  /**
   * Обертка для GET запросов, устаналивает заголовки, query-параметры
   * @param {string} endPoint — конечная точка бэка куда стучимся
   * @param {U} search Объект — Объект query-параметров
   * @param {boolean} withCredentials — флаг что мы делаем запрос с авторизацие(отправляем куку)
   * @param {Object} headers — Объект доп. заголовков
   * @returns {Observable<T>}
   */
	public get<T, U extends Object>(
		endPoint: string,
		search: U = null,
    withCredentials: boolean = true,
    headers: Object = null,
	): Observable<T> {
		_.forEach(headers, (val, key) => {
			this.setHeader(key, val.toString());
		});
		let options = {
      params: this.createSearchParams(search),
			headers: this.headers,
      withCredentials
		};

		return this.http
			.get<T>(`${this.apiHost}${endPoint}`, options)
			.catch(this.logError)
			.finally(() => {
				_.forEach(headers, (val, key) => {
					this.deleteHeader(key);
				});
			});
	}

  /**
   * Обертка для POST запросов
   * @param {string} endPoint — конечная точка бэка куда стучимся
   * @param {U} body — Объект body-параметров
   * @param {boolean} withCredentials — флаг что мы делаем запрос с авторизацие(отправляем куку)
   * @param {Object} headers — Объект доп. заголовков
   * @returns {Observable<T>}
   */
	public post<T, U extends Object>(
		endPoint: string,
		body: U = null,
    withCredentials: boolean = true,
    headers: Object = null
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
				.post<T>(`${this.apiHost}${endPoint}`, body, options)
				.catch(this.logError)
				.finally(() => {
					_.forEach(headers, (val, key) => {
						this.deleteHeader(key);
					});
				})
		);
	}

  /**
   * Обертка для PUT запросов
   * @param {string} endPoint — конечная точка бэка куда стучимся
   * @param {U} body — Объект body-параметров
   * @param {Object} headers — Объект доп. заголовков
   * @returns {Observable<T>}
   */
	public put<T, U>(
		endPoint: string,
		body: U = null,
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
			.put<T>(`${this.apiHost}${endPoint}`, body, options)
			.catch(this.logError)
			.finally(() => {
				_.forEach(headers, (val, key) => {
					this.deleteHeader(key);
				});
			})
			.share();
	}

  /**
   * Обертка для DELETE запросов
   * @param {string} endPoint — конечная точка бэка куда стучимся
   * @param {Object} headers — Объект body-параметров
   * @returns {Observable<T>} — Объект доп. заголовков
   */
	public delete<T, U>(
		endPoint: string,
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
			.delete<T>(`${this.apiHost}${endPoint}`, options)
			.catch(this.logError)
			.finally(() => {
				_.forEach(headers, (val, key) => {
					this.deleteHeader(key);
				});
			})
			.share();
	}

  /**
   * Добавить заголовок
   * @param {string} name
   * @param {string} value
   */
	public setHeader(name: string, value: string): void {
		this.headers = this.headers.set(name, value);
	}

  /**
   * Удалить заголовок
   * @param {string} name
   */
	public deleteHeader(name: string): void {
    this.headers = this.headers.delete(name);
	}

  /**
   * Обработчик не удавшихся результатов с оборачиванием в нулевой резльтат.
   * То есть можно добавить это в pipe() запроса и тогда вместо ошибки мы просто получим пустой
   * обьект результата, без падения преложения
   * @param result - опциональный параметр, значение которое следует вернуть при нулевом результате
   */
  public emptyResult<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  /**
   * Прогоняет парааметры запроса через HttpParams, готовый для использывания в запросе
   * @param {Object} query
   * @returns {HttpParams}
   */
	protected createSearchParams(query: Object): HttpParams {
		let params = new HttpParams();
		_.forEach(query, (val, key) => {
		  if(val !== null && key) {
        params = params.set(key, val.toString());
      }
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
