import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {format} from "date-fns";

@Component({
  selector: 'app-daliyquality-statistic',
  templateUrl: './daliyquality-statistic.component.html',
  styleUrls: ['./daliyquality-statistic.component.scss']
})
export class DaliyqualityStatisticComponent implements OnInit {

  isCollapse = false;
  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  listModelOfAllData = [];
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
  type = 1;
  dateRange = [];
  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      produceTime: '', // 锭数
      standard: '', // 线别
      batchNum: '', // 纺位
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
    this.messageService.closeLoading();

  }

  initList() {
    // 初始化丝车列表
    // clear filters
    if (this.dateRange !== [] && this.dateRange !== null && this.dateRange !== undefined && this.dateRange.length > 1) {
      this.filters.startTime = format(this.dateRange[0], 'yyyy-MM-dd HH:mm');
      this.filters.endTime = format(this.dateRange[1], 'yyyy-MM-dd HH:mm');
    }
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.pageStatDailyOutput(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.ingotAlarmService.pageStatDailyOutput({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
        this.tableConfig.pageTotal = res.value.list.length;
      });
      this.tableConfig.loading = false;
    });
  }

  pageChange() {
    this.checkedId = {};
    this.isAllChecked = false;
    this.initList();
  }

  see(type, data) {
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.type = type;
    switch (type) {
      case 1:
        this.detailModal.title = `等级重量及比例`;
        this.ingotAlarmService.getLevelList({'qrId': data.qrId, 'qType': 1}).subscribe(res => {
          this.listModelOfAllData = res.value;
        });
        break;
      case 2:
        this.detailModal.title = `不良要因重量及比例`;
        this.ingotAlarmService.getBadCauseList({'qrId': data.qrId, 'qType': 1}).subscribe(res => {
          this.listModelOfAllData = res.value;
        });
        break;
      case 3:
        this.detailModal.title = `重量不足的小卷重量及比例`;
        this.ingotAlarmService.getNotEnoughList({'qrId': data.qrId, 'qType': 1}).subscribe(res => {
          this.listModelOfAllData = res.value;
        });
        break;
    }

    this.detailModal.show = true;
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
    this.initList();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
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
      produceTime: '', // 锭数
      standard: '', // 线别
      batchNum: '', // 纺位
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.pageStatDailyOutput({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        const item: any = [];
        item.质量报告ID = wagon.qrId;
        item.线别 = wagon.lineType;
        item.生产日期 = wagon.produceTime;
        item.批号 = wagon.batchNum;
        item.规格 = wagon.standard;
        item.检验重量 = wagon.weight;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }


  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '每日质量报告列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }
}
