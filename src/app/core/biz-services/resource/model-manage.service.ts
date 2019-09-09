import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 车辆型号服务
 */
export namespace ModelManageServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class ModelManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 车辆型号列表
     */
    public getList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/list', filter, this.defaultConfig);
    }
    /**
     * 车辆型号列表(不分页)
     */
    public getAllList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 新增车辆型号
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/insert', filter, this.defaultConfig);
    }
    /**
     * 编辑车辆型号
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个车辆型号
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/remove', filter, this.defaultConfig);
    }
    /**
     * 车辆型号所有数据
     */
    public searchList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/searchList', filter, this.defaultConfig);
    }
    /**
     * 检查车辆型号是否在使用,参数类型
     */
    public checkList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/modelManage/checkIsLinked', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class ModelManageService extends ModelManageServiceNs.ModelManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
