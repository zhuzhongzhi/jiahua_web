import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace MaintenanceRecordServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class MaintenanceRecordServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 获取保养记录列表
     * filters 筛选条件,
     * pageNum 当前页数,
     * pageSize 每页的数量,
     * sort (string, optional)，排序
     */
    public getMaintenanceRecordList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecord/list', filter, this.defaultConfig);
    }
    /**
     * 新增保养记录
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecord/add', filter, this.defaultConfig);
    }
    /**
     * 编辑保养记录
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecord/update', filter, this.defaultConfig);
    }
    /**
     * 更新保养反馈
     */
    public updateForEvaluation(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecord/updateForEvaluation', filter, this.defaultConfig);
    }
    /**
     * 删除多个保养记录
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/maintenanceRecord/remove', filter, this.defaultConfig);
    }
    /**
     * 获取单个车辆的信息-累计里程、工作时长
     */
    public getVehicleStatus(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statusManage/getStatusByVID', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class MaintenanceRecordService extends MaintenanceRecordServiceNs.MaintenanceRecordServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
