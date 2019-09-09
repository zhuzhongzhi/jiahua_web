import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

export namespace CompanyServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export class CompanyServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 公司列表,参数类型
     */
    public getCompanyList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/list', filter, this.defaultConfig);
    }
    /**
     * 公司列表Tree结构数据,参数类型
     */
    public getCompanyTreeList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/searchForCompany', filter, this.defaultConfig);
    }
    /**
     * 删除公司,参数类型
     */
    public deleteSingleCompany(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/deleteCompany', filter, this.defaultConfig);
    }
    /**
     * 删除多个公司,参数类型
     */
    public deleteMultiCompany(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/batchDeleteCompany', filter, this.defaultConfig);
    }
    /**
     * 启用/禁用公司,参数类型
     */
    public enableCompany(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/enableCompany', filter, this.defaultConfig);
    }
    /**
     * 新增公司,参数类型
     */
    public submitCompanyInfo(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/insertCompany', filter, this.defaultConfig);
    }
    /**
     * 编辑公司,参数类型
     */
    public updateCompanyInfo(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/SysCompany/updateCompany', filter, this.defaultConfig);
    }
  }
}
@Injectable()
export class CompanyService extends CompanyServiceNs.CompanyServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
