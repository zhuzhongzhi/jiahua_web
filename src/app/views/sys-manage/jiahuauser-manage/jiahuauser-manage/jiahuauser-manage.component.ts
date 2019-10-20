import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../../widget/show-message/show-message';
import {UserManageService} from '../../../../core/biz-services/sysManage/user-manage.service';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {LatheManageService} from '../../../../core/biz-services/latheManage/lathe-manage.service';

@Component({
  selector: 'app-jiahuauser-manage',
  templateUrl: './jiahuauser-manage.component.html',
  styleUrls: ['./jiahuauser-manage.component.scss']
})
export class JiahuauserManageComponent implements OnInit {


  isCollapse = false;
  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  // 表格类
  isAllChecked = false;
  checkedId: { [key: string]: boolean } = {};

  // 权限表table
  authTableConfig: any;
  listOfAllAuths = [];
  // 弹框内权限选择
  authModalAllChecked = false;
  authModalCheckId: { [key: string]: boolean } = {};

  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  // 权限配置弹框
  authModal2 = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  realRrights = [];

  // 弹窗表单
  validateForm: FormGroup;
  updateData: any;
  // 是否新增
  isAdd = false;
  radioValue = 0;

  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private latheManageService: LatheManageService,
              private userService: UserManageService) {
    this.filters = {
      userName: '', // 用户
      post: '', // 岗位
    };
    this.tableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      loading: false
    };

    this.authTableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 1000,
      pageNum: 1,
      total: 10,
      loading: false
    };

  }

  ngOnInit() {
    this.initList();
    this.validateForm = this.fb.group({
      juId: [null],
      userId: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      institution: [null, []],
      post: [null, []],
      status: [null, [Validators.required]]
    });
  }

  trans(status) {
    if (status === 0) {
      return '在用';
    } else {
      return '禁用';
    }
  }

  initList() {
    // 初始化丝车列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.userService.pageUser(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      filter.pageNum = 0;
      filter.pageSize = 100000;
      this.userService.pageUser(filter).subscribe((result) => {
        this.tableConfig.pageTotal = result.value.total;
      });
      this.tableConfig.loading = false;
    });
  }

  pageChange() {
    this.checkedId = {};
    this.isAllChecked = false;
    this.initList();
  }

  pageChange2() {
    this.authModalCheckId = {};
    this.authModalAllChecked = false;
    const filter = {
      'filters': {},
      'pageNum': this.authTableConfig.pageNum,
      'pageSize': this.authTableConfig.pageSize
    };
    this.authTableConfig.loading = true;
    this.latheManageService.getAuthList(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllAuths = res.value.list;
      this.authTableConfig.pageTotal = res.value.total;
      this.authTableConfig.loading = false;
    });
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
    this.authModalCheckId = {};
    this.authModalAllChecked = false;
  }

  saveAuths() {
    this.authModal2.show = false;

    for (const item of this.realRrights) {
      item.status = this.authModalCheckId[item.authId] ? 1 : 0;
      this.latheManageService.modifyUserAuth(item).subscribe((res) => {

      });
    }
    // 重新查询rights
    this.messageService.showToastMessage('权限配置保存成功', 'success');
    console.log(this.authModalCheckId);

  }

  handleAuthModalCancel() {
    this.authModal2.show = false;
    this.authModalCheckId = {};
    this.authModalAllChecked = false;
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  add() {
    this.isAdd = true;
    this.detailModal.title = `新增用户信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    this.validateForm.reset();
    this.detailModal.show = true;
  }

  /**
   * 配置权限
   */
  editAuths(data) {
    this.authModal2.title = `用户权限配置`;
    this.authModal2.showContinue = true;
    this.authModal2.showSaveBtn = true;
    // 查询列表 checkbox
    this.authModal2.show = true;
    // 查询权限列表

    const filter = {
      'filters': {},
      'pageNum': this.authTableConfig.pageNum,
      'pageSize': this.authTableConfig.pageSize
    };
    this.authTableConfig.loading = true;
    this.latheManageService.getAuthList(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllAuths = res.value.list;
      this.authTableConfig.pageTotal = res.value.total;
      this.authTableConfig.loading = false;
    });
    const requestParam = {
      filters: {
        userId: data.userId
      },
      pageNum: 0,
      pageSize: 1000,
    };
    this.latheManageService.getUserAuthList(requestParam).subscribe((res) => {
      this.realRrights = res.value.list;
      for (const item of res.value.list) {
        if (item.status === 1) {
          this.authModalCheckId[item.authId] = true;
        }
      }

    });
  }

  editInfo(data) {
    this.isAdd = false;
    this.detailModal.title = `修改用户信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    this.updateData = data;

    this.validateForm.controls['juId'].setValue(data.juId);
    this.validateForm.controls['userId'].setValue(data.userId);
    this.validateForm.controls['userName'].setValue(data.userName);
    this.validateForm.controls['password'].setValue(data.password);
    this.validateForm.controls['post'].setValue(data.post);
    this.validateForm.controls['status'].setValue(data.status);
    this.validateForm.controls['institution'].setValue(data.institution);
    this.detailModal.show = true;
  }

  update() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.juId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要修改的用户', 'warning');
      return;
    }
    let data;
    let i = 0;
    for (const key in this.checkedId) {
      if (this.checkedId[key]) {
        console.log(key);
        this.listOfAllData.forEach(item => {
          console.log(item.juId);
          if (item.juId == key) {
            data = item;
          }
        });
        i++;
      }
    }
    console.log(data);
    if (i > 1) {
      this.messageService.showToastMessage('一次仅能修改一个用户', 'warning');
      return;
    }

    this.isAdd = false;
    this.detailModal.title = `修改用户信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    this.updateData = data;

    this.validateForm.controls['juId'].setValue(data.juId);
    this.validateForm.controls['userName'].setValue(data.userName);
    this.validateForm.controls['password'].setValue(data.password);
    this.validateForm.controls['post'].setValue(data.post);
    this.validateForm.controls['status'].setValue(data.status);
    this.validateForm.controls['institution'].setValue(data.institution);
    this.detailModal.show = true;

  }

  open() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.juId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要启用的账户', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要启用选中的账户吗？`,
      nzOnOk: () => {
        this.tableConfig.loading = true;

        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            this.userService.updateJiahuaUser({'juId': key, 'status': '0'}).subscribe(res => {
              this.messageService.showToastMessage('启用成功', 'success');
              this.tableConfig.loading = false;
              this.checkedId = {};
              this.isAllChecked = false;
              this.initList();
            });
          }
        }
      }
    });

  }

  stop() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.juId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要禁用的账户', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要禁用选择的账户吗？`,
      nzOnOk: () => {
        this.tableConfig.loading = true;

        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            this.userService.updateJiahuaUser({'juId': key, 'status': '1'}).subscribe(res => {
              this.messageService.showToastMessage('禁用成功', 'success');
              this.tableConfig.loading = false;
              this.checkedId = {};
              this.isAllChecked = false;
              this.initList();
            });
          }
        }
      }
    });

  }


  delete() {
    // TODO
    this.messageService.showToastMessage('暂不支持删除', 'warning');
    return;

    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.juId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要删除的信息', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要删除选中的信息吗？`,
      nzOnOk: () => {
        const ids = [];
        this.tableConfig.loading = true;

        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            ids.push(key);
          }
        }
      }
    });

  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.juId !== '-1') {
        this.checkedId[item.juId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.juId !== '-1').every(item => this.checkedId[item.juId]);
  }

  checkAllAuth(value: boolean): void {
    this.listOfAllAuths.forEach(item => {
      if (item.authId !== '-1') {
        this.authModalCheckId[item.authId] = value;
      }
    });
  }


  refreshStatus2(): void {
    this.authModalAllChecked = this.listOfAllAuths.filter(item => item.authId !== '-1').every(item => this.authModalCheckId[item.authId]);
  }


  submitForm() {
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsDirty();
        controls[key].updateValueAndValidity();
      }
    }
    // if (this.validateForm.invalid) {
    //   return;
    console.log(this.radioValue);
    // }
    this.detailModal.loading = true;
    if (this.isAdd) {
      const data = this.validateForm.value;
      data.status = this.radioValue;
      this.userService.addJiahuaUser(data).subscribe((res) => {
        this.detailModal.show = false;
        this.detailModal.loading = false;
        // 插入的auth中
        console.log(this.authModalCheckId);
        for (let authModalCheckIdKey in this.authModalCheckId) {
          console.log(authModalCheckIdKey);
          const dataJson = {
            authId: '',
            post: '',
            status: '0',
            userId: ''
          };
          dataJson.authId = authModalCheckIdKey;
          dataJson.post = data.post;
          dataJson.userId = data.userId;

          this.latheManageService.addUserAuth(dataJson);
        }
        this.initList();
        this.messageService.showToastMessage('新增成功', 'success');
      });
    } else {
      const data = this.validateForm.value;
      data.status = this.radioValue;
      this.userService.updateJiahuaUser(data).subscribe((res) => {
        this.detailModal.show = false;
        this.detailModal.loading = false;
        this.initList();
        this.messageService.showToastMessage('修改成功', 'success');

      });
    }

    this.authModalCheckId = {};

  }


  resetCond() {
    this.filters = {
      userName: '', // 用户
      post: '', // 岗位
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    const filter = {
      filters: {},
      pageNum: 0,
      pageSize: 1000000
    };
    this.userService.pageUser(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value) {
        const item: any = [];
        item.用户ID = wagon.juId;
        item.用户名 = wagon.userName;
        item.单位 = wagon.institution;
        item.岗位 = wagon.post;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '用户列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }


}
