import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShowMessageService } from '../../../../widget/show-message/show-message';
import { PositionPickerService } from '../../../../widget/position-picker/position-picker.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UfastValidatorsService } from '../../../../core/infra/validators/validators.service';
import {CompanyService, CompanyServiceNs} from '../../../../core/biz-services/company/company.service';
import {DictionaryService, DictionaryServiceNs} from '../../../../core/common-services/dictionary.service';

export enum MaxLenInputEnum {
  Default = 50
}

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})

export class AddCompanyComponent implements OnInit {
  @Output() finish: EventEmitter<any>;
  companyForm: FormGroup;
  companyNatureList: any[];
  companyAddress: string;
  MaxInputLenEnum = MaxLenInputEnum;
  @Input() companyInfo: any;
  constructor(private companyService: CompanyService, private dictionaryService: DictionaryService,
              private messageService: ShowMessageService, private formBuilder: FormBuilder,
              private validator: UfastValidatorsService, private positionPickerService: PositionPickerService) {
    this.finish = new EventEmitter();
  }
  private getCompanyNatureList() {
    const filter = {
      filters: {
        parentCode: DictionaryServiceNs.TypeCode.CompanyNature
      }
    };
    this.dictionaryService.getDictionaryDetail(filter).subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.companyNatureList = resData.value.list;
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  public submitCompany() {
    for (const key in this.companyForm.controls) {
      this.companyForm.controls[key].markAsDirty();
      this.companyForm.controls[key].updateValueAndValidity();
    }
    if (this.companyForm.invalid) {
      return;
    }
    const param = this.companyForm.value;
    if (param.orgNature) {
      param.orgNatureName = this.getCompanyNatureName(param.orgNature);
    }
    let observer: any = null;
    if (this.companyInfo) {
      observer = this.companyService.updateCompanyInfo(param);
    } else {
      observer = this.companyService.submitCompanyInfo(param);
    }
    observer.subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.emitFinish();
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  private getCompanyNatureName (companyNatureId) {
    let companyNatureName = '';
    for (let i = 0, len = this.companyNatureList.length; i < len; i++) {
      if (this.companyNatureList[i].id === companyNatureId) {
        companyNatureName = this.companyNatureList[i].name;
        break;
      }
    }
    return companyNatureName;
  }
  public emitFinish() {
    this.companyForm.reset();
    this.finish.emit();
  }

  public changeArea(event) {
    let areaList: any[];
    areaList = event.list;
    this.companyAddress = '';
    areaList.forEach((item, index) => {
      if (item.value) {
        this.companyAddress += item.label;
      }
      if (index === 0) {
        this.companyForm.patchValue({provinceId: item.value});
      }
      if (index === 1) {
        this.companyForm.patchValue({cityId: item.value});
      }
    });
  }

  public showPositionLocation() {
    const address = this.companyForm.value.fullAddress;
    const param = {
      address: address,
      lng: null,
      lat: null,
      addressComponent: {} as any,
    };
    if (this.companyForm.value.lng || this.companyForm.value.lat) {
      param.lng = this.companyForm.value.lng;
      param.lat = this.companyForm.value.lat;
      param.addressComponent.adcode = this.companyForm.value.countyId;
      param.addressComponent.provinceId = this.companyForm.value.provinceId;
      param.addressComponent.cityId = this.companyForm.value.cityId;
      param.addressComponent.district = this.companyForm.value.countyName;
      param.addressComponent.province = this.companyForm.value.provinceName;
      param.addressComponent.city = this.companyForm.value.cityName;
      param.addressComponent.township = this.companyForm.value.address;
    }
    this.positionPickerService.show(param).then((data) => {
      if (!data) {
        return;
      }
      this.companyForm.patchValue({
        lng: data.lng,
        lat: data.lat,
        countyId: data.addressComponent.adcode,
        provinceId: data.addressComponent.provinceId,
        cityId: data.addressComponent.cityId,
        countyName: data.addressComponent.district,
        provinceName: data.addressComponent.province,
        cityName: data.addressComponent.city,
        address: data.addressComponent.township + data.addressComponent.street + data.addressComponent.streetNumber,
        fullAddress: data.address,
        areaName: data.addressComponent.province + data.addressComponent.city + data.addressComponent.district,
      });
    }, () => {
    });
  }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      orgName: [null, [Validators.required]], // 公司名称
      orgNature: [null, [Validators.required]], // 公司性质
      orgNatureName: [null], // 公司性质名称
      engName: [null, [Validators.required]], // 外文名称
      chineseName: [null, [Validators.required]], // 中文名称
      loginName: [{value: null, disabled: !!this.companyInfo}, [Validators.required]], // 管理员账号
      setupDate: [null], // 成立时间
      principal: [null], // 负责人
      tel: [null, [this.validator.telephoneValidator()]], // 电话
      email: [null, [this.validator.emailValidator()]], // 电子邮箱
      fax: [null, [this.validator.telephoneValidator()]], // 传真
      zipcode: [null], // 邮编
      provinceId: [null], // 省code
      cityId: [null], // 市code
      countyId: [null], // 县code
      areaName: [null], // 省、市、县
      address: [null], // 详细地址
      provinceName: [null], // 省
      cityName: [null], // 市
      countyName: [null], // 县
      fullAddress: [null], // 地址全称，由省、市、县、详细地址组成，为了页面展示
      lat: [null], // 维度
      lng: [null], // 经度
      companyWebsite: [null], // 公司网址
      scopeBusiness: [null], // 经营范围
      remark: [null], // 备注说明
    });
    this.getCompanyNatureList();
    if (this.companyInfo) {
      console.log(this.companyInfo);
      this.companyAddress = this.companyInfo.areaName;
      this.companyInfo.setupDate = new Date(this.companyInfo.setupDate);
      this.companyForm.patchValue(this.companyInfo);
      this.companyForm.patchValue({
        provinceId: this.companyInfo.provinceId,
        provinceName: this.companyAddress,
        cityName: '',
        countyName: '',
        address: this.companyInfo.address,
        areaName: this.companyInfo.areaName,
        fullAddress: this.companyInfo.areaName + this.companyInfo.address
      });
      this.companyForm.addControl('orgId', this.formBuilder.control(this.companyInfo.orgId));
    } else {
      this.companyForm.reset();
    }
  }
}
