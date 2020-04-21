import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 加油卡服务
 */
export namespace RefuelCardServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class RefuelCardServiceClass {
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
    public getRefuelCardList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/refuelRecord/list', filter, this.defaultConfig);
    }

    /**
     * 加油卡列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/oilCard/list', filter, this.defaultConfig);
    }
    /**
     * 加油卡列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/oilCard/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增加油卡
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/oilCard/add', filter, this.defaultConfig);
    }
    /**
     * 编辑加油卡
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/oilCard/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个加油卡
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/oilCard/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class RefuelCardService extends RefuelCardServiceNs.RefuelCardServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
