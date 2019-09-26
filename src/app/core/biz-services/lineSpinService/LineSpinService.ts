import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {HttpHeaders} from '@angular/common/http';

export namespace LineSpinServiceNs {

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class LineSpinServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig = {};

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
      this.defaultConfig.headers =
        new HttpHeaders({'Authorization': sessionStorage.getItem('x-user-id')});

    }

    public addLineSpin(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/lineSpin/add', data, this.defaultConfig);
    }

    public listLineSpin(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/lineSpin/list', data, this.defaultConfig);
    }

    public updateLineSpin(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/lineSpin/modify', data, this.defaultConfig);
    }

    public pagelineSpin(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/lineSpin/page', data, this.defaultConfig);
    }

    public removeLineSpin(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/wagon/lineSpin/remove', data, this.defaultConfig);
    }

  }

}

@Injectable()
export class LineSpinService extends LineSpinServiceNs.LineSpinServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}

