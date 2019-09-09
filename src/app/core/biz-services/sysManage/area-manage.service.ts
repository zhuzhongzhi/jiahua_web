import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 地区服务
 */
export namespace AreaManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class AreaManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 地区列表
     */
    public getAreaList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/sysArea/findAreas', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class AreaManageService extends AreaManageServiceNs.AreaManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
