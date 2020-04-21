import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {LineSpinService} from '../../../core/biz-services/lineSpinService/LineSpinService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-batch-manage',
  templateUrl: './batch-manage.component.html',
  styleUrls: ['./batch-manage.component.scss']
})
export class BatchManageComponent implements OnInit {

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

  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private lineSpinService: LineSpinService) {
    this.filters = {
      batchNum: '', // 批次
      standard: '', // 规格
      threshold: '' // 批次质量报警阈值
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
      bsId: [null],
      batchNum: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      threshold: [null, [Validators.required]]
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
    this.lineSpinService.pageBatch(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.tableConfig.pageNum = res.value.pageNum;
      this.tableConfig.pageTotal = res.value.total;
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
    this.detailModal.title = `新增批次规格信息`;
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
    this.detailModal.title = `修改批次规格信息`;
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
    this.validateForm.controls['bsId'].setValue(data.bsId);
    this.validateForm.controls['batchNum'].setValue(data.batchNum);
    this.validateForm.controls['standard'].setValue(data.standard);
    this.validateForm.controls['threshold'].setValue(data.threshold);
    this.detailModal.show = true;
  }

  delete() {
    // TODO
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.bsId]);
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
        this.lineSpinService.removeBatch(ids).subscribe((resData) => {
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
      if (item.bsId !== '-1') {
        this.checkedId[item.bsId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.bsId !== '-1').every(item => this.checkedId[item.bsId]);
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
    if (this.isAdd) {
      this.lineSpinService.addBatch(this.validateForm.value).subscribe((res) => {
        this.detailModal.show = false;
        this.detailModal.loading = false;
        this.initList();
        this.messageService.showToastMessage('新增成功', 'success');
      });
    } else {
      this.lineSpinService.updateBatch(this.validateForm.value).subscribe((res) => {
        this.detailModal.show = false;
        this.detailModal.loading = false;
        this.initList();
        this.messageService.showToastMessage('修改成功', 'success');

      });
    }

  }

  resetCond() {
    this.filters = {
      batchNum: '', // 批次
      standard: '', // 规格
      threshold: '' // 批次质量报警阈值
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    const filter = {
      'filters': {},
      'pageNum': 1,
      'pageSize': 10000
    };

    this.lineSpinService.pageBatch(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const batch of res.value.list) {
        console.log(batch);
        let item: any = [];
        item.记录id = batch.bsId;
        item.批次 = batch.batchNum;
        item.规格 = batch.standard;
        item.报警阀值 = batch.threshold;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '线别纺位列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }


}
