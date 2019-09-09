import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace TeamTallyServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class TeamTallyServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 获取车队点检列表
     * filters 筛选条件,
     * pageNum 当前页数,
     * pageSize 每页的数量,
     * sort (string, optional)，排序
     */
    public getTeamTallyList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamTally/list', filter, this.defaultConfig);
    }
    /**
     * 新增车队点检
     * orgId：机构名称id
     * vehicleLicense：车牌号码
     * checkType：检查类型(0使用前,1使用中)
     * checkDetailList={}：点检项目
     * checkItemId (可选): 点检项目id
     * checkItemResult (integer): 点检结果(1正常,2异常)
     * createUserId (string): 创建人id
     * createUserName (string): 创建人名称
     * checkTrouble (string): 问题描述
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      console.log(filter);
      return this.http.Post('/teamTally/add', filter, this.defaultConfig);
    }
    /**
     * 编辑车队点检
     * orgId：机构名称id
     * workGroupId：班组名称id
     * vehicleLicense：车牌号码
     * checkType：检查类型(0使用前,1使用中)
     * checkDetailList={}：点检项目
     * checkItemId (string): 点检项目id
     * checkItemResult (integer): 点检结果(1正常,2异常)
     * createUserId (string): 创建人id
     * createUserName (string): 创建人名称
     * checkTrouble (string): 问题描述
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamTally/update', filter, this.defaultConfig);
    }
    /**
     * 删除车队点检
     * ids: []
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamTally/remove', filter, this.defaultConfig);
    }
    /**
     * 获取点检项目
     * vehicleTypeCode
     */
    public getTallyPro(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/checkItem/getItemByVehicleTypeCode?vehicleTypeCode=' + filter.vehicleTypeCode, null, this.defaultConfig);
    }
    /**
     * 撤销报修操作
     * vehicleTypeCode
     */
    public cancleRepair(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/teamTally/cancelRepair', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class TeamTallyService extends TeamTallyServiceNs.TeamTallyServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
