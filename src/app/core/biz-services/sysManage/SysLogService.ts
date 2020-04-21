import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

export namespace SysLogServiceNs {

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class SysLogServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig = {};

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
      this.defaultConfig.headers =
        new HttpHeaders({'Authorization': sessionStorage.getItem('x-user-id')});

    }

    public listSysLog(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/operateLogAll', data, this.defaultConfig);
    }

    public pageSysLog(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/operateLog', data, this.defaultConfig);
    }

    public removeSysLog(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/delOperateLog', data, this.defaultConfig);
    }

    public clearSysLog() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/jiahua/user/clearOperateLog', {}, this.defaultConfig);
    }

  }

}

@Injectable()
export class SysLogService extends SysLogServiceNs.SysLogServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}

