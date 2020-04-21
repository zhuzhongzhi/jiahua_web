import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {gatewayKey, environment} from '../../../../environments/environment';

export namespace HttpUtilNs {
  export interface UfastResListT<T> {
    endRow: number;
    firstPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    lastPage: number;
    nextPage: number;
    pageNum: number;
    pageSize: number;
    pages: number;
    prePage: number;
    size: number;
    startRow: number;
    total: number;
    orderBy?: string;
    navigatePages: number;
    navigatepageNums: number[];
    list: T[];
  }
  export interface UfastHttpRes {
    code: number;
    message: string;
  }
  export interface UfastFilterBody {
    filters: { [key: string]: any };
    pageSize: number;
    pageNum: number;
  }
  export interface UfastHttpResT<T> {
    code: number;
    message: string;
    value: T;
  }
  export const GatewayKey = gatewayKey;

  export interface UfastHttpConfig {
    gateway?: string;
    headers?: HttpHeaders;
    params?: { [param: string]: string } | undefined;
  }

  export class HttpUtilServiceClass {
    private http: HttpClient;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpClient);
    }

    public getFullUrl(baseUrlName: string, path: string): string {

      return environment.baseUrl[baseUrlName] + path;
    }

    private setOptions(params?: any, headers?: HttpHeaders,
                       observe: 'body' | 'event' = 'body',
                       reportProgress: boolean = false) {
      const options: any = {
        headers: headers,
        params: new HttpParams({
          fromObject: params
        }),
        observe: observe,
        reportProgress: reportProgress
      };
      return options;
    }



    public Get<T>(path: string, params?: { [param: string]: string } | undefined, config?: UfastHttpConfig | undefined): Observable<any> {
      let baseUrlName = GatewayKey.Bs;
      let headers = null;
      if (!!config) {
        if (!!config.gateway) {
          baseUrlName = config.gateway;
        }
        if (!!config.headers) {
          headers = config.headers;
        }
      }
      return this.http.get<T>(this.getFullUrl(baseUrlName, path), this.setOptions(params, headers));
    }

    public Post<T>(path: string, body?: any, config?: UfastHttpConfig | undefined): Observable<any> {
      let baseUrlName = GatewayKey.Bs;
      let headers = null;
      let params = null;
      if (!!config) {
        if (!!config.gateway) {
          baseUrlName = config.gateway;
        }
        if (!!config.headers) {
          headers = config.headers;
        }
        if (!!config.params) {
          params = config.params;
        }
      }
      return this.http.post<T>(this.getFullUrl(baseUrlName, path), body, this.setOptions(params, headers));
    }

    public Put<T>(path: string, body?: any, config?: UfastHttpConfig | undefined): Observable<any> {
      let baseUrlName = GatewayKey.Bs;
      let headers = null;
      let params = null;
      if (!!config) {
        if (!!config.gateway) {
          baseUrlName = config.gateway;
        }
        if (!!config.headers) {
          headers = config.headers;
        }
        if (!!config.params) {
          params = config.params;
        }
      }
      return this.http.put<T>(this.getFullUrl(baseUrlName, path), body, this.setOptions(params, headers));
    }

    public Delete<T>(path: string, params?: { [param: string]: string } | undefined,
                     config?: UfastHttpConfig | undefined): Observable<any> {
      let baseUrlName = GatewayKey.Bs;
      let headers = null;
      if (!!config) {
        if (!!config.gateway) {
          baseUrlName = config.gateway;
        }
        if (!!config.headers) {
          headers = config.headers;
        }
      }
      return this.http.delete<T>(this.getFullUrl(baseUrlName, path), this.setOptions(params, headers));
    }

    public Head<T>(path: string, params?: { [param: string]: string } | undefined,
                     config?: UfastHttpConfig | undefined): Observable<any> {
      let baseUrlName = GatewayKey.Bs;
      let headers = null;
      if (!!config) {
        if (!!config.gateway) {
          baseUrlName = config.gateway;
        }
        if (!!config.headers) {
          headers = config.headers;
        }
      }
      return this.http.head<T>(this.getFullUrl(baseUrlName, path), this.setOptions(params, headers));
    }

    public Options<T>(path: string, params?: { [param: string]: string } | undefined,
                   config?: UfastHttpConfig | undefined): Observable<any> {
      let baseUrlName = GatewayKey.Bs;
      let headers = null;
      if (!!config) {
        if (!!config.gateway) {
          baseUrlName = config.gateway;
        }
        if (!!config.headers) {
          headers = config.headers;
        }
      }
      return this.http.options<T>(this.getFullUrl(baseUrlName, path), this.setOptions(params, headers));
    }
  }
}
@Injectable()
export class HttpUtilService extends HttpUtilNs.HttpUtilServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}



