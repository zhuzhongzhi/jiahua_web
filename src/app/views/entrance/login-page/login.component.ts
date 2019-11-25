import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService, UserServiceNs} from '../../../core/common-services/user.service';
import {StorageProvider} from '../../../core/common-services/storage';
import {UfastValidatorsService} from '../../../core/infra/validators/validators.service';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CookieService} from 'ngx-cookie-service';
import {Md5} from 'ts-md5';

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
              private messageService: ShowMessageService, private modalService: NzModalService,
              private message: NzMessageService, private cookieService: CookieService
  ) {
    this.remark = '';
    this.loading = false;
  }

  public loginSubmit() {

    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.loading = true;

    // axios.post('http://localhost:4202/site/iot-server/jiahua/user/login', {
    //   userName: this.validateForm.value.userName,
    //   password: this.validateForm.value.password
    // }).then(res => {
    //   if(res.status === 200) {
    //     this.message.success('登录成功');
    //     this.cookieService.set('authCode', res.data);
    //     this.router.navigate(['../main/latheManage'], {
    //       relativeTo: this.activeRouter
    //     });
    //   }
    // });
    const pwd = String(Md5.hashStr(this.validateForm.value.password));
    this.userService.login({userName: this.validateForm.value.userName, password: pwd})
      .subscribe((resData) => {
        console.log(resData);
        this.loading = false;
        // if (resData.code !== 0) {
        //   this.message.warning(resData.message);
        //   return;
        // }

        // 简易密码校验
        this.message.success('登录成功');
        sessionStorage.setItem('x-user-id', resData.value);
        // 设置rights
        this.userService.getLogin({userName: this.validateForm.value.userName, password: pwd}).subscribe((res) => {
          localStorage.setItem('rights', JSON.stringify(res.value.jiahuaUserAuthList));
          localStorage.setItem('userName', this.validateForm.value.userName);
          localStorage.setItem('saved', pwd);
          localStorage.setItem('userId', res.value.jiahuaUser.userId);
          this.router.navigate(['../main/latheManage'], {
            relativeTo: this.activeRouter
          });

        });

        // this.cookieService.set('x-user-id', resData.value);

      }, (error: UserServiceNs.HttpError) => {
        this.message.error(error.message);
        this.loading = false;
      });

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
