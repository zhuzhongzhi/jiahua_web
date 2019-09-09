import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 班组服务
 */
export namespace TeamManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class TeamManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 班组列表,参数类型
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamManage/list', filter, this.defaultConfig);
    }
    /**
     * 班组列表(不分页),参数类型
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增班组,参数类型
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamManage/add', filter, this.defaultConfig);
    }
    /**
     * 编辑班组,参数类型
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamManage/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个班组,参数类型
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/teamManage/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class TeamManageService extends TeamManageServiceNs.TeamManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
