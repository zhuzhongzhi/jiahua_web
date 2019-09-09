import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserServiceNs, UserService} from '../../../core/common-services/user.service';
import {StorageProvider} from '../../../core/common-services/storage';
import {UfastValidatorsService} from '../../../core/infra/validators/validators.service';
import {environment} from '../../../../environments/environment';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {NzModalService} from 'ng-zorro-antd';
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  // 重置密码
  resetPasswordForm: FormGroup;
  remark: string;
  loading: boolean;
  detailModal = {
    show1: false,
    loading: false
  };

  constructor(private userService: UserService, private router: Router,
              private storage: StorageProvider, private validator: UfastValidatorsService,
              private formBuilder: FormBuilder, private activeRouter: ActivatedRoute,
              private messageService: ShowMessageService, private modalService: NzModalService
  ) {
    this.remark = '';
    this.loading = false;
  }

  public loginSubmit() {

    for (let key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.storage.setItem('jiangtong_remember_account', this.validateForm.value.remember ? 1 : 0);
    if (this.validateForm.value.remember) {
      this.storage.setObject('jiangtong_account', {username: this.validateForm.value.userName, password: this.validateForm.value.password});
    }
    // this.loading = true;
    this.router.navigate(['../main/latheManage'], {
      relativeTo: this.activeRouter
    });

    // this.userService.postLogin({loginName: this.validateForm.value.userName, password: this.validateForm.value.password})
    //   .subscribe((resData: UserServiceNs.AuthAnyResModel) => {
    //     this.loading = false;
    //
    //     if (resData.code !== 0) {
    //       this.remark = resData.message;
    //       return;
    //     }
    //     if (this.validateForm.value.password === '123456') {
    //       this.modalService.info({
    //         nzTitle: '您当前的密码过于简单，请修改密码',
    //         nzOnOk: () => {
    //           this.showModel1();
    //         }
    //       });
    //       return;
    //     }
    //     this.router.navigate(['../main/sysManage'], {
    //       relativeTo: this.activeRouter
    //     });
    //   }, (error: UserServiceNs.HttpError) => {
    //     this.remark = error.message;
    //     this.loading = false;
    //   });
  }

  ngOnInit() {
    const remember = Number(this.storage.getItem('jiangtong_remember_account'));
    let value;
    // console.log(remember);
    if (remember) {
      value = this.storage.getItem('jiangtong_account');
      value = JSON.parse(value);
    }
    this.validateForm = this.formBuilder.group({
      userName: [remember ? value.username : '', [Validators.required]],
      password: [remember ? value.password : '', [Validators.required]],
      remember: [remember ? true : false]
    });
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, this.validator.passwordValidator()]],
      secPassword: [null, [Validators.required, this.confirmValidator]]
    });
  }

  // 显示重置密码弹框——弹框1
  showModel1(): void {
    this.detailModal.show1 = true;
    this.detailModal.loading = false;
  }

  // 取消重置密码弹框——弹框1
  handleCancelModel1(): void {
    this.detailModal.show1 = false;
    this.detailModal.loading = false;
  }

  // 保存重置密码弹框——弹框1
  saveModel1() {
    for (const key in this.resetPasswordForm.controls) {
      this.resetPasswordForm.controls[key].markAsDirty();
      this.resetPasswordForm.controls[key].updateValueAndValidity();
    }
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.detailModal.loading = true;
    this.userService.modifyPassword(this.resetPasswordForm.value.oldPassword, this.resetPasswordForm.value.newPassword)
      .subscribe((resData: any) => {
        if (resData.code === 0) {
          this.handleCancelModel1();
          this.userService.logout();
          this.validateForm.controls['password'].setValue('');
          this.messageService.showAlertMessage('', '修改密码成功,请重新登录.', 'success');
        } else {
          this.detailModal.loading = false;
          this.messageService.showAlertMessage('', resData.message, 'warning');
        }
      }, (error: any) => {
        this.detailModal.loading = false;
        this.messageService.showAlertMessage('', error.message, 'error');
      });
  }

  // 确认密码验证
  confirmValidator = (control: FormControl) => {
    if (!control.value) {
      return {required: true};
    }
    if (control.value !== this.resetPasswordForm.value.newPassword) {
      return {confirm: true, error: true};
    }
    return {};
  }
}
