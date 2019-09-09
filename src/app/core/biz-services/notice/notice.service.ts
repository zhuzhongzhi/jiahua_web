import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 维修资料服务
 */
export namespace NoticeServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class NoticeServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 通知列表,参数类型
     * "pageNum": 当前页码
     * "pageSize": 每页的数据量
     * "sort": "string"排序
     * filter: {}
     */
    public getNoticeList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/list', filter, this.defaultConfig);
    }
    /**
     * 通知列表,参数类型
     * "pageNum": 当前页码
     * "pageSize": 每页的数据量
     * "sort": "string"排序
     * filter: {}
     */
    public getMaintenanceList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/listMaintenance', filter, this.defaultConfig);
    }
    /**
     * 通知列表,参数类型
     */
    public getAlarmList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/listAlarm', filter, this.defaultConfig);
    }
    /**
     * 新增维修资料
     * id
     */
    public searchItem(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/search', filter, this.defaultConfig);
    }
    /**
     * 处理
     * id
     * vehicleId 车辆id
     * dealFlag (integer): 处理标识(0未处理,1已处理)
     * dealContent (string): 处理内容
     * informTypeName：消息类型
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/update', filter, this.defaultConfig);
    }
    // 批量处理
    public updateForMore(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/updateForMore', filter, this.defaultConfig);
    }
    // 获取未处理消息数量
    public getNoticeNum(): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/systemInform/listNotDealNums', {}, this.defaultConfig);
    }
  }
}
@Injectable()
export class NoticeService extends NoticeServiceNs.NoticeServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
