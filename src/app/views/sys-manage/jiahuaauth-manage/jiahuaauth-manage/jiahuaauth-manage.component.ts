import {Component, OnInit} from '@angular/core';
import {LatheManageService} from '../../../../core/biz-services/latheManage/lathe-manage.service';
import {ShowMessageService} from '../../../../widget/show-message/show-message';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-jiahuaauth-manage',
  templateUrl: './jiahuaauth-manage.component.html',
  styleUrls: ['./jiahuaauth-manage.component.scss']
})
export class JiahuaauthManageComponent implements OnInit {

  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  // 弹窗表单
  validateForm: FormGroup;
  updateData: any;
  // 是否新增
  isAdd = false;
  isAuth = true;

  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private sanitizer: DomSanitizer,
              private messageService: ShowMessageService,
              private latheManageService: LatheManageService) {
    this.tableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      loading: false
    };
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  ngOnInit() {
    this.initList();
    this.validateForm = this.fb.group({
      authId: [null, [Validators.required]],
      authName: [null, [Validators.required]],
      desc: [null, []],
      jaId: [null, []]
    });
    this.messageService.closeLoading();

  }

  initList() {
    // 获取权限列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    if (this.isAuth) {
      this.latheManageService.getAuthList(filter).subscribe((res) => {
        if (res.code !== 0) {
          return;
        }
        this.listOfAllData = res.value.list;
        this.tableConfig.pageTotal = res.value.total;
        this.tableConfig.loading = false;
      });
    } else {
      this.latheManageService.getUserAuthList(filter).subscribe((res) => {
        if (res.code !== 0) {
          return;
        }
        this.listOfAllData = res.value.list;
        this.tableConfig.pageTotal = res.value.total;
        this.tableConfig.loading = false;
      });
    }
  }

  pageChange() {
    this.initList();
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
  }


  changeTab(args: any[]) {
    if (args[0].index === 0) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
    this.initList();
  }

  addInfo() {
    this.isAdd = true;
    this.isAuth = true;
    this.detailModal.title = `新增权限信息`;
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

  editInfo(data) {
    this.isAdd = false;
    this.isAuth = true;
    this.detailModal.title = `修改权限信息`;
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
    this.validateForm.controls['jaId'].setValue(data.jaId);
    this.validateForm.controls['authId'].setValue(data.authId);
    this.validateForm.controls['authName'].setValue(data.authName);
    this.validateForm.controls['desc'].setValue(data.desc);
    this.detailModal.show = true;

  }

  submitForm() {
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
    if (this.isAuth) {
      if (this.isAdd) {
        this.latheManageService.addAuth(this.validateForm.value).subscribe((res) => {
          this.detailModal.show = false;
          this.detailModal.loading = false;
          this.initList();
          this.messageService.showToastMessage('新增权限成功', 'success');
        });
      } else {
        this.latheManageService.modifyAuth(this.validateForm.value).subscribe((res) => {
          this.detailModal.show = false;
          this.detailModal.loading = false;
          this.initList();
          this.messageService.showToastMessage('修改权限成功', 'success');
        });
      }
    } else {
      if (this.isAdd) {

      } else {

      }
    }

  }

}
