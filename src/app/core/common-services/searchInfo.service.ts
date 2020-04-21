import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../infra/http/http-util.service';
import {Observable} from 'rxjs';
export namespace SearchInfoServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export interface OrgList {
    id: string | number;
    key: string | number;
    name: string;
    parentId: string | number;
    children?: OrgList[] | null;
  }

  export interface TypeList {
    id: string | number;
    val: string | number;
    label: string;
  }

  export class SearchInfoServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(injector: Injector) {
      this.http = injector.get(HttpUtilService);
    }

    // 获取机构名称
    public getOrgList(): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get('/cehicleList/orgList', null, this.defaultConfig);
    }
    // 获取车辆类型
    public getTypeList(): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Get('/cehicleList/typeList', null, this.defaultConfig);
    }
    // 获取班组
    public getTeamList(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/teamManage/searchList', filter, this.defaultConfig);
    }
    // 获取报警类型
    public getAlarmList(): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Ius;
      return this.http.Post('/alarmType/allList', {}, this.defaultConfig);
    }
    // 获取车辆列表
    public getVehicleList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/vehicleManage/searchList', filter, this.defaultConfig);
    }
    // 获取故障类型
    public getVindicateInspectList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/listAll', filter, this.defaultConfig);
    }
    // 获取故障类型——常见问题
    public getRepairTypeList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairType/listAll', filter, this.defaultConfig);
    }
    // 获取维修项列表
    public getRepairItemList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairItem/listAll', filter, this.defaultConfig);
    }
    // 获取维修项目分类
    public getRepairItemTypeList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairItemClassification/listAll', filter, this.defaultConfig);
    }
    /**
     * 获取维修人员
     * workGroupId：班组id
     * **/
    public getPeoList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/searchlist', filter, this.defaultConfig);
    }
    // 获取省、市、区
    public getAreasList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysArea/findAreas', filter, this.defaultConfig);
    }
    // 获取备件数据
    public getRepairPartList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairPart/listAll', filter, this.defaultConfig);
    }
    // 获取行车路线数据
    public getDriveCricuitList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/driveCircuit/searchList', filter, this.defaultConfig);
    }
    // 获取电子围栏数据
    public getFenceList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/fenceManage/searchList', filter, this.defaultConfig);
    }
    // 获取子库存数据
    public getPartStockList(): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/repairPart/getPartStockName', null, this.defaultConfig);
    }
  }
}
@Injectable()
export class SearchInfoService extends SearchInfoServiceNs.SearchInfoServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}

