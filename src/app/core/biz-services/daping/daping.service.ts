import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';

/**
 * 维修资料服务
 */
export namespace DapingServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export interface WorkHour {
    worktimeTotal: string | number;
    mileageTotal: string | number;
    worktimeToday: string | number;
    mileageToday: string | number;
  }

  export interface RepairPart {
    repairNums: string | number;
    partNums: string | number;
    partMoneys: string | number;
    repairWorkhours: string | number;
  }

  export interface AlarmInfo {
    speedLargNum: string | number;
    speedWaitNum: string | number;
    terminalNum: string | number;
  }

  export class DapingServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }

    /**
     * 车辆状态统计
     */
    public getVehicleState(): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/systemScreen/workVehicleInfos', null, this.defaultConfig);
    }

    /**
     * 告警情况
     */
    public getAlarmInfo(): Observable<AlarmInfo> {
      return this.http.Get('/systemScreen/alarmInfo', null, this.defaultConfig);
    }

    /**
     * 车辆维修情况
     */
    public getRepairInfo(): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/systemScreen/repairInfos', null, this.defaultConfig);
    }

    /**
     * 本月维修备件
     */
    public getRepairPart(): Observable<RepairPart> {
      return this.http.Get('/systemScreen/repairPartInfos', null, this.defaultConfig);
    }

    /**
     * 工作时长
     */
    public getWorkHours(): Observable<WorkHour> {
      return this.http.Get('/systemScreen/workHoursInfos', null, this.defaultConfig);
    }

    /**
     * 维修统计
     */
    public getRepairStatistic(): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/systemScreen/repairMap', null, this.defaultConfig);
    }

    /**
     * 加油统计
     */
    public getOilStatistic(): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/systemScreen/oilInfos', null, this.defaultConfig);
    }
  }
}

@Injectable()
export class DapingService extends DapingServiceNs.DapingServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
