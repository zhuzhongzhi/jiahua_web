import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, ValidationErrors, AbstractControl} from '@angular/forms';
import {UfastValidatorsService} from '../../../core/infra/validators/validators.service';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {UserService, UserServiceNs} from '../../../core/common-services/user.service';
import {SupplierInfoNs} from '../../../core/biz-services/biz.service.module';
import {SupplierInfoService} from '../../../core/biz-services/menu/supplier-info.service';

enum MaxInputLen {
  CompanyName = 50,
  CreditCode = 18,
  Account = 20,
  Password =  20,
  Name = 50
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  infoForm: FormGroup;
  MaxInputLenEnum = MaxInputLen;
  enableSendCode: boolean;
  verifyImgUrl: string;
  registerInfo: SupplierInfoNs.RegisterInfo;
  constructor(private supplierInfoService: SupplierInfoService, private formBuilder: FormBuilder, private userService: UserService,
              private ufastValidatorsService: UfastValidatorsService, private messageService: ShowMessageService ) {
    this.enableSendCode = true;
    this.registerInfo = <any>{};
  }
  public sendVerifyCode() {
  }
  public refreshVerify() {
    this.userService.getAuthInfo()
      .subscribe((data: UserServiceNs.AuthInfoResModel) => {
        this.verifyImgUrl = data.value.verifyImgUrl;
        this.registerInfo.authId = data.value.authId;
      }, (error: UserServiceNs.HttpError) => {
        this.messageService.showToastMessage(error.message, 'error');
      });
  }
  public register() {
    Object.keys(this.infoForm.controls).forEach((controlerKey) => {
      this.infoForm.controls[controlerKey].markAsDirty();
      this.infoForm.controls[controlerKey].updateValueAndValidity();
    });
    if (this.infoForm.invalid) {
      return;
    }
    Object.assign(this.registerInfo, this.infoForm.getRawValue());
    this.registerInfo['confirmPw'] = undefined;
    this.messageService.showLoading('');
    this.supplierInfoService.registerSupplier(this.registerInfo).subscribe((resData: SupplierInfoNs.SupplierResModelT<any>) => {
      this.messageService.closeLoading();
      if (resData.code !== 0) {
        this.messageService.showToastMessage(resData.message, 'error');
        this.refreshVerify();
        return;
      }
      this.messageService.showToastMessage('注册成功', 'success');
    }, (error) => {
      this.messageService.showAlertMessage('', error.message, 'error');
      this.messageService.closeLoading();
    });
  }
  confirmPwValidator = (control: AbstractControl): ValidationErrors  => {
    if (!control.value) {
      return null;
    }
    return control.value === this.infoForm.controls['password'].value ? null : {message: '两次密码不一致'};
  }
  ngOnInit() {
    this.infoForm = this.formBuilder.group({
      companyName: [null, [Validators.required, Validators.maxLength(MaxInputLen.CompanyName)]],
      socialCreditCode: [null, [Validators.required, Validators.maxLength(MaxInputLen.CreditCode)]],
      loginName: [null, [Validators.required, Validators.maxLength(MaxInputLen.Account)]],
      password: [null, [Validators.required, this.ufastValidatorsService.passwordValidator()]],
      confirmPw: [null, [Validators.required, this.confirmPwValidator]],
      userName: [null, [Validators.maxLength(MaxInputLen.Name)]],
      phone: [null, [Validators.required, this.ufastValidatorsService.mobileValidator()]],
      verifyCode: [null, [Validators.required]]
    });
    this.refreshVerify();
  }

}
