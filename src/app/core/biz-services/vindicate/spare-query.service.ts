import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';


/**
 * 备件查询服务
 */
export namespace SpareQueryServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class SpareQueryServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 备件列表
     */
    public getSpareList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairPart/list', filter, this.defaultConfig);
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
      return this.http.Post('/repairPart/add', filter, this.defaultConfig);
    }
    /**
     * 编辑车队点检
     * orgId：机构名称id
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairPart/update', filter, this.defaultConfig);
    }
    /**
     * 删除车队点检
     * ids: []
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairPart/remove', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class SpareQueryService extends SpareQueryServiceNs.SpareQueryServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
