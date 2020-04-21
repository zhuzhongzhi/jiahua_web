import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 车辆信息服务
 */
export namespace VehicleManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  const URL_CHECKISDELETE ='/vehicleManage/checkIsDelete';
  export class VehicleManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 车辆是否已经被删除
     * vehicleId
     */
    public checkIsDelete(filter): Promise<any> {
      return this.http.Post(URL_CHECKISDELETE + filter, null, this.defaultConfig).toPromise();
    }
    /**
     * 车辆信息列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/list', filter, this.defaultConfig);
    }
    /**
     * 车辆信息列表All
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增车辆信息
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/insert', filter, this.defaultConfig);
    }
    /**
     * 编辑车辆信息
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个车辆信息
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/remove', filter, this.defaultConfig);
    }
    /**
     * 查询未绑定终端列表
     */
    public listUnlinked(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/listUnlinked', filter, this.defaultConfig);
    }
    /**
     * 删除绑定
     */
    public deleteLinkForDeviceInfo(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/deleteLinkForDeviceInfo', filter, this.defaultConfig);
    }
    /**
     * 建立绑定
     */
    public linkForDeviceInfo(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/linkForDeviceInfo', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class VehicleManageService extends VehicleManageServiceNs.VehicleManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
