import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {format} from "date-fns";


@Component({
  selector: 'app-output-statistic',
  templateUrl: './output-statistic.component.html',
  styleUrls: ['./output-statistic.component.scss']
})
export class OutputStatisticComponent implements OnInit {


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
  dateRange = [];

  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      produceTime: '', // 锭数
      classType: '', // 线别
      operator: '', // 纺位
      craftState: '', // 纺位
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
    if (this.dateRange !== [] && this.dateRange !== null && this.dateRange !== undefined && this.dateRange.length > 1) {
      this.filters.startTime = format(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss');
      this.filters.endTime = format(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.pageStatOutput(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.ingotAlarmService.pageStatOutput({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
        this.tableConfig.pageTotal = res.value.list.length;
      });
      this.tableConfig.loading = false;
    });
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
      classType: '', // 线别
      operator: '', // 纺位
      craftState: '', // 纺位
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.pageStatOutput({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      let arr = [];
      for (let wagon of res.value.list) {
        console.log(wagon);
        let item: any = [];
        item.记录ID = wagon.osId;
        item.批号 = wagon.batchNum;
        item.班别 = wagon.classType;
        item.工艺状态 = this.trans(wagon.craftState);
        item.锭数 = wagon.ingotNum;
        item.工号 = wagon.operator;
        item.产量 = wagon.output;
        item.日期 = wagon.produceTime;
        item.规格 = wagon.standard;
        item.车辆数 = wagon.wagonNum;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }


  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '产量统计列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }
}
