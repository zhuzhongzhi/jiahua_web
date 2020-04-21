import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

export namespace ProduceManageServiceNs {

  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }

  export class ProduceManageServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: HttpUtilNs.GatewayKey.Iot};

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
      this.defaultConfig.headers =
        new HttpHeaders({'Authorization': sessionStorage.getItem('x-user-id')});
    }

    /**
     * 新建操作记录
     * @param data
     */
    public addCraft(data): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/produce/craft/add', data, this.defaultConfig);
    }

    /**
     * 查询某条操作对应的异常记录
     * @param filter
     */
    public getExceptionList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/produce/craft/exceptionList', filter, this.defaultConfig);
    }

    /**
     * 工艺流程列表查询
     * @param filter
     */
    public getCraftList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/produce/craft/list', filter, this.defaultConfig);
    }

    /**
     * 修改工艺流程
     * @param filter
     */
    public updateCraft(data): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/produce/craft/modify', data, this.defaultConfig);
    }

    /**
     * 工艺流程分页
     * @param filter
     */
    public pageCraftList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/produce/craft/page', filter, this.defaultConfig);
    }

  }

}

@Injectable()
export class ProduceManageService extends ProduceManageServiceNs.ProduceManageServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
