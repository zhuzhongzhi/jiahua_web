import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';


/**
 * 报警策略服务
 */
export namespace AlarmStrategyServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class AlarmStrategyServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 报警策略列表
     */
    public getAlarmStrategyList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmConfig/list', filter, this.defaultConfig);
    }
    /**
     * 新增报警策略
     * configName: 报警策略名称,
     vehicleIds: 车辆,
     alarmTypeCode: 报警类型,
     fenceId: 电子围栏,
     lineId: 行车路线,
     fenceAlarmType: 围栏报警内容,
     speed: 速度,
     speedTime: 时长
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmConfig/add', filter, this.defaultConfig);
    }
    /**
     * 编辑报警策略
     * configName: 报警策略名称,
     vehicleIds: 车辆,
     alarmTypeCode: 报警类型,
     fenceId: 电子围栏,
     lineId: 行车路线,
     fenceAlarmType: 围栏报警内容,
     speed: 速度,
     speedTime: 时长
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmConfig/update', filter, this.defaultConfig);
    }
    /**
     * 删除报警策略
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmConfig/remove', filter, this.defaultConfig);
    }
    /**
     * 获取单个报警策略信息
     * alarmConfigId： 报警策略ID
     */
    public getAlarmStrategy(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmConfig/search?alarmConfigId=' + filter, null, this.defaultConfig);
    }
    /**
     * 报警策略下发结果查询
     */
    public getResultDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/alarmConfig/getDetailList', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class AlarmStrategyService extends AlarmStrategyServiceNs.AlarmStrategyServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
