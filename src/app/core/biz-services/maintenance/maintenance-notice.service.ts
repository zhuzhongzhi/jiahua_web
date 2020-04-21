
import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 保养提醒服务
 */
export namespace MaintenanceNoticeServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class MaintenanceNoticeServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 保养提醒列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRemaind/list', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class MaintenanceNoticeService extends MaintenanceNoticeServiceNs.MaintenanceNoticeServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
