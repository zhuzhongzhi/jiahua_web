import { Component, OnInit } from '@angular/core';
import { ScepterService, ScepterServiceNs } from '../../../core/common-services/scepter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { ActionCode } from '../../../../environments/actionCode';
import { RoleManageService, RoleManageServiceNs } from '../../../core/biz-services/sysManage/role-manage.service';
import { CompanyService, CompanyServiceNs } from '../../../core/biz-services/company/company.service';
import {SearchInfoService} from '../../../core/common-services/searchInfo.service';
import {StorageProvider} from '../../../core/common-services/storage';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.scss']
})
export class RoleManageComponent implements OnInit {
  // 页面名称
  pageName = '角色';
  ActionCode = ActionCode;
  // table控件配置
  tableConfig: any;
  // 查询条件
  filters: any;
  // 弹窗表单
  validateForm: FormGroup;

  // 表格类
  isAllChecked = false;
  // table已勾选的复选框id
  checkedId: { [key: string]: boolean } = {};

  // table绑定数据
  rolesList: ScepterServiceNs.RoleModel[];

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
  // 页面位置
  tabIndex: number;
  // 加载中
  isSpinning = true;

  authTree: ScepterServiceNs.MenuShownItemModel[];

  authCodeObj: any;
  menuCodeObj: any;
  menuIndeterminateObj: any;
  privilegeRole: ScepterServiceNs.RoleModel;
  selRoleData: any;
  constructor(
    private scepterService: ScepterService,
    private roleManageService: RoleManageService,
    private showMessageService: ShowMessageService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private searchInfoService: SearchInfoService,
    private storage: StorageProvider,
  ) {
    this.privilegeRole = null;
    this.authCodeObj = {};
    this.menuCodeObj = {};
    this.menuIndeterminateObj = {};

    this.authTree = [{
      auths: [],
      name: '',
      url: '',
      children: []
    }];
    this.tabIndex = 0;

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
      name: [null, [Validators.required, Validators.maxLength(100)]],          // 角色名
      deptId: [null, [Validators.required]],                                   // 所属机构id
      remark: [null, [Validators.maxLength(100)]],                             // 备注
    });
    this.initList();
    this.searchData();

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
    this.roleManageService.getList(filter).subscribe((resData: RoleManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.tableConfig.loading = false;
        this.showMessageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.checkedId = {};
      this.rolesList = resData.value.list;
      this.tableConfig.total = resData.value.total;
      this.tableConfig.loading = false;
    }, (error: any) => {
      this.tableConfig.loading = false;
      this.showMessageService.showAlertMessage('', error.message, 'error');
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

  /**
   * 全选
   */
  checkAll(value: boolean): void {
    this.rolesList.forEach(item => (this.checkedId[item.id] = value));
  }

  /**
   * 复选框勾选
   */
  refreshStatus(): void {
    this.isAllChecked = this.rolesList.every(item => this.checkedId[item.id]);
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
    this.selRoleData = data;
    this.validateForm.controls['id'].setValue(data.id);
    this.validateForm.controls['name'].setValue(data.name);
    this.validateForm.controls['deptId'].setValue(data.deptId);
    this.validateForm.controls['remark'].setValue(data.remark);
    this.detailModal.show = true;
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
    let observer: any = null;
    if (this.isAdd) {
      observer = this.scepterService.addRole(this.validateForm.value);
    } else {
      observer = this.scepterService.editRoles(this.validateForm.value);
    }
    observer.subscribe((resData: RoleManageServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.detailModal.loading = false;
        this.showMessageService.showAlertMessage('', resData.message, 'warning');
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
      this.showMessageService.showToastMessage('操作成功', 'success');
    }, (error: any) => {
      this.detailModal.loading = false;
      this.showMessageService.showAlertMessage('', error.message, 'error');
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
    const hasChecked = this.rolesList.some(item => this.checkedId[item.id]);
    if (!hasChecked) {
      this.showMessageService.showToastMessage('您还没有选择要删除的信息', 'warning');
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
        this.scepterService.deleteRoles(ids).subscribe((resData: RoleManageServiceNs.UfastHttpAnyResModel) => {
          if (resData.code !== 0) {
            this.tableConfig.loading = false;
            this.showMessageService.showAlertMessage('', resData.message, 'warning');
            return;
          }
          this.showMessageService.showToastMessage('操作成功', 'success');
          this.tableConfig.loading = false;
          this.checkedId = {};
          this.isAllChecked = false;
          this.searchData();
        }, (error: any) => {
          this.tableConfig.loading = false;
          this.showMessageService.showAlertMessage('', error.message, 'error');
        });
      }
    });
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  /**
   * 取消页面切换
   */
  public cancelTabPage() {
    this.tabIndex = 0;
    this.authTree = [{
      auths: [],
      name: '',
      url: '',
      children: []
    }];
    this.authCodeObj = {};
    this.menuCodeObj = {};
    this.menuIndeterminateObj = {};
    this.privilegeRole = null;
  }

  /**
   * 设置权限
   */
  public setAuthInit(role: any) {
    this.tabIndex = 1;
    this.privilegeRole = role;
    this.isSpinning = true;
    forkJoin([this.scepterService.getMenuRoleShownDetail(), this.scepterService.getMenusAuths(role.id)])
      .subscribe((resData: ScepterServiceNs.ScepterResModelT<any>[]) => {
        if (resData[0].code !== 0 || resData[1].code !== 0) {
          const message = resData[0].code !== 0 ? resData[0].message : resData[1].message;
          this.showMessageService.showAlertMessage('', message, 'warning');
          return;
        }
       //  const index = resData[0].value.findIndex(menu => menu.url === '/vehicleMonitor');
        // if (index !== -1) { // 删除首页看板
        //   const i = resData[0].value[index].children.findIndex(list => list.url === '/locDistribute');
        //   // this.menuCodeObj[resData[0].value[index].id] = true;
        //   resData[0].value[index].children.splice(i, 1);
        // }
        this.authTree = resData[0].value;
        for (let i = 0, lenI = resData[1].value.menus.length; i < lenI; i++) {
          this.menuCodeObj[resData[1].value.menus[i]] = true;
        }

        for (let i = 0, lenI = resData[1].value.auths.length; i < lenI; i++) {
          this.authCodeObj[resData[1].value.auths[i]] = true;
        }

        for (let i = 0, len = resData[0].value.length; i < len; i++) {
          this.initAuthCheckAll(resData[0].value[i]);
        }
        this.isSpinning = false;
      }, (error) => {
        this.isSpinning = false;
        this.showMessageService.showAlertMessage('', error.message, 'error');
      });
  }

  /**
   * 初始化复选框是否全选标识
   */
  private initAuthCheckAll(nodeTree: ScepterServiceNs.MenuShownItemModel) {
    if (!nodeTree.children || nodeTree.children.length === 0) {
      return;
    }
    let prev: boolean = this.menuCodeObj[nodeTree.children[0].id] || false;

    for (let index = 0, len = nodeTree.children.length; index < len; index++) {
      this.initAuthCheckAll(nodeTree.children[index]);
      this.menuCodeObj[nodeTree.children[index].id] = this.menuCodeObj[nodeTree.children[index].id] || false;
      if (prev !== this.menuCodeObj[nodeTree.children[index].id]) {
        this.menuIndeterminateObj[nodeTree.id] = true;
        break;
      }
      prev = this.menuCodeObj[nodeTree.children[index].id];
    }
  }

  /**
   * 保存设置的权限
   */
  public setAuthSubmit() {
    const reqData = {
      authIds: [],
      menuIds: [],
      roleId: this.privilegeRole.id,
    };
    for (const keyMenu in this.menuCodeObj) {
      if (this.menuCodeObj[keyMenu]) {
        reqData.menuIds.push(parseInt(keyMenu, 10));
      }
    }
    for (const keyAuth in this.authCodeObj) {
      if (this.authCodeObj[keyAuth]) {
        reqData.authIds.push(parseInt(keyAuth, 10));
      }
    }
    this.scepterService.addMenusAuths(reqData)
      .subscribe((resData: ScepterServiceNs.ScepterResModelT<any>) => {
        if (resData.code !== 0) {
          this.showMessageService.showAlertMessage('', resData.message, 'warning');
          return;
        }
        this.showMessageService.showToastMessage('设置成功', 'success');
        this.saveRights();
        this.cancelTabPage();
      }, (error) => {
        this.showMessageService.showAlertMessage('', error.message, 'error');
      });
  }
  // 本地保存权限
  private saveRights() {
    this.scepterService.getAuthCodes().subscribe((data: ScepterServiceNs.ScepterResModelT<ScepterServiceNs.AuthCodeObj>) => {
      if (data.code !== 0) {
        this.showMessageService.showAlertMessage('', data.message, 'error');
        return;
      }
      this.storage.setObject('rights', data.value);
    }, (error) => {
      this.showMessageService.showAlertMessage('', error.message, 'error');
    });
  }

  /**
   * menuNodes:目标节点到最外层父节点
   */
  public checkAllMenuState(value: boolean, menuNodes: ScepterServiceNs.MenuShownItemModel[]) {
    const length: number = menuNodes.length;
    this.menuIndeterminateObj[menuNodes[0].id] = false;
    this.checkChildMenu(menuNodes[0], value);
    for (let index = 1; index < length; index++) {
      this.checkSiblingMenu(menuNodes[index]);
    }
  }

  public checkAllAuthState(value: boolean, menuNodes: ScepterServiceNs.MenuShownItemModel[]) {
    this.updateSingleChecked(menuNodes[0], value);
    for (let index = 1, len = menuNodes.length; index < len; index++) {
      this.updateTreeNodeChecked(menuNodes[index]);
    }
  }

  private updateSingleChecked(parentNode: ScepterServiceNs.MenuShownItemModel, childAuthState): void {
    if (parentNode.auths.every(item => !this.authCodeObj[item.authId])) {
      this.menuCodeObj[parentNode.id] = false;
      this.menuIndeterminateObj[parentNode.id] = false;
    } else if (parentNode.auths.every(item => this.authCodeObj[item.authId])) {
      this.menuCodeObj[parentNode.id] = true;
      this.menuIndeterminateObj[parentNode.id] = false;
    } else {
      this.menuCodeObj[parentNode.id] = true;
      this.menuIndeterminateObj[parentNode.id] = true;
    }
  }

  private updateTreeNodeChecked(parentNode: ScepterServiceNs.MenuShownItemModel) {
    if (parentNode.children.every(item => !this.menuIndeterminateObj[item.id])) {
      this.menuIndeterminateObj[parentNode.id] = false;
    } else {
      this.menuIndeterminateObj[parentNode.id] = true;
    }
    if (parentNode.children.every(item => !this.menuCodeObj[item.id])) {
      this.menuCodeObj[parentNode.id] = false;
    } else {
      this.menuCodeObj[parentNode.id] = true;
    }
  }
  /**遍历兄弟节点**/
  private checkSiblingMenu(parentNode: ScepterServiceNs.MenuShownItemModel) {
    let prev: boolean = this.menuCodeObj[parentNode.children[0].id] || false,
      indeterminate = false,
      index = 0;
    const len = parentNode.children.length;
    this.menuCodeObj[parentNode.id] = false;

    for (; index < len; index++) {
      this.menuCodeObj[parentNode.children[index].id] = this.menuCodeObj[parentNode.children[index].id] || false;
      if (!indeterminate && prev !== this.menuCodeObj[parentNode.children[index].id]) {
        this.menuIndeterminateObj[parentNode.id] = true;
        this.menuCodeObj[parentNode.id] = true;
        indeterminate = true;
        break;
      }
      prev = this.menuCodeObj[parentNode.children[index].id];
    }

    if (index === len) {
      if (this.menuCodeObj[parentNode.children[0].id]) {
        this.menuCodeObj[parentNode.id] = true;
      } else {
        this.menuCodeObj[parentNode.id] = false;
      }
      this.menuIndeterminateObj[parentNode.id] = false;
    }

  }

  /**遍历子节点**/
  private checkChildMenu(node: ScepterServiceNs.MenuShownItemModel, value) {
    if (!node.children || node.children.length === 0) {
      this.setLeafNodeStatus(node, value);
      this.menuCodeObj[node.id] = value;
      this.menuIndeterminateObj[node.id] = false;
      return;
    }
    for (let index = 0, len = node.children.length; index < len; index++) {
      this.menuCodeObj[node.children[index].id] = value;
      this.checkChildMenu(node.children[index], value);
    }
  }

  private setLeafNodeStatus(node: ScepterServiceNs.MenuShownItemModel, value) {
    if (!node.auths) {
      return;
    }
    node.auths.forEach(authItem => {
      this.authCodeObj[authItem.authId] = value;
    });
  }

}
