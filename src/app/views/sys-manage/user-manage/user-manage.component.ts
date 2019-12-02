import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {UserManageService, UserManageServiceNs} from '../../../core/biz-services/sysManage/user-manage.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {RoleManageService, RoleManageServiceNs} from '../../../core/biz-services/sysManage/role-manage.service';
import {CompanyService, CompanyServiceNs} from '../../../core/biz-services/company/company.service';
import {ActionCode} from '../../../../environments/actionCode';
import {TeamManageService, TeamManageServiceNs} from '../../../core/biz-services/resource/team-manage.service';
import {PeoManageService, PeoManageServiceNs} from '../../../core/biz-services/resource/peo-manage.service';
import {userTypeNodes} from '../../../../environments/type-search';
import {SearchInfoService} from '../../../core/common-services/searchInfo.service';
import {Observable} from 'rxjs';
import {UserServiceNs, UserService} from '../../../core/common-services/user.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
  // 页面名称
  pageName = '用户';
  ActionCode = ActionCode;
  // 查询条件
  filters: any;
  // table控件配置
  tableConfig: any;
  // 弹窗表单
  validateForm: FormGroup;

  // 表格类
  isAllChecked = false;
  // table绑定数据
  listOfAllData = [];
  // table已勾选的复选框id
  checkedId: { [key: string]: boolean } = {};

  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  // 是否连续添加
  isContinue = false;
  // 是否新增
  isAdd = false;
  // 是否只读
  isReadonly = false;

  // 机构列表Tree结构数据
  orgs = [];
  defaultExpanded = [];
  // 角色下拉列表数据
  roles = [];
  // 班组下拉列表数据
  workGroups = [];
  // 员工下拉列表数据
  workPersonnels = [];
  // 用户类型
  userTypeList = userTypeNodes;
  // 选择的用户数据
  selectUserData: any;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private messageService: ShowMessageService,
    private userManageService: UserManageService,
    private roleManageService: RoleManageService,
    private companyService: CompanyService,
    private teamManageService: TeamManageService,
    private peoManageService: PeoManageService,
    private searchInfoService: SearchInfoService,
    private userService: UserService
  ) {
    this.filters = {
      deptId: null,
      name: null
    };
    this.tableConfig = {
      showCheckBox: true,
      allChecked: false,
      pageSize: 20,
      pageNum: 1,
      total: 0,
      loading: false
    };
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [null],                                                              // id
      // loginName: [null, [Validators.required, Validators.maxLength(50)]],      // 登录名
      // name: [null, [Validators.required, Validators.maxLength(100)]],          // 用户名
      workPersonnelId: [null, [Validators.required]],
      deptId: [null, [Validators.required]],                                   // 所属机构id
      workGroupId: [null],                                                     // 所属班组id
      roleId: [null, [Validators.required]],                                   // 所属角色id
      // mobile: [null, [Validators.maxLength(20)]],         // 手机号码
      // email: [null, [Validators.maxLength(50)]],                               // 电子邮箱
      remark: [null, [Validators.maxLength(100)]],                             // 备注
      userType: [0, [Validators.required]]                                       // 用户类型
    });
    this.searchData();
    this.initList();
    this.messageService.closeLoading();
    // this.getPersonnels(null);
  }

  /**
   * 初始化数据
   */
  initList() {
    // 机构Tree结构列表查询
    this.searchInfoService.getOrgList().subscribe((resData: CompanyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        return;
      }
      this.orgs = this.initOrgNode(resData.value);
      this.defaultExpanded = this.orgs ? [this.orgs[0].key] : [];
    }, (error: any) => {
    });
    // 查询角色列表
    const filterRole = {
      deptId: null
    };
    this.roleManageService.getAllList(filterRole).subscribe((resData: RoleManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.roles = [];
        return;
      }
      this.roles = resData.value;
    }, (error: any) => {
    });

  }

  private initOrgNode(info) {
    return info.map((item) => {
      if (item.children && item.children.length > 0) {
        this.initOrgNode(item.children);
      } else {
        item.isLeaf = true;
      }
      item.key = item.id;
      return item;
    });
  }

  /**
   * 获取人员数据
   */
  getPersonnels(orgId, workGroupId) {
    const filter2 = {
      orgId: orgId,
      workGroupId: workGroupId
    };
    this.peoManageService.searchListForIus(filter2).subscribe((resData: PeoManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        return;
      }
      this.workPersonnels = resData.value;
      if (!this.isAdd && this.selectUserData.workPersonnelDO) {
        this.getWorkPersonnels(this.selectUserData);
      }
    }, (error: any) => {
    });
  }

  /**
   * 列表查询
   * @param reset 是否重置(重置需要更改pageNum)
   */
  searchData(reset: boolean = false) {
    if (reset) {
      this.tableConfig.pageNum = 1;
    }
    const filter = {
      pageNum: this.tableConfig.pageNum,
      pageSize: this.tableConfig.pageSize,
      filters: this.filters
    };
    this.tableConfig.loading = true;
    this.userManageService.getList(filter).subscribe((resData: UserManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.tableConfig.loading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.checkedId = {};
      this.listOfAllData = resData.value.list;
      this.listOfAllData.forEach((item) => {
        item.userTypeName = this.userTypeList[item.userType].label;
      });
      this.tableConfig.total = resData.value.total;
      this.tableConfig.loading = false;
    }, (error: any) => {
      this.tableConfig.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }


  /**
   * 重置
   */
  resetSearchInfo() {
    this.filters = {
      deptId: null,
      name: null
    };
    this.tableConfig.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.searchData();
  }

  // 表格页码、页数改变时
  pageChange(reset: boolean = false): void {
    if (reset) {
      this.tableConfig.pageNum = 1;
    }
    this.checkedId = {};
    this.isAllChecked = false;
    this.searchData();
  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => (this.checkedId[item.id] = value));
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.every(item => this.checkedId[item.id]);
  }

  /**
   * 机构change事件
   */
  changeOrg(value) {
    this.validateForm.controls['workGroupId'].reset();
    this.validateForm.controls['workPersonnelId'].reset();
    this.validateForm.controls['roleId'].reset();
    this.workPersonnels = [];
    // this.getPersonnels(value, null);
    if (value === null) {
      this.workGroups = [];
      //  this.roles = [];
      return;
    }
    // 查询班组列表
    const filter1 = {
      orgId: value
    };
    this.teamManageService.getAllList(filter1).subscribe((resData: TeamManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.workGroups = [];
        return;
      }
      this.workGroups = resData.value;
    }, (error: any) => {
    });

  }

  /**
   * 班组change事件
   */
  changeWorkGroup(value) {
    this.workPersonnels = [];
    this.validateForm.controls['workPersonnelId'].reset();
    this.validateForm.controls['roleId'].reset();
    const orgId = this.validateForm.controls['deptId'].value;
    if (orgId !== null) {
      this.getPersonnels(orgId, value);
    }
    // if (value === null) {
    //   this.workGroups = [];
    //   this.roles = [];
    //   return;
    // }
    // // 查询角色列表
    // const filter = {
    //   deptId: value
    // };
    // this.roleManageService.getAllList(filter).subscribe((resData: RoleManageServiceNs.UfastHttpAnyResModel) => {
    //   if (resData.code !== 0) {
    //     this.roles = [];
    //     return;
    //   }
    //   this.roles = resData.value;
    // }, (error: any) => {
    // });
  }

  /**
   * 员工数据加载
   */
  loadPersonnels(num) {
    if (num && !this.isAdd) {
      const orgId = this.validateForm.controls['deptId'].value;
      const groupId = this.validateForm.controls['workGroupId'].value;
      this.getPersonnels(orgId, groupId);
    }
  }

  /**
   * 新增
   */
  addInfo(): void {
    this.isAdd = true;
    this.isReadonly = false;
    this.isContinue = false;
    this.detailModal.title = `新增${this.pageName}信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.showDetailModal({});
  }

  /**
   * 编辑
   */
  editInfo(data?: any): void {
    this.isAdd = false;
    this.isReadonly = false;
    this.detailModal.title = `编辑${this.pageName}信息`;
    this.isContinue = false;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = true;
    this.showDetailModal(data);
  }

  /**
   * 查看详情
   */
  viewInfo(data?: any): void {
    this.isAdd = false;
    this.isReadonly = true;
    this.detailModal.title = `查看${this.pageName}信息`;
    this.isContinue = false;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.showDetailModal(data);
  }

  /**
   * 显示弹窗
   */
  showDetailModal(data: any): void {
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    if (this.isAdd) {
      this.validateForm.reset();
      this.detailModal.show = true;
      return;
    }
    if (data) {
      this.selectUserData = data;
    }
    this.validateForm.controls['id'].setValue(data.id);
    // this.validateForm.controls['loginName'].setValue(data.iusAccountDO.loginName);
    // this.validateForm.controls['name'].setValue(data.name);
    this.validateForm.controls['deptId'].setValue(data.deptId);
    this.validateForm.controls['workGroupId'].setValue((
      data.workPersonnelDO === null || data.workPersonnelDO.workGroupId === null) ? '' : data.workPersonnelDO.workGroupId);
    this.validateForm.controls['workPersonnelId'].setValue(data.workPersonnelId);
    this.validateForm.controls['roleId'].setValue(data.iusUserRolesDO.roleId);
    //  this.validateForm.controls['mobile'].setValue(data.mobile);
    // this.validateForm.controls['email'].setValue(data.email);
    this.validateForm.controls['remark'].setValue(data.remark);
    this.validateForm.controls['userType'].setValue(data.userType);
    this.detailModal.show = true;
  }

  getWorkPersonnels(data) {
    let person;
    person = this.workPersonnels;
    person.unshift(data.workPersonnelDO);
    this.workPersonnels = person;
  }

  /**
   * 保存弹框
   */
  handleDetailSave() {
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsDirty();
        controls[key].updateValueAndValidity();
      }
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.detailModal.loading = true;
    // 重新组装数据格式
    const param = this.validateForm.value;
    // param['iusAccountDO'] = {
    //   loginName: this.validateForm.controls['loginName'].value
    // };
    // delete param['loginName'];
    param['workGroupDO'] = {
      workGroupId: this.validateForm.controls['workGroupId'].value
    };
    delete param['workGroupId'];
    param['workPersonnelDO'] = {
      workPersonnelId: this.validateForm.controls['workPersonnelId'].value
    };
    param['iusUserRolesDO'] = {
      roleId: this.validateForm.controls['roleId'].value
    };
    delete param['roleId'];
    let observer: any = null;
    if (this.isAdd) {
      observer = this.userManageService.add(param);
    } else {
      observer = this.userManageService.update(param);
    }
    observer.subscribe((resData: UserManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.detailModal.loading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      // 连续添加
      if (this.isContinue) {
        this.validateForm.reset();
      } else {
        this.detailModal.show = false;
        this.searchData();
      }
      this.detailModal.loading = false;
      this.messageService.showToastMessage('操作成功', 'success');
    }, (error: any) => {
      this.detailModal.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
  }

  // 删除弹框
  delModal() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.id]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要删除的信息', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要删除选中的${this.pageName}信息吗？`,
      nzOnOk: () => {
        const ids = [];
        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            ids.push(key);
          }
        }
        this.tableConfig.loading = true;
        this.userManageService.delete(ids).subscribe((resData: UserManageServiceNs.UfastHttpAnyResModel) => {
          if (resData.code !== 0) {
            this.tableConfig.loading = false;
            this.messageService.showAlertMessage('', resData.message, 'warning');
            return;
          }
          this.messageService.showToastMessage('操作成功', 'success');
          this.tableConfig.loading = false;
          this.checkedId = {};
          this.isAllChecked = false;
          this.searchData();
        }, (error: any) => {
          this.tableConfig.loading = false;
          this.messageService.showAlertMessage('', error.message, 'error');
        });
      }
    });
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  resetPwd(item) {
    this.messageService.showAlertMessage('', '确定重置用户(' + item.name + ')密码吗?', 'confirm').afterClose.subscribe((type: string) => {
      if (type !== 'onOk') {
        return;
      }
      this.commonResDeal(this.userService.resetPassword([item.id]));
    });
  }

  private commonResDeal(observer: Observable<any>, refresh: boolean = false) {
    observer.subscribe((resData: UserServiceNs.UfastHttpAnyResModel) => {
      if (resData.code === 0) {
        this.messageService.showToastMessage('操作成功', 'success');
        if (refresh) {
          //   this.getUserList();
        }
      } else {
        this.messageService.showToastMessage(resData.message, 'warning');
      }
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

}
