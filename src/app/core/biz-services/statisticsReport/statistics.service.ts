import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';

/**
 * 统计服务
 */
export namespace StatisticsServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class RepairStatisticsServiceClass {

    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }

    // 查询维修统计
    public getRepairStatistcsList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/repair', filter, this.defaultConfig);
    }

    // 查询维修统计
    public getRepairStatistcsByOrg(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/repair_org', filter, this.defaultConfig);
    }

    // 查询维修统计详情
    public getRepairDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/repair_detail', filter, this.defaultConfig);
    }

    // 查询油耗统计
    public getOilStatisticsList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/oil', filter, this.defaultConfig);
    }

    // 查询油耗统计
    public getOilStatisticsByOrg(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/oil_org', filter, this.defaultConfig);
    }

    // 查询班组统计
    public getTeamStatisticsList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/team', filter, this.defaultConfig);
    }

    //  查询车辆运行情况统计
    public getOperateStatistList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/run', filter, this.defaultConfig);
    }

    // 查询车辆运行统计详情
    public getOperateStatistDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/run_detail', filter, this.defaultConfig);
    }

    //  查询车辆运行情况统计
    public getOperateStatistListByCompany(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/run_company', filter, this.defaultConfig);
    }

    //  查询车辆运行情况统计
    public getOperateStatistListByOrg(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/run_org', filter, this.defaultConfig);
    }

    // 查询设备完好率统计
    public getDeviceStatistics(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/device', filter, this.defaultConfig);
    }

    // 查询设备完好率统计详情
    public getDeviceStatisticsDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/device_detail', filter, this.defaultConfig);
    }

    // 查询设备完好率统计详情
    public getDeviceStatisticsVehicleRepair(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/device_repair', filter, this.defaultConfig);
    }

    // 获取月度油耗
    public getOilByMonth(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statistics/oil_month', filter, this.defaultConfig);
    }

    // 获取月度里程
    public getMileByMonth(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statistics/mile_month', filter, this.defaultConfig);
    }

    // 获取月度工作时长
    public getWorktimeByMonth(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statistics/time_month', filter, this.defaultConfig);
    }

    // 获取月度设备完好率
    public getDeviceByMonth(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statistics/device_month', filter, this.defaultConfig);
    }

    // 获取月度维修
    public getRepairByMonth(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/statistics/repair_month', filter, this.defaultConfig);
    }

    // 按照机构过滤
    public getTeamOrg(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/team_org', filter, this.defaultConfig);
    }

    // 获取某单位下的班组
    public getTeam(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/team', filter, this.defaultConfig);
    }

    // 获取统计班组车辆详情
    public getTeamVehicle(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/team_vehicle', filter, this.defaultConfig);
    }

    // 获取油耗图表月度统计数据
    public getOilGraphByMonth(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/oil_graph/month', filter, this.defaultConfig);
    }

    //  获取油耗图表天统计数据
    public getOilGraphByDay(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/oil_graph/day', filter, this.defaultConfig);
    }

    // 获取油耗图表月度统计详情
    public getOilGraphByMonthWithDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/oil_graph/detail/month', filter, this.defaultConfig);
    }

    // 获取油耗图表天统计详情
    public getOilGraphByDayWithDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/statistics/oil_graph/detail/day', filter, this.defaultConfig);
    }

  }
}

@Injectable()
export class StatisticsService extends StatisticsServiceNs.RepairStatisticsServiceClass {

  constructor(injector: Injector) {
    super(injector);
  }
}
