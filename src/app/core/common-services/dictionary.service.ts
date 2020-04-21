import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../infra/http/http-util.service';
import { Observable } from 'rxjs';

export namespace DictionaryServiceNs {
  export enum TypeCode {
    CompanyNature = 'CompanyNature',           // 公司性质
    ProjectClass = 'ProjectType',     // 项目分类
    VariateType = 'VariateType', // 踩点配置，变量类型
    AddressType = 'AddressType', // 踩点配置，地址类型
  }
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  export interface  DictItemModel {
    code?: string;
    createDate?: string;
    groupName?: string;
    id?: string;
    name?: string;
    pId?: string;
    parentCode?: string;
    parentName?: string;
    privated?: number;
    remark?: string;
    valid?: number;
  }
  export interface  AreaInfoItemModel {
    code: string;
    name: string;
  }
  export class DictionaryServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    private projectClasses = [];
    private variateTypeList = [];
    private addressTypeList = [];
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 根据地区编码查询地区详情
     * */
    public getAreaInfo(code: string): Observable<any> {
      return this.http.Get('/sysArea/item', {code}, {
        gateway: HttpUtilNs.GatewayKey.Bs
      });
    }
    /**
     * 获取地区列表
     * */
    public getAreaList(code?: string): Observable<any> {
      const param = {
        filters: {
          pcode: code || '0'
        }
      };
      return this.http.Post('/sysArea/list', param, {
        gateway: HttpUtilNs.GatewayKey.Bs
      });
    }

    /***
     * 公司性质
     */
    public async getCompanyNatureList(): Promise<Array<{name: string; code: string; }>> {
      const List = await this.getDataDictionaryList<{name: string; code: string; }>(TypeCode.CompanyNature);
      return List;
    }

    /***
     * 项目分类
     */
    public async getProjectClassList(): Promise<Array<{name: string; code: string; }>> {
      if (this.projectClasses.length > 0) {
        return Promise.resolve(this.projectClasses);
      }
      this.projectClasses = await this.getDataDictionaryList<{name: string; code: string; }>(TypeCode.ProjectClass);
      return this.projectClasses;
    }
    /***
     * 变量类型
     */
    public async getVariateTypeList(): Promise<Array<{name: string; code: string; }>> {
      if (this.variateTypeList.length > 0) {
        return Promise.resolve(this.variateTypeList);
      }
      this.variateTypeList = await this.getDataDictionaryList<{name: string; code: string; }>(TypeCode.VariateType);
      return this.variateTypeList;
    }
    /***
     * 地址类型
     */
    public async getAddressTypeList(): Promise<Array<{name: string; code: string; }>> {
      if (this.addressTypeList.length > 0) {
        return Promise.resolve(this.addressTypeList);
      }
      this.addressTypeList = await this.getDataDictionaryList<{name: string; code: string; }>(TypeCode.AddressType);
      return this.addressTypeList;
    }

    /***
     *
     * @param parentCode
     */
    public getDataDictionaryList<T>(parentCode: string): Promise<Array<T>> {
      const param = {
        filters: {
          parentCode
        }
      };
      return this.http.Post('/dataDictionary/listAll', param).toPromise().then( data => {
        if (data.code) {
          return [];
        }
        return data.value.list;
      });
    }

    /**
     * 获取数字字典明细列表parentCode: TypeCode.CompanyNature
     */
    public getDictionaryDetail(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post('/dataDictionary/listAll', filter, this.defaultConfig);
    }

  }
}
@Injectable()
export class DictionaryService extends DictionaryServiceNs.DictionaryServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}

