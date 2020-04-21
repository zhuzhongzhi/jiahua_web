import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 机构服务
 */
export namespace OrgManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class OrgManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 机构列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/list', filter, this.defaultConfig);
    }
    /**
     * 机构列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增机构
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/insertCompany', filter, this.defaultConfig);
    }
    /**
     * 编辑机构
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/updateCompany', filter, this.defaultConfig);
    }
    /**
     * 删除多个机构
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/batchDeleteCompany', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class OrgManageService extends OrgManageServiceNs.OrgManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
