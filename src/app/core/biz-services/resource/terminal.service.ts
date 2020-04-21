import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

/**
 * 终端服务
 */
export namespace TerminalServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class TerminalServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    // private defaultConfig: HttpUtilNs.UfastHttpConfig = {gateway: 'bs_dwk'};
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 终端列表,参数类型
     */
    public getTerminalList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/deviceInfo/list', filter, this.defaultConfig);
    }
    /**
     * 新增终端,参数类型
     */
    public add(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/deviceInfo/add', filter, this.defaultConfig);
    }
    /**
     * 编辑终端,参数类型
     */
    public update(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/deviceInfo/update', filter, this.defaultConfig);
    }
    /**
     * 删除多个终端,参数类型
     */
    public delete(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/deviceInfo/remove', filter, this.defaultConfig);
    }
    /**
     * 检查终端是否在使用,参数类型
     */
    public checkList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/deviceInfo/checkIsLinked', filter, this.defaultConfig);
    }
  }
}

@Injectable()
export class TerminalService extends TerminalServiceNs.TerminalServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
