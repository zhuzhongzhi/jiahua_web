import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 车辆类型服务
 */
export namespace TypeManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class TypeManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 车辆类型列表
     */
    public getTypeList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/typeManage/list', filter, this.defaultConfig);
    }
    /**
     * 车辆类型列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/typeManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 保养列表
     */
    public getMaintenanceRecordList(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {
        params: filter
      };
      return this.http.Post('/maintenanceRecordItem/getItemByVehicleTypeCode', {}, config);
    }
    /**
     * 新增保养记录
     */
    public insertMaintenanceRecordItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecordItem/insert', filter, this.defaultConfig);
    }
    /**
     * 修改保养记录
     */
    public updateMaintenanceRecordItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecordItem/update', filter, this.defaultConfig);
    }
    /**
     * 删除保养记录
     */
    public removeMaintenanceRecordItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecordItem/remove', filter, this.defaultConfig);
    }

    /**
     * 点检列表
     */
    public getCheckRecordList(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {
        params: filter
      };
      return this.http.Post('/checkItem/getItemByVehicleTypeCode', {}, config);
    }
    /**
     * 新增点检记录
     */
    public insertCheckRecordItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/checkItem/insert', filter, this.defaultConfig);
    }
    /**
     * 修改点检记录
     */
    public updateCheckRecordItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/checkItem/update', filter, this.defaultConfig);
    }
    /**
     * 删除点检记录
     */
    public removeCheckRecordItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/checkItem/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class TypeManageService extends TypeManageServiceNs.TypeManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
