import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace WorkforceServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class WorkforceServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 获取排班管理列表
     */
    public getWorkforceList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/workforceManage/list', filter, this.defaultConfig);
    }
    /**
     * 新增排班
     * orgId：机构名称id
     * workGroupId：班组名称id
     * arrangeDate：排班日期
     * startTime：开始时间
     * arrangeDetail: {personnelId:'',orgId:'',}
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/workforceManage/add', filter, this.defaultConfig);
    }
    /**
     * 编辑排班,参数类型
     * orgId：机构名称id
     * workGroupId：班组名称id
     * arrangeDate：排班日期
     * startTime：开始时间
     * arrangeDetail: {personnelId:'',orgId:'',}
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/workforceManage/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个排班,参数类型
     * ids: 班组id数组
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/workforceManage/remove', filter, this.defaultConfig);
    }
    /**
     * 报工作量
     * 1
     */
    public updateWorkload(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/workforceManage/updateWorkload', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class WorkforceService extends WorkforceServiceNs.WorkforceServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
