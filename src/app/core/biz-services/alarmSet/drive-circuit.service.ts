import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';


/**
 * 行车路线服务
 */
export namespace DriveCircuitServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class DriveCircuitServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 行车路线列表
     */
    public getDriveCircuitList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/driveCircuit/list', filter, this.defaultConfig);
    }
    /**
     * 新增行车路线
     * lineName: 线路名称
       orgId: 所属机构
       provinceCode: 省
       cityCode: 市
       areaCode: 区
       remark: 备注
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/driveCircuit/add', filter, this.defaultConfig);
    }
    /**
     * 编辑行车路线
     * lineName: 线路名称
     orgId: 所属机构
     provinceCode: 省
     cityCode: 市
     areaCode: 区
     remark: 备注
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/driveCircuit/update', filter, this.defaultConfig);
    }
    /**
     * 删除行车路线
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/driveCircuit/remove', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class DriveCircuitService extends DriveCircuitServiceNs.DriveCircuitServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
