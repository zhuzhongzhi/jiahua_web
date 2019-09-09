import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 停车点服务
 */
export namespace ParkingSpotServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class ParkingSpotServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 停车点列表
     */
    public getParkingSpotList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/parkingSpot/list', filter, this.defaultConfig);
    }
    /**
     * 新增停车点
     * stopName: 停车点名称,
     orgId: 所属机构,
     provinceCode: 省,
     cityCode: 市,
     areaCode: 区,
     stopAddress: 详细地址,
     stopType: 类型,
     remark: 备注
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/parkingSpot/add', filter, this.defaultConfig);
    }
    /**
     * 编辑停车点
     * stopId: 停车点id,
     * stopName: 停车点名称,
     orgId: 所属机构,
     provinceCode: 省,
     cityCode: 市,
     areaCode: 区,
     stopAddress: 详细地址,
     stopType: 类型,
     remark: 备注
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/parkingSpot/update', filter, this.defaultConfig);
    }
    /**
     * 删除停车点
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/parkingSpot/remove', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class ParkingSpotService extends ParkingSpotServiceNs.ParkingSpotServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
