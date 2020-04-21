import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace VindicateInspectServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class VindicateInspectServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 获取加油记录列表
     * filters 筛选条件,
     * pageNum 当前页数,
     * pageSize 每页的数量,
     * sort (string, optional)，排序
     */
    public getVindicateInspectList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repair/list', filter, this.defaultConfig);
    }
    /**
     * 故障类型列表,参数类型
     */
    public getRepairList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairType/list', filter, this.defaultConfig);
    }
    /**
     * 单个故障类型
     * id
     */
    public getRepairItem(id): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/repairType/item?id=' + id, {}, this.defaultConfig);
    }
    /**
     * 新增故障类型
     * troubleTypeName: 故障名称,
     troubleTypeLevel: 维修等级,
     troubleWay: 处理方法
     troubleTypeItemList: 维修项目信息
     troubleTypePartList: 维修备件信息
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairType/add', filter, this.defaultConfig);
    }
    /**
     * 编辑故障类型
     * troubleTypeId：故障类型ID
     * troubleTypeName: 故障名称,
     troubleTypeLevel: 维修等级,
     troubleWay: 处理方法
     troubleTypeItemList: 维修项目信息
     troubleTypePartList: 维修备件信息
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairType/update', filter, this.defaultConfig);
    }
    /**
     * 删除故障类型
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/repairType/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class VindicateInspectService extends VindicateInspectServiceNs.VindicateInspectServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
