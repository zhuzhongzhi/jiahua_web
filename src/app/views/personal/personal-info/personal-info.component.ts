import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserServiceNs, UserService} from '../../../core/common-services/user.service';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {UfastValidatorsService} from '../../../core/infra/validators/validators.service';
import {UserManageService, UserManageServiceNs} from '../../../core/biz-services/sysManage/user-manage.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  userInfo: UserServiceNs.UserInfoModel;
  constructor(private userService: UserService, private messageService: ShowMessageService, private activeRouter: ActivatedRoute,
              private formBuilder: FormBuilder, private validator: UfastValidatorsService, private router: Router,
              private userManageService: UserManageService
  ) {
    this.userInfo = {
      locked: null,
      loginName: '',
      name: '',
      roleIds: null,
      sex: null,
      deptId: '',
      spaceName: ''
    };
  }
  public getPersonalInfo() {
    this.userService.getLogin().subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      if (resData.code === 0) {
        this.userInfo = {
          locked: resData.value.locked,
          loginName: resData.value.loginName,
          name: resData.value.name,
          roleIds: resData.value.roleIds,
          sex: resData.value.sex,
          deptId: resData.value.deptId,
          nickname: resData.value.nickname,
          deptName: resData.value.deptName,
          email: resData.value.email,
          mobile: resData.value.mobile,
          telephone: resData.value.telephone,
          roleNames: resData.value.roleNames,
          spaceName: resData.value.spaceName
        };
        this.getUserMessage(resData.value.userId);
      } else {
        this.messageService.showAlertMessage('', resData.message, 'warning');
      }
    });
  }
  // 获取当前登录用户的真实姓名和手机号码
getUserMessage(userID) {
  const filter = {
    id: userID
  };
  this.userManageService.getUserMess(filter).subscribe((resData: UserManageServiceNs.UfastHttpAnyResModel) => {
    if (resData.code !== 0) {
      return;
    }
    this.userInfo.name = resData.value.workPersonnelName;
    this.userInfo.mobile = resData.value.mobile;
  }, (error: any) => {
  });
}
  public navigatePd() {
    this.router.navigate(['../modifyPwd'], {relativeTo: this.activeRouter});
  }

  ngOnInit() {
    this.getPersonalInfo();
  }

}
