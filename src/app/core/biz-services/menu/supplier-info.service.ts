import {Injectable, Injector} from '@angular/core';
import {HttpUtilNs, HttpUtilService} from '../../infra/http/http-util.service';
import {Observable} from 'rxjs';


export namespace SupplierInfoNs {
  export interface SupplierResModelT<T> extends HttpUtilNs.UfastHttpRes {
    value: any;
  }
  export interface RegisterInfo {
    companyName: string;
    socialCreditCode: string;
    account: string;
    password: string;
    userName: string;
    phone: string;
    verifyCode?: string;
    authId: string;
  }
  export interface SupplierBasicInfo {
    bankOfDeposit: string;   // 开户行 ,
    bankOfDepositAccount: string;   // 开户行帐号 ,
    bankOfDepositAddress: string;   // 开户行地址 ,
    collectingBank: string;   // 收款银行 ,
    collectingBankAccount: string;   // 收款银行帐号 ,
    collectingBankAddress: string;   // 收款银行地址 ,
    collectingBankLineNum: string;   // 收款银行行号 ,
    companyNature: string;   // 企业性质 ,
    companyType: number;  // 企业类型 ,
    contactAddress: string;   // 通讯地址 ,
    cooperationScope: string;   // 合作范围 ,
    createDate: string;
    createId: string;
    erpSupplierCode: string;   // erp供应商编码 ,
    erpSupplierId: string;   // erp供应商id ,
    id: string;
    industry: string;   // 所属行业 ,
    legalPerson: string;   // 法人 ,
    name: string;   // 公司名称 ,
    postcode: string;   // 邮编 ,
    profile: string;   // 公司简介 ,
    registAreaCode: string;   // 注册地区编码 ,
    registCapital: number;  // 注册资本 ,
    registDetailsAddress: string;   // 详细地址 ,
    scopeOfBusiness: string;   // 经营范围 ,
    setUpDate: string;   // 成立时间 ,
    socialCreditCode: string;   // 统一社会信用代码 ,
    updateDate: string;
    updateId: string;
    website: string;   // 公司网址 ,
    workAreaCode: string;   // 办公地区编码 ,
    workDetailsAddress: string;   // 工作详细地址
  }
  export interface SupplierContact {
    companyId: string; // 公司Id ,
    id: string;     // 主键 ,
    mail: string; // 邮件 ,
    master: boolean;    // 是否主要 ,
    mobile: string; // 联系电话 ,
    name: string; // 联系人名称 ,
    position: string; // 职务
  }
  export class SupplierInfoServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
      this.defaultConfig = {
        gateway: HttpUtilNs.GatewayKey.Bs
      };
    }

    public registerSupplier(info: RegisterInfo): Observable<any> {
      return this.http.Post('/supplierFactory/regist', info, this.defaultConfig);
    }
  }
}
@Injectable()
export class SupplierInfoService extends SupplierInfoNs.SupplierInfoServiceClass{

  constructor(injector: Injector) {
    super(injector);
  }
}
