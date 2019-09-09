import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 员工服务
 */
export namespace PeoManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class PeoManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 员工列表,参数类型
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/list', filter, this.defaultConfig);
    }
    /**
     * 新增员工,参数类型
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/add', filter, this.defaultConfig);
    }
    /**
     * 编辑员工,参数类型
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个员工,参数类型
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/remove', filter, this.defaultConfig);
    }
    /**
     * 人员所有数据,参数类型
     */
    public searchList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 人员所有数据-过滤已经绑定人员信息的数据,参数类型
     */
    public searchListForIus(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/peoManage/searchListForIus', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class PeoManageService extends PeoManageServiceNs.PeoManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
