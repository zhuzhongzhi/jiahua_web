import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 加油记录服务
 */
export namespace RefuelRecordServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class RefuelRecordServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 加油记录列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/refuelRecord/listOilRecord', filter, this.defaultConfig);
    }
    /**
     * 加油记录列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/refuelRecord/searchList', filter, this.defaultConfig);
    }
    /**
     * 获取加油曲线
     * "runDate": "string" 查询日期
     * "vehicleId": "string" 车辆id
     */
    public getOilLine(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/refuelRecord/getOilCurve', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class RefuelRecordService extends RefuelRecordServiceNs.RefuelRecordServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
