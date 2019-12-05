import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {format} from "date-fns";

@Component({
  selector: 'app-history-manage',
  templateUrl: './history-manage.component.html',
  styleUrls: ['./history-manage.component.scss']
})
export class HistoryManageComponent implements OnInit {

  isCollapse = false;
  // table控件配置
  tableConfig: any;
  filters: any;
  ranges: any;
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
  exceptions: any[] = [];
  showiFrame = false;
  src: SafeResourceUrl = '';
  submitModel: any = {};
  // 落丝列表
  doffList: any = [];

  historyTotal: any = {};

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private modal: NzModalService,
              private modalService: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      code: '',
      lineType: '',
      batchNum: '',
      standard: '',
      createTime: '',
      classType: '',
      classShift: '',
      packageOperator: '',
      packageTime: '',
      doffingOperator: '',
      doffingStartTime: '',
      testDannyOperator: '',
      testDannyTime: '',
      colourOperator: '',
      colourTime: '',
      checkOperator: '',
      rockOperator: '',
      rockTime: '',
      checkTime: '',
      craftState: '7'
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
      case 7:
        return '完成';
    }
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
    this.showiFrame = false;
    this.doffList =null;
  }

  showPos(data) {
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.showiFrame = true;
    this.detailModal.title = `纺车位置查看`;
    this.ingotAlarmService.getWagonByCode({code: data.code}).subscribe((res) => {
      if (res.code !== 0) {
        this.messageService.showToastMessage('接口请求异常！', 'error');
        return;
      }
      if (res.value === undefined || res.value === '' || res.value === null) {
        this.messageService.showToastMessage('没有检查到丝车信息！', 'error');
        return;
      }
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl('/track/map/map2d/svg/follow/?tag=' + res.value.tagId);
      this.detailModal.show = true;
    });
  }

  ngOnInit() {
    this.initList();
    this.messageService.closeLoading();
  }
  submitForm() {}

  initList() {
    // 初始化丝车列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.newCraftPage(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.tableConfig.pageTotal = res.value.total;
      this.tableConfig.loading = false;
    });
    this.ingotAlarmService.getHistory().subscribe((res) => {
      if(res.code !== 0) {
        return;
      }
      this.historyTotal = res.value;
    })
  }

  showDetail (data) {
    this.submitModel = data;
    this.messageService.showLoading('');
    this.ingotAlarmService.getDoffings({pmId: data.pmId}).subscribe((res) => {
      this.doffList = res.value;
      for (let idx = 0; idx < this.doffList.length; idx ++) {
        const item = this.doffList[idx];
        if (item.doffingTime !== undefined && item.doffingTime !== '' && item.doffingTime !== null) {
          item.doffingTime = new Date(item.doffingTime);
        }
        // 设置 exception
        this.ingotAlarmService.getDoffingExceptions({pdId: item.pdId}).subscribe((res1) => {
          item.showtable = true;
          item.exception = res1.value;
          if (idx === this.doffList.length - 1) {
            this.detailModal.title = `查看详情`;
            this.detailModal.showContinue = true;
            this.detailModal.showSaveBtn = true;
            this.detailModal.show = true;
            this.submitModel = data;
            this.messageService.closeLoading();
          }
        });
      }
    });

  }

  pageChange() {
    this.checkedId = {};
    this.isAllChecked = false;
    this.initList();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.pmId !== '-1') {
        this.checkedId[item.pmId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.pmId !== '-1').every(item => this.checkedId[item.pmId]);
  }

  parseTime(time) {
    if (time) {
      if (time.indexOf('GMT') >= 0) {
        return format(time, 'yyyy-MM-dd HH:mm');
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  resetCond() {
    this.filters = {
      code: '',
      lineType: '',
      batchNum: '',
      standard: '',
      doffingOperator: '',
      testDannyOperator: '',
      testDannyTime: '',
      createTime: '',
      packageOperator: '',
      colourOperator: '',
      colourTime: '',
      rockOperator: '',
      rockTime: '',
      packageTime: '',
      doffingStartTime: '',
      craftState: '7'
    };
    this.initList();
  }

  export() {
    this.ingotAlarmService.newCraftPage({'pageNum': 1, 'pageSize': 10000, 'filters': {craftState: '7'}}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        console.log(wagon);
        const item: any = [];
        item.记录id = wagon.pmId;
        item.批号 = wagon.batchNum;
        item.要因记录 = wagon.cause;
        item.班别 = wagon.classType;
        item.丝车编码 = wagon.code;
        item.工艺状态 = wagon.craftState;
        item.规格 = wagon.standard;
        item.锭数合股次数 = wagon.jointNum;
        item.线别 = wagon.lineType;
        item.净重 = wagon.weight;
        item.检验操作员 = wagon.checkOperator;
        item.检验时间 = wagon.checkTime;
        item.判色操作员 = wagon.colourOperator;
        item.判色时间 = wagon.colourTime;
        item.创建时间 = wagon.createTime;
        item.创建人 = wagon.creator;
        item.落丝结束时间 = wagon.doffingEndTime;
        item.落丝操作员 = wagon.doffingOperator;
        item.落丝开始时间 = wagon.doffingStartTime;
        item.包装操作员 = wagon.packageOperator;
        item.包装时间 = wagon.packageTime;
        item.卷别 = wagon.reelType;
        item.摇袜操作员 = wagon.rockOperator;
        item.摇袜时间 = wagon.rockTime;
        item.测丹尼操作员 = wagon.testDannyOperator;
        item.测丹尼时间 = wagon.testDannyTime;

        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '打包管理');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

}
