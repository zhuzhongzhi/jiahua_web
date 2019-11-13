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

    // 增加批次信息
    public addBatch(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/newCraft/addBatch', data, this.defaultConfig);
    }

    // 修改批次信息
    public updateBatch(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/newCraft/updateBatch', data, this.defaultConfig);
    }

    // 查看批次列表
    public pageBatch(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/newCraft/getBatchPage', data, this.defaultConfig);
    }

    // 查看所有批次列表
    public listAllBatch() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/allBatch', null, this.defaultConfig);

    }

    // 获取所有的批次，仅包含批次
    public getAllBatch() {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Get('/produce/newCraft/getBatch', null, this.defaultConfig);
    }

    // 删除批次
    public removeBatch(data) {
      const config: HttpUtilNs.UfastHttpConfig = {};
      config.gateway = HttpUtilNs.GatewayKey.Iot;
      return this.http.Post('/produce/newCraft/batchRemove', data, this.defaultConfig);
    }

  }

}

@Injectable()
export class LineSpinService extends LineSpinServiceNs.LineSpinServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}

