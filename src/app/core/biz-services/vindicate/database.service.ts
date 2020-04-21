import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 维修资料服务
 */
export namespace DatabaseServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class DatabaseServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 维修资料列表,参数类型
     */
    public getDatabaseList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairManul/list', filter, this.defaultConfig);
    }
    /**
     * 新增维修资料
     * vehicleTypeCode ：车辆类型编码
     * vehicleModeId ：车辆型号
     * manualName ：资料名称
     * manualContent ：资料简介
     * filePath : 存放地址
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairManul/add', filter, this.defaultConfig);
    }
    /**
     * 编辑维修资料
     * vehicleTypeCode ：车辆类型编码
     * vehicleModeId ：车辆型号
     * manualName ：资料名称
     * manualContent ：资料简介
     * filePath : 存放地址
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairManul/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个维修资料,参数类型
     * ids: 维修资料id数组
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairManul/remove', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class DatabaseService extends DatabaseServiceNs.DatabaseServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
