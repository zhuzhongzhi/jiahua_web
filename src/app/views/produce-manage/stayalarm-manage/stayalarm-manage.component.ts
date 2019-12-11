import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from "date-fns";

@Component({
  selector: 'app-stayalarm-manage',
  templateUrl: './stayalarm-manage.component.html',
  styleUrls: ['./stayalarm-manage.component.scss']
})
export class StayalarmManageComponent implements OnInit {

  isCollapse = true;
  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  remark: ''; // 备注
  handle: any;
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
      code: '',
      alarmTime: '',
      isHandled: '0', // 是否已经处理
    };
    this.tableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      loading: false
    };
    this.handle = {
      handleTime: "",
      operator: localStorage.getItem('userId'),
      alarmId: 1 ,     
      remark: ''
    }
  }

  trans(state) {
    switch (state) {
      case 0:
        return '空闲';
      case 1:
        return '落丝';
      case 2:
        return '测丹尼';
      case 3:
        return '摇袜';
      case 4:
        return '判色';
      case 5:
        return '检验';
      case 6:
        return '包装';
    }
  }

  transpro(state) {
    switch (state) {
      case 0:
        return '未处理';
      case 1:
        return '已处理';
    }
  }


  ngOnInit() {
    this.initList();
    this.messageService.closeLoading();
  }

  initList() {
    // 初始化丝车列表
    // clear filters
    const cond: any = {};
    if (this.filters.batchNum !== '') {
      cond.batchNum = this.filters.batchNum;
    }
    if (this.filters.standard !== '') {
      cond.standard = this.filters.standard;
    }
    if (this.filters.lineType !== '') {
      cond.lineType = this.filters.lineType;
    }
    if (this.filters.code !== '') {
      cond.code = this.filters.code;
    }
    if (this.filters.alarmTime !== '') {
      cond.alarmTime = this.filters.alarmTime;
    }
    if (this.filters.isHandled !== '') {
      cond.isHandled = this.filters.isHandled;
    }
    const filter = {
      'filters': cond,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.pageResident(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.tableConfig.pageTotal = res.value.total;
      this.checkedId = {};
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

  submit() {
    for (const key in this.checkedId) {
      if (this.checkedId[key]) {
        // ids.push(key);
        this.handle.handleTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.handle.alarmId = Number(key);
        this.handle.remark = this.remark;
        this.ingotAlarmService.dealResident(this.handle).subscribe((res) => {
        });
      }
    }
    this.messageService.showToastMessage('处理告警成功', 'success');
    this.initList();
    this.detailModal.show = false;
  }

  deal() {
    //TODO
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.alarmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要处理的信息', 'warning');
      return;
    }
    this.detailModal.title = `处理备忘`;
    this.detailModal.show = true;  

  }

  checkAll(value: boolean): void {
    debugger;
    this.listOfAllData.forEach(item => {
      if (item.alarmId !== '-1' && item.isHandled !== 1) {
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
      code: '',
      alarmTime: '',
      isHandled: '0', // 是否已经处理
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.pageResident({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
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
        item.丝车编号 = wagon.code;
        item.工艺状态 = wagon.craftState;
        item.落丝时间 = wagon.doffingTime;
        item.异常比例 = wagon.exceptionRatio;
        item.是否已经处理 = wagon.isHandled;
        item.线别 = wagon.lineType;
        item.生产日期 = wagon.produceTime;
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
    this.saveAsExcelFile(excelBuffer, '驻留报警列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }
}
