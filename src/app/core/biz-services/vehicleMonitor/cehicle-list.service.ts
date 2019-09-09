import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace CehicleListServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class CehicleListServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 车辆列表,参数类型
     */
    public getCehicleList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/cehicleList/list', filter, this.defaultConfig);
    }
    /**
     * 查询终端信息
     * 参数：deviceId
     */
    public getDeviceInfo(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/deviceInfo/search?deviceId=' + filter.deviceId, null, this.defaultConfig);
    }
    /**
     * 获取车辆状态
     * id：车辆id
     */
    public getVehicleStatus(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statusManage/getStatusByVID', filter, this.defaultConfig);
    }
    /**
     * 获取活动曲线
     * id：车辆id
     */
    public getWorkStatus(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/workStatus/getStatusByTimeSlot', filter, this.defaultConfig);
    }
    /**
     * 获取速度曲线
     * id：车辆id
     */
    public getSpeedLine(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleSpeed/getSpeedCurve', filter, this.defaultConfig);
    }

    /**
     * 获取单车基本信息
     * id：车辆id
     * runDate: 查询日期
     */
    public getVehicleBaseInfo(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/cehicleList/get', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class CehicleListService extends CehicleListServiceNs.CehicleListServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
