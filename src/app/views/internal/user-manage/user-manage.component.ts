import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserServiceNs, UserService} from '../../../core/common-services/user.service';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {Observable} from 'rxjs';
import {UfastValidatorsService} from '../../../core/infra/validators/validators.service';
import {ScepterServiceNs, ScepterService} from '../../../core/common-services/scepter.service';
import {ActionCode} from '../../../../environments/actionCode';
enum TabPageType {
  ManagePage = 0,
  AddPage,
  EditPage
}

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {

  tabPageIndex: number;
  tabPageType: TabPageType;

  userDataList: any[];
  userTableConfig: any;
  selectedUserIdList: string[];
  userInfoForm: FormGroup;
  departmentOptions: any[];
  roleIdList: ScepterServiceNs.RoleModel[];
  editUserInitDeptId: string;
  operateUserId: string;
  addOrEditTitle: string;
  selectedList: number[];
  @ViewChild('operation')operation: TemplateRef<any>;
  ActionCode = ActionCode;
  constructor(private userService: UserService, private messageService: ShowMessageService,
              private formBuilder: FormBuilder, private validator: UfastValidatorsService,
              private scepterService: ScepterService
  ) {
    this.selectedList = [];
    this.tabPageType = TabPageType.ManagePage;
    this.userDataList = [];
    this.selectedUserIdList = [];

    this.departmentOptions = [];

    this.userTableConfig = {
      pageSize: 20,
      showCheckBox: true,
      allChecked: false,
      pageNum: 1,
      total: 0,
      loading: false,
      header: [{
        name: '账号',
        field: 'loginName',
        width: '8%'
      }, {
        name: '用户名',
        field: 'name',
        width: '8%'
      }, {
        name: '昵称',
        field: 'nickname',
        width: '7%'
      }, {
        name: '性别',
        field: 'sex',
        width: '4%',
        pipe: 'sex'
      }, {
        name: '状态',
        field: 'locked',
        width: '5%',
        pipe: 'lockedStatus'
      }, {
        name: '电话',
        field: 'telephone',
        width: '8%'
      }, {
        name: '手机',
        field: 'mobile',
        width: '8%'
      }, {
        name: '部门',
        field: 'deptName',
        width: '7%'
      }, {
        name: '邮箱',
        field: 'email',
        width: '8%'
      }, {
        name: '类型',
        field: 'roleNames',
        width: '8%'
      }, {
        name: '登录时间',
        field: 'lastLoginTime',
        width: '8%',
        pipe: 'date:y-MM-dd HH:mm:ss'
      }
      ]
    };

    this.roleIdList = [];

  }
  public trackByTableHeader(index: number, item: any) {
    return item.field;
  }

  public trackByUserId(index: number, item: any) {
    return item.userId;
  }

  public checkUserTableAll(value: boolean) {
    this.selectedUserIdList = [];
    for (let i = 0, len = this.userDataList.length; i < len; i++) {
      this.userDataList[i].checked = value;
      if (value) {
        this.selectedUserIdList.push(this.userDataList[i].userId);
      }
    }

  }

  public checkUserTableSingle(value: boolean, item: any) {

    if (value) {
      this.selectedUserIdList.push(item.userId);
      if (this.selectedUserIdList.length === this.userDataList.length) {
        this.userTableConfig.allChecked = true;
      }
    } else {
      this.userTableConfig.allChecked = false;
      this.deleteIdSelected(item.userId);
    }
  }

  private deleteIdSelected(roleId: string) {
    for (let i = 0, len = this.selectedUserIdList.length; i < len; i++) {
      if (this.selectedUserIdList[i] === roleId) {
        this.selectedUserIdList.splice(i, 1);
        break;
      }
    }
  }
  private getUserList(pageNum?: number) {
    let filter = {
      pageNum: pageNum || this.userTableConfig.pageNum,
      pageSize: this.userTableConfig.pageSize,
      filters: {}
    };
    this.userTableConfig.loading = true;
    this.userService.getUserList(filter).subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      this.userTableConfig.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.userDataList = resData.value.list;
      this.userDataList.forEach( item => {
        console.log(item.locked);
        item.locked = item.locked === 0; // 0表示未锁定，1 表示已锁定
      });
      this.userTableConfig.total = resData.value.total;
    }, (error: any) => {
      this.userTableConfig.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  public deleteUsers(userIdList: string[]) {

    if (userIdList.length === 0) {
      this.messageService.showToastMessage('请选择要删除的用户?', 'info');
      return;
    }
    this.messageService.showAlertMessage('', '确定要删除吗?', 'confirm').afterClose.subscribe((type: string) => {
      if (type !== 'onOk') {
        return;
      }
      this.commonResDeal(this.userService.removeUsers(userIdList), true);
    });
  }

  public resetPd(item: any) {
    this.messageService.showAlertMessage('', '确定重置密码吗?', 'confirm').afterClose.subscribe((type: string) => {
      if (type !== 'onOk') {
        return;
      }
      this.commonResDeal(this.userService.resetPassword([item.userId]));
    });
  }

  public lockUser(enable: boolean, item: any) {

    const message: string = enable ? '启用' : '锁定'; // enable为true， 启用， false为禁用 

    this.messageService.showAlertMessage('', `确定${message}该用户吗?`, 'confirm').afterClose.subscribe((type: string) => {
      if (type !== 'onOk') {
        item.locked = !enable;
        return;
      }
      this.commonResDeal(this.userService.lockUsers((enable ? 0 : 1), [item.userId]), true);
    });

  }

  public addOrEditUserTab(type: number, item?: UserServiceNs.UserInfoModel) {
    this.tabPageType = type;
    this.tabPageIndex = 1;


    if (type === TabPageType.EditPage) {
      this.addOrEditTitle = '编辑';
      this.operateUserId = item.userId;
      this.getRoleIds();
      this.userService.getUserDetail(item.userId).subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
        if (resData.code !== 0) {
          this.messageService.showToastMessage(resData.message, 'warning');
        }
        this.userInfoForm.setValue({
          name: resData.value.name,
          loginName: resData.value.loginName,
          nickname: resData.value.nickname,
          mobile: resData.value.mobile,
          telephone: resData.value.telephone,
          email: resData.value.email,

          locked: resData.value.locked + '',
          sex: resData.value.locked + '',
          roleIds: resData.value.roleIds,
          deptId: resData.value.deptName
        });
        this.editUserInitDeptId = item.deptId;
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });


    } else if (type === TabPageType.AddPage) {
      this.addOrEditTitle = '新增';
      this.getRoleIds();
      this.userInfoForm.patchValue({
        locked: '0',
        sex: '1'
      });
    } else {
      return;
    }
  }

  public tabPageChange() {

    // 用户点击标签页切换
    if (this.tabPageType !== TabPageType.ManagePage) {
      if (this.tabPageIndex === 0) {
        this.toggleManagePage();
      }
    }

  }

  public toggleManagePage() {
    this.roleIdList = [];
    this.departmentOptions = [];
    this.userInfoForm.reset();
    this.tabPageType = TabPageType.ManagePage;
    this.tabPageIndex = 0;
    this.operateUserId = '';
  }

  private commonResDeal(observer: Observable<any>, refresh: boolean = false) {
    observer.subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      if (resData.code === 0) {
        this.messageService.showToastMessage('操作成功', 'success');
        if (refresh) {
          this.getUserList();
        }
      } else {
        this.messageService.showToastMessage(resData.message, 'warning');
      }
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  public showDepartment(value: any) {

    if (value) {
      if (this.departmentOptions.length === 0) {
        this.getDepartmentList('0');
      }
    }
  }

  public selectDepartmentItem(itemDetail: any) {
    if (itemDetail.option.isLeaf) {
      return;
    }
    itemDetail.option.children.shift();
    this.getDepartmentList(itemDetail.option.value, itemDetail.option.children);

  }

  private getDepartmentList(id: string, targetList?: any[]) {
    this.userService.getDepartment(id).subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showToastMessage(resData.message, 'warning');
        return;
      }

      const modelList: UserServiceNs.DepartmentModel[] = <UserServiceNs.DepartmentModel[]>resData.value;
      const tempList = targetList || [];

      for (let i = 0, len = modelList.length; i < len; i++) {
        const temp = {
          label: modelList[i].name,
          value: modelList[i].id,
          isLeaf: modelList[i].leaf === 0 ? false : true,
          children: modelList[i].leaf === 0 ? [{}] : undefined
        };
        tempList.push(temp);
      }
      if (!targetList) {
        this.departmentOptions = tempList;
      }
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  public getRoleIds() {
    this.scepterService.getRoles().subscribe((resData: ScepterServiceNs.ScepterResModelT<ScepterServiceNs.RoleModel[]>) => {
      if (resData.code !== 0) {
        this.messageService.showToastMessage(resData.message, 'warning');
        return;
      }
      this.roleIdList = resData.value;

    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });


  }

  public addOrEditSubmit() {

    for (const key in this.userInfoForm.controls) {
      this.userInfoForm.controls[key].markAsDirty();
      this.userInfoForm.controls[key].updateValueAndValidity();
    }

    if (this.userInfoForm.invalid) {
      return;
    }

    const data: UserServiceNs.UserInfoModel = {
      loginName: this.userInfoForm.value.loginName,
      name: this.userInfoForm.value.name,
      nickname: this.userInfoForm.value.nickname,
      sex: parseInt(this.userInfoForm.value.sex, 10),
      locked: parseInt(this.userInfoForm.value.locked, 10),
      mobile: this.userInfoForm.value.mobile,
      telephone: this.userInfoForm.value.telephone,
      email: this.userInfoForm.value.email,
      roleIds: this.userInfoForm.value.roleIds,
      deptId: this.userInfoForm.value.deptId instanceof Array ? this.userInfoForm.value.deptId.pop() : this.editUserInitDeptId,
      userId: this.operateUserId
    };

    let observer: any = null;
    if (this.tabPageType === TabPageType.AddPage) {
      observer = this.userService.addUser(data);
    } else if (this.tabPageType === TabPageType.EditPage) {
      observer = this.userService.updateUserInfo(data);
    } else {
      return;
    }

    observer.subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      if (resData.code === 0) {
        this.messageService.showToastMessage('操作成功', 'success');
        this.getUserList();
        this.toggleManagePage();
      }
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  ngOnInit() {
    this.userInfoForm = this.formBuilder.group({
      loginName: [null, [Validators.required, Validators.maxLength(20)]],
      name: [null, [Validators.required, Validators.maxLength(20)]],
      nickname: [null, Validators.maxLength(20)],
      sex: [null, Validators.required],
      deptId: [[], [Validators.required]],
      roleIds: [[], [Validators.required]],
      telephone: [null, [this.validator.telephoneValidator()]],
      mobile: [null, [Validators.maxLength(11), Validators.minLength(11)]],
      email: [null, [this.validator.emailValidator()]],
      locked: [null, Validators.required]
    });

    this.getUserList();
  }

}
