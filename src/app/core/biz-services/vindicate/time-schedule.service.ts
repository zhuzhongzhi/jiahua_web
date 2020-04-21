import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 工时定额表服务
 */
export namespace TimeScheduleServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class TimeScheduleServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 工时定额表列表-分页
     */
    public getScheduleList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairItem/list', filter, this.defaultConfig);
    }
    /**
     * 获取车辆类型、车辆型号列表
     */
    public getVehicleTypeList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增工时定额数据
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairItem/add', filter, this.defaultConfig);
    }
    /**
     * 编辑工时定额数据
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairItem/update', filter, this.defaultConfig);
    }
    /**
     * 删除工时定额数据
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairItem/remove', filter, this.defaultConfig);
    }
    /**
     * 获取工时
     * vehicleId：string,
     * repairItemId：string
     */
    public getWorkTime(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/repairItem/getItemAndDetail', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class TimeScheduleService extends TimeScheduleServiceNs.TimeScheduleServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
