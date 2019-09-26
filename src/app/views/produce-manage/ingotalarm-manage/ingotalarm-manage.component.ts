import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ingotalarm-manage',
  templateUrl: './ingotalarm-manage.component.html',
  styleUrls: ['./ingotalarm-manage.component.scss']
})
export class IngotalarmManageComponent implements OnInit {

  isCollapse = false;
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
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      batchNum: '', // 锭数
      standard: '', // 线别
      lineType: '', // 纺位
      spinPos: '', // 纺位
      ingotPos: '', // 纺位
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
      alarmId: [null],
      ingotNum: [null, [Validators.required]],
      lineType: [null, [Validators.required]],
      spinPos: [null, [Validators.required]]
    });
  }

  initList() {
    // 初始化丝车列表
    // clear filters
    const cond = {};
    if (this.filters.batchNum !== '') {
      // @ts-ignore
      cond.batchNum = this.filters.batchNum;
    }
    if (this.filters.ingotPos !== '') {
      // @ts-ignore
      cond.ingotPos = this.filters.ingotPos;
    }
    if (this.filters.lineType !== '') {
      // @ts-ignore
      cond.lineType = this.filters.lineType;
    }
    if (this.filters.spinPos !== '') {
      // @ts-ignore
      cond.spinPos = this.filters.spinPos;
    }
    if (this.filters.standard !== '') {
      // @ts-ignore
      cond.standard = this.filters.standard;
    }
    const filter = {
      'filters': cond,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.pageIngotAlarms(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.ingotAlarmService.pageIngotAlarms({'pageNum': 1, 'pageSize': 10000}).subscribe((result) => {
        this.tableConfig.pageTotal = result.value.list.length;
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

  deal() {
    // TODO
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.alarmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要处理的信息', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要标记选中的告警为已处理吗？`,
      nzOnOk: () => {
        const ids = [];
        this.tableConfig.loading = true;

        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            // ids.push(key);

            this.ingotAlarmService.updateIngotAlarm({
              'alarmId': key,
              'isHandled': 1
            }).subscribe((res) => {

            });
          }
        }
        this.messageService.showToastMessage('处理告警成功', 'success');
        this.initList();
      }
    });

  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.alarmId !== '-1') {
        this.checkedId[item.alarmId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.alarmId !== '-1').every(item => this.checkedId[item.alarmId]);
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
    } else {
    }

  }

  resetCond() {
    this.filters = {
      batchNum: '', // 锭数
      standard: '', // 线别
      lineType: '', // 纺位
      spinPos: '', // 纺位
      ingotPos: '', // 纺位
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.pageIngotAlarms({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        console.log(wagon);
        const item: any = [];
        item.告警ID = wagon.alarmId;
        item.告警等级 = wagon.alarmLevel;
        item.告警日期 = wagon.alarmTime;
        item.告警次数 = wagon.alarmTimes;
        item.告警类型 = wagon.alarmType;
        item.批号 = wagon.batchNum;
        item.锭位 = wagon.ingotPos;
        item.是否已经处理 = wagon.isHandled;
        item.线别 = wagon.lineType;
        item.生产日期 = wagon.produceTime;
        item.纺位 = wagon.spinPos;
        item.规格 = wagon.standard;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }


  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '锭位质量告警列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

}
