import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

export namespace LatheManageServiceNs {

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class LatheManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig = {};

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
      this.defaultConfig.headers =
        new HttpHeaders({'Authorization': sessionStorage.getItem('x-user-id')});
    }

    /**
     * 丝车列表（精确）
     */
    public getWagonList(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/list', filter, config);
    }

    /**
     * 丝车列表（模糊）
     * @param filter
     */
    public getWagonListWithPageCondition(filter): Observable<UfastHttpAnyResModel> {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/allWagonPageCondtion', filter, config);
    }

    /**
     * 获取权限列表
     * @param filter
     */
    public getAuthList(filter) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/authPage', filter, config);
    }

    /**
     * 增加权限
     * @param data
     */
    public addAuth(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/authAdd', data, config);
    }

    /**
     * 修改权限
     * @param data
     */
    public modifyAuth(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/authModify', data, config);
    }

    /**
     * 增加用户权限组
     * @param data
     */
    public addUserAuth(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/userAuthAdd', data, config);
    }

    /**
     * 修改用户权限组
     * @param data
     */
    public modifyUserAuth(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/userAuthModify', data, config);
    }

    /**
     * 查询用户权限组列表
     * @param filter
     */
    public getUserAuthList(filter) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/userAuthPage', filter, config);
    }

    public deleteUsers(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/userRemove', data, this.defaultConfig);
    }

  }

}

@Injectable()
export class LatheManageService extends LatheManageServiceNs.LatheManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
