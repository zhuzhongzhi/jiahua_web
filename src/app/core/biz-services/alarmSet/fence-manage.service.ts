import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace FenceManangeServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class FenceManangeServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 围栏列表,参数类型
     */
    public getFenceList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/fenceManage/list', filter, this.defaultConfig);
    }
    /**
     * 新增围栏信息
     * fenceName: 围栏名称
       orgId: 所属机构
       provinceCode: 省
       cityCode: 市
       areaCode: 区
       remark: 备注
       fencePointList:地图围栏点数组
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/fenceManage/add', filter, this.defaultConfig);
    }
    /**
     * 编辑围栏信息
     * fenceId：围栏ID
     * fenceName: 围栏名称
     orgId: 所属机构
     provinceCode: 省
     cityCode: 市
     areaCode: 区
     remark: 备注
     fencePointList:地图围栏点数组
     */
    public edit(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/fenceManage/update', filter, this.defaultConfig);
    }
    /**
     * 删除围栏信息
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/fenceManage/remove', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class FenceManangeService extends FenceManangeServiceNs.FenceManangeServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
