import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';

export namespace WorkBoardServiceNs {
  
  export interface ResponseModel<T> extends HttpUtilNs.UfastHttpRes {
    value: T;
  }
  export class WorkBoardServiceClass {
    private http: HttpUtilService;
    constructor(injector: Injector) {
      this.http = injector.get(HttpUtilService);
    }
  }
}
@Injectable()
export class WorkBoardService extends WorkBoardServiceNs.WorkBoardServiceClass{
  constructor(injector: Injector) {
    super(injector);
  }
}
