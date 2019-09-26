import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';

export namespace LatheManageServiceNs {

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class LatheManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }

    /**
     * 丝车列表（精确）
     */
    public getWagonList(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/list', filter, config);
    }

    /**
     * 丝车列表（模糊）
     * @param filter
     */
    public getWagonListWithPageCondition(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/allWagonPageCondtion', filter, config);
    }

  }

}

@Injectable()
export class LatheManageService extends LatheManageServiceNs.LatheManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
