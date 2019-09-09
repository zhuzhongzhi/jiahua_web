import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 角色服务
 */
export namespace RoleManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class RoleManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 角色列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusRole/listRoles', filter, this.defaultConfig);
    }
    /**
     * 角色列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusRole/listAllRoles', filter, this.defaultConfig);
    }
    /**
     * 新增角色
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusRole/add', filter, this.defaultConfig);
    }
    /**
     * 编辑角色
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusRole/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个角色
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusRole/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class RoleManageService extends RoleManageServiceNs.RoleManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
