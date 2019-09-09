import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 用户服务
 */
export namespace UserManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class UserManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 用户列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusProfile/list', filter, this.defaultConfig);
    }
    /**
     * 用户列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusProfile/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增用户
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusProfile/add', filter, this.defaultConfig);
    }
    /**
     * 编辑用户
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusProfile/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个用户
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/iusProfile/remove', filter, this.defaultConfig);
    }
    /**
     * 获取单个用户信息
     */
    public getUserMess(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get('/iusProfile/getById', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class UserManageService extends UserManageServiceNs.UserManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
