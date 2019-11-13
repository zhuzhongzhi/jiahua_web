import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {HttpHeaders} from '@angular/common/http';

export namespace IngotAlarmServiceNs {

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }


  export class IngotAlarmServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig = {};

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
      this.defaultConfig.headers =
        new HttpHeaders({'Authorization': sessionStorage.getItem('x-user-id')});

    }

    public pageIngotAlarms(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/spin/page', data, this.defaultConfig);
    }

    public updateIngotAlarm(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/spin/modify', data, this.defaultConfig);
    }

    public pageLineAlarms(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/line/page', data, this.defaultConfig);
    }

    public dealLineAlarms(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/line/deal', data, this.defaultConfig);
    }

    public pageResident(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/resident/page', data, this.defaultConfig);
    }

    public dealResident(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/resident/deal', data, this.defaultConfig);
    }

    public pageHandleLog(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/warn/handle/page', data, this.defaultConfig);
    }

    public pageStatOutput(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/stat/output/page', data, this.defaultConfig);
    }

    public pageStatDailyOutput(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/stat/daily/page', data, this.defaultConfig);
    }

    public getLevelList(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/stat/level/list', data, this.defaultConfig);
    }

    public getBadCauseList(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/stat/badCause/list', data, this.defaultConfig);
    }

    public getNotEnoughList(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/stat/notEnough/list', data, this.defaultConfig);
    }

    public pageStatMonthOutput(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/stat/monthly/page', data, this.defaultConfig);
    }

    public pageYearOutput(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/stat/yearly/page', data, this.defaultConfig);
    }

    // 今日产量看板
    public boardOutputToday() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/board/output/today', {}, this.defaultConfig);
    }

    // 历史产量
    public boardOutputHistory() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/board/output/history', {}, this.defaultConfig);
    }

    // 今日质量查询
    public boardQualityToday() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/board/quality/today', {}, this.defaultConfig);
    }

    // 实时告警查询
    public warnRealTimeList() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/warn/realtime/list', {}, this.defaultConfig);
    }

    // 新建
    public craftAdd(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/craft/add', data, this.defaultConfig);
    }

    // 查询某条操作对应的异常记录
    public craftExeptionList(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/craft/exceptionList?opId=' + data, {}, this.defaultConfig);
    }

    // 工艺流程列表查询
    public craftList(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/craft/list', data, this.defaultConfig);
    }

    // 工艺流程修改
    public craftModify(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/craft/modify', data, this.defaultConfig);
    }

    // 工艺流程分页查询
    public craftPage(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/craft/page', data, this.defaultConfig);
    }

    // 新工艺流程分页查询
    public newCraftPage(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/newCraft/page', data, this.defaultConfig);
    }

    // 丝车概要信息
    public wagonSummary(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/wagon/summary', data, this.defaultConfig);
    }

    // 获取所有的线别信息
    public getAllLineTypes() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/getAllLineType', null, this.defaultConfig);
    }

    // 获取所有的批次信息
    public getAllBatchList() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/getBatch', null, this.defaultConfig);
    }

    // 根据批次获取规格
    public getStandardByBatch(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/getStandardByBatch', data, this.defaultConfig);
    }

    // 主记录创建
    public newCraftAdd(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/newCraft/add', data, this.defaultConfig);
    }

    public endDoff(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/endDoffing', data, this.defaultConfig);
    }

    public endDanni(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/endTestDanny', data, this.defaultConfig);
    }

    public endSock(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/endRock', data, this.defaultConfig);
    }

    public endColour(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/endColour', data, this.defaultConfig);
    }

    public endPackage(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/endPackage', data, this.defaultConfig);
    }

    public endCheck(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/endCheck', data, this.defaultConfig);
    }


  }

}

@Injectable()
export class IngotAlarmService extends IngotAlarmServiceNs.IngotAlarmServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
