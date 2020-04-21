import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace AlarmListServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class AlarmListServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 车辆列表,参数类型
     * filters 筛选条件,
     * pageNum 当前页数,
     * pageSize 每页的数量,
     * sort (string, optional)，排序
     */
    public getAlarmList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmMist/list', filter, this.defaultConfig);
    }
    /**
     * 获取报警详情
     */
    public item(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/alarmMist/item', filter, this.defaultConfig);
    }
    // /**
    //  * 编辑终端,参数类型
    //  */
    // public update(filter): Observable<UfastHttpAnyResModel> {
    //   return this.http.Post('/deviceInfo/update', filter, this.defaultConfig);
    // }
    // /**
    //  * 删除多个终端,参数类型
    //  */
    // public delete(filter): Observable<UfastHttpAnyResModel> {
    //   return this.http.Post('/deviceInfo/remove', filter, this.defaultConfig);
    // }
  }
}

@Injectable()
export class AlarmListService extends AlarmListServiceNs.AlarmListServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
