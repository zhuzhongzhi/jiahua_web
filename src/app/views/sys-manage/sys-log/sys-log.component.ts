import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {SysLogService} from '../../../core/biz-services/sysManage/SysLogService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sys-log',
  templateUrl: './sys-log.component.html',
  styleUrls: ['./sys-log.component.scss']
})
export class SysLogComponent implements OnInit {


  isCollapse = true;
  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  // 表格类
  isAllChecked = false;
  checkedId: { [key: string]: boolean } = {};
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
  dateMode: any;

  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private sysLogService: SysLogService) {
    this.filters = {
      uri: '', // 锭数
      reqTime: '', // 线别
      userName: '' // 纺位
    };
    this.tableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      loading: false
    };
  }

  ngOnInit() {
    this.initList();
    this.validateForm = this.fb.group({
      logId: [null],
      ingotNum: [null, [Validators.required]],
      lineType: [null, [Validators.required]],
      spinPos: [null, [Validators.required]]
    });
    this.messageService.closeLoading();
  }

  initList() {
    // 初始化丝车列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.sysLogService.pageSysLog(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      filter.pageNum = 0;
      filter.pageSize = 1000000;
      this.sysLogService.pageSysLog(filter).subscribe((result) => {
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

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  add() {
    this.isAdd = true;
    this.detailModal.title = `新增线别纺位信息`;
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

  clear() {
    this.sysLogService.clearSysLog().subscribe((res) => {
      this.messageService.showToastMessage('清空日志成功', 'success');
      this.initList();
    });
  }

  editInfo(data) {
    this.isAdd = false;
    this.detailModal.title = `修改线别纺位信息`;
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
    this.validateForm.controls['logId'].setValue(data.logId);
    this.validateForm.controls['ingotNum'].setValue(data.ingotNum);
    this.validateForm.controls['lineType'].setValue(data.lineType);
    this.validateForm.controls['spinPos'].setValue(data.spinPos);
    this.detailModal.show = true;
  }

  handleDateOpenChange(open: boolean): void {
    if (open) {
      this.dateMode = 'time';
    }
  }

  handleDatePanelChange(mode: string): void {
    console.log('handleDatePanelChange: ', mode);
  }

  delete() {
    // TODO
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.logId]);
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
        //debugger;
        this.sysLogService.removeSysLog(ids).subscribe((resData) => {
          console.log(resData);
          localStorage.setItem('log', JSON.stringify(resData));
          this.messageService.showToastMessage('删除成功', 'success');
          this.tableConfig.loading = false;
          this.checkedId = {};
          this.isAllChecked = false;
          this.initList();
        }, (error: any) => {
          this.tableConfig.loading = false;
          this.messageService.showAlertMessage('', error.message, 'error');
        });
      }
    });

  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.logId !== '-1') {
        this.checkedId[item.logId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.logId !== '-1').every(item => this.checkedId[item.logId]);
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
    // if (this.isAdd) {
    //   this.lineSpinService.addLineSpin(this.validateForm.value).subscribe((res) => {
    //     this.detailModal.show = false;
    //     this.detailModal.loading = false;
    //     this.initList();
    //     this.messageService.showToastMessage('新增成功', 'success');
    //   });
    // } else {
    //   this.lineSpinService.updateLineSpin(this.validateForm.value).subscribe((res) => {
    //     this.detailModal.show = false;
    //     this.detailModal.loading = false;
    //     this.initList();
    //     this.messageService.showToastMessage('修改成功', 'success');
    //
    //   });
    // }

  }

  resetCond() {
    this.filters = {
      uri: '', // 锭数
      reqTime: '', // 线别
      userName: '' // 纺位
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.sysLogService.listSysLog({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      let arr = [];
      for (let wagon of res.value) {
        console.log(wagon);
        let item: any = [];
        item.id = wagon.logId;
        item.线别 = wagon.lineType;
        item.纺位 = wagon.spinPos;
        item.锭数 = wagon.ingotNum;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '日志管理列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }


}
