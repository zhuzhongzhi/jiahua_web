import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {format} from "date-fns";


@Component({
  selector: 'app-yearquality-statistic',
  templateUrl: './yearquality-statistic.component.html',
  styleUrls: ['./yearquality-statistic.component.scss']
})
export class YearqualityStatisticComponent implements OnInit {

  isCollapse = true;
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
  nzwidth ='60%';
  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      qrMonth: '', // 锭数
      batchNum: '', // 纺位
      standard: '', // 线别
      lineType: '', // 纺位
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
    this.ingotAlarmService.pageYearOutput(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.tableConfig.pageTotal = res.value.total;     
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
        this.nzwidth = "40%";
        this.ingotAlarmService.getLevelList({'qrId': data.qrId, 'qType': 3}).subscribe(res => {
          this.listModelOfAllData = res.value;
        });
        break;
      case 2:
        this.detailModal.title = `不良要因重量及比例`;
        this.nzwidth = "80%";
        this.ingotAlarmService.getBadCauseList({'qrId': data.qrId, 'qType': 3}).subscribe(res => {
          this.listModelOfAllData = res.value;
        });
        break;
      case 3:
        this.detailModal.title = `重量不足的小卷重量及比例`;
        this.nzwidth = "20%";
        this.ingotAlarmService.getNotEnoughList({'qrId': data.qrId, 'qType': 3}).subscribe(res => {
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
      monthTime: '', // 锭数
      standard: '', // 线别
      batchNum: '', // 纺位
      lineType: '', // 纺位
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.pageYearOutput({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        const item: any = [];
        item.质量报告ID = wagon.qrId;
        item.年份 = wagon.qrYear;
        item.月份 = wagon.qrMonth;
        item.批号 = wagon.batchNum;
        item.线别 = wagon.lineType;              
        item.规格 = wagon.standard;
        item.检验重量 = wagon.weight;
        this.ingotAlarmService.getLevelList({ 'qrId': wagon.qrId, 'qType': 3}).subscribe(res => {         
          item.AA级重量 = res.value.weightAA;
          item.AA级比例 = res.value.ratioAA * 100;
          item.AA纬重量 = res.value.weightAAW;
          item.AA纬比例 = res.value.ratioAAW * 100;
          item.A级重量 = res.value.weightA;
          item.A级比例 = res.value.ratioA * 100;
          item.A1级重量 = res.value.weightA1;
          item.A1级比例 = res.value.ratioA1 * 100;
          item.B级重量 = res.value.weightB;
          item.B级比例 = res.value.ratioB * 100;
        });
        this.ingotAlarmService.getBadCauseList({ 'qrId': wagon.qrId, 'qType': 3 }).subscribe(res => {
          item.毛丝重量 = res.value.weightLousiness;
          item.毛丝比例 = res.value.ratioLousiness * 100;
          item.染色重量 = res.value.weightDye ;
          item.染色比例 = res.value.ratioDye * 100;
          item.碰伤重量 = res.value.weightBruise;
          item.碰伤比例 = res.value.ratioBruise * 100;
          item.成型不良重量 = res.value.weightBadShape;
          item.成型不良比例 = res.value.ratioBadShape * 100;
          item.污丝重量 = res.value.weightSoiled;
          item.污丝比例 = res.value.ratioSoiled * 100;
          item.飘丝重量 = res.value.weightFloat;
          item.飘丝比例 = res.value.ratioFloat * 100;
          item.黄化重量 = res.value.weightYellow;
          item.黄化比例 = res.value.ratioYellow * 100;
          item.绕外重量 = res.value.weightOutside;
          item.绕外比例 = res.value.ratioOutside * 100;
          item.夹丝重量 = res.value.weightCrimp;
          item.夹丝比例 = res.value.ratioCrimp * 100;
          item.绕丝重量 = res.value.weightAA;
          item.绕丝比例 = res.value.ratioAA * 100;
          item.物性重量 = res.value.weightProperty;
          item.物性比例 = res.value.ratioProperty * 100;
          item.OPU重量 = res.value.weightOPU;
          item.OPU比例 = res.value.ratioOPU * 100;
          item.其他重量 = res.value.weightOther;
          item.其他比例 = res.value.ratioOther * 100;
        });     
        this.ingotAlarmService.getNotEnoughList({ 'qrId': wagon.qrId, 'qType': 3 }).subscribe(res => {
          item.小卷重量 = res.value.weight;
          item.小卷比例 = res.value.ratio * 100;
        });
        arr.push(item);
      }
      this.exportList(arr);
    });
  }


  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '年度质量报告列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

}
