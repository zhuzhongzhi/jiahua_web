import { Component, OnInit } from '@angular/core';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { IngotAlarmService } from '../../../core/biz-services/produceManage/IngotAlarmService';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from "date-fns";

@Component({
  selector: 'app-alarm-manage',
  templateUrl: './alarm-manage.component.html',
  styleUrls: ['./alarm-manage.component.scss']
})
export class AlarmManageComponent implements OnInit {

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
  cardTime: '';
  alarmType: '';
  constructor(private fb: FormBuilder,
    private modal: NzModalService,
    private messageService: ShowMessageService,
    private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      alarmType: '',
      batchNum: '', // 锭数
      standard: '', // 线别
      lineType: '', // 纺位
      code: '',
      cardTime: ''

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
  }

  initList() {
    // 初始化丝车列表
    // clear filters
    this.filters.cardTime = this.parseTime(this.cardTime);
    if (this.alarmType === '') this.filters.alarmType = null;
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.pageHandleLog(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.tableConfig.pageTotal = res.value.total;
      this.tableConfig.loading = false;
    });
    this.messageService.closeLoading();
  }

  pageChange() {
    this.checkedId = {};
    this.isAllChecked = false;
    this.initList();
  }

  parseTime(time) {
    if (time) {
      if (time instanceof Date) {
        return format(time, 'yyyy-MM-dd HH:mm:ss');
      } else {
        return null;
      }
    } else {
      return null;
    }
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

            this.ingotAlarmService.dealLineAlarms({
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

  resetCond() {
    this.filters = {
      alarmType: '',
      batchNum: '', // 锭数
      standard: '', // 线别
      lineType: '', // 纺位
      code: '',
      cardTime: ''
    };
    this.cardTime = '';
    this.alarmType = '';
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.pageHandleLog({ 'pageNum': 1, 'pageSize': 10000 }).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        console.log(wagon);
        const item: any = [];
        item.告警ID = wagon.alarmId;
        item.告警类型 = wagon.alarmType;
        item.批号 = wagon.batchNum;
        item.建卡时间 = wagon.cardTime;
        item.处理ID = wagon.handleId;
        item.处理时间 = wagon.handleTime;
        item.线别 = wagon.lineType;
        item.处理人 = wagon.operator;
        item.处理备注 = wagon.remark;
        item.规格 = wagon.standard;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }


  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, '报警处理日志列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }
}
