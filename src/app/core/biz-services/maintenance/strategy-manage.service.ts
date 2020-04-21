import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 保养策略服务
 */
export namespace StrategyManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class StrategyManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 保养策略列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/MaintenanceStrategy/list', filter, this.defaultConfig);
    }
    /**
     * 新增保养策略
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/MaintenanceStrategy/add', filter, this.defaultConfig);
    }
    /**
     * 编辑保养策略
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/MaintenanceStrategy/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个保养策略
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/MaintenanceStrategy/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class StrategyManageService extends StrategyManageServiceNs.StrategyManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
