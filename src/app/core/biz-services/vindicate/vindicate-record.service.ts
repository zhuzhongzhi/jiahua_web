import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';

/**
 * 终端服务
 */
export namespace VindicateRecordServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export interface AcceptFilter {
    repairId: string;
    acceptUserId: string;
    persentUserId?: string;
    planInplaceDate: any;
    acceptContent: string;
  }

  export interface SubmitFilter {
    repairId: string;
    persentUserId: string;
  }

  export class VindicateRecordServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;

    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }

    /**
     * 获取维修记录列表
     * filters 筛选条件,
     * pageNum 当前页数,
     * pageSize 每页的数量,
     * sort (string, optional)，排序
     */
    public getVindicateRecordList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/list', filter, this.defaultConfig);
    }

    /**
     * 获取单个维修记录
     * id 维修记录id,
     */
    public getVindicateRecordItem(id): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/repair/item?id=' + id, null, this.defaultConfig);
    }

    /**
     * 新增维修项
     * vehicleId：车辆id
     * troubleTypeId：故障类型id
     * VehicleCheck：{orgId (string, optional)}: 机构Id
     * VehicleCheck: {checkTrouble (string)} (VehicleTroubleType): 故障信息
     * createUserId (string): 创建人 ,
     * createUserName (string): 创建人名称
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/add', filter, this.defaultConfig);
    }

    /**
     * 编辑终端,参数类型
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/update', filter, this.defaultConfig);
    }

    /**
     * 删除多个终端,参数类型
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/remove', filter, this.defaultConfig);
    }

    /**
     * 添加维修项目
     * repairId 流水号,
     */
    public addRequirPro(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairDetailItem/add', filter, this.defaultConfig);
    }

    /**
     * 派单
     * repairId：string,
     * workPersonnelId：string
     */
    public dispatch(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/dispatch', filter, this.defaultConfig);
    }

    /**
     * 到料
     * repairId：string,
     * workPersonnelId：string
     */
    public arrive(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/arriveInfo', filter, this.defaultConfig);
    }

    /**
     * 质检
     * repairId：string,
     * workPersonnelId：string
     */
    public finish(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/finishInfo', filter, this.defaultConfig);
    }

    /**
     * 撤回
     * repairId：string,
     */
    public withdraw(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/repair/withdraw', filter, this.defaultConfig);
    }

    /**
     * 接收计划
     * repairId：string,
     * acceptUserID：string
     * planInplaceDate: string
     * acceptContent: string
     */
    public accept(filter: AcceptFilter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/acceptInfo', filter, this.defaultConfig);
    }

    /**
     * 提报计划
     * repairId：string,
     * persentUserId：string
     */
    public submit(filter: SubmitFilter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/persentInfo', filter, this.defaultConfig);
    }

    /**
     * 获取维修等级
     * @param filter
     */
    public repairLevelList(): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/repair/trouble_level/list', null, this.defaultConfig);
    }
  }
}

@Injectable()
export class VindicateRecordService extends VindicateRecordServiceNs.VindicateRecordServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
