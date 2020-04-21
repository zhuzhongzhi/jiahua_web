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

  isCollapse = true;
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

  checkInfo: any ={};
  historyTotal: any = {};

  createTime: '';
      doffingStartTime: '';
      testDannyTime: '';
      colourTime: '';
      rockTime: '';
      checkTime: '';
      packageStartTime: '';
      packagEndTime: '';

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
      classType: '',
      classShift: '',
      createTime: '',
      doffingStartTime: '',
      testDannyTime: '',
      colourTime: '',
      rockTime: '',
      checkTime: '',
      packageStartTime: '',
      packagEndTime: '',
      empId:'',
      craftState: null
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
  transReelType (val) {
    if (val === 0) {
      return '满卷';
    } else if (val === 1) {
      return '小卷';
    }
    return '';
  }

  transClassShift(classShift) {
    switch (classShift) {
      case 0 :
        return '早';
      case 3:
        return '早+4';
      case 1:
        return '中';
      case 2:
        return '晚';
      case 4:
        return '晚+4';
    }
  }

  export() {
    const filter = {
      'filters': this.filters,
      'pageNum': 1,
      'pageSize': 10000
    };
    this.ingotAlarmService.historyPage(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        const item: any = [];
        item.记录id = wagon.main.pmId;
        item.批号 = wagon.main.batchNum;
        item.要因记录 = wagon.main.cause;
        item.班别 = wagon.main.classType;
        item.班次 = this.transClassShift(wagon.main.classShift);
        item.丝车编码 = wagon.main.code;
        item.工艺状态 = this.trans(wagon.main.craftState);
        item.卷别 = this.transReelType(wagon.main.reelType);
        item.规格 = wagon.main.standard;
        item.锭数合股次数 = wagon.main.jointNum;
        item.线别 = wagon.main.lineType;
        item.净重 = wagon.main.weight;
        item.锭数 = wagon.main.ingotNum;
        item.生产时间 = wagon.main.createTime;
        item.创建人 = wagon.main.creator;
        item.落丝结束时间 = wagon.main.doffingEndTime;
        item.落丝操作员 = wagon.main.doffingOperator;
        item.落丝员工id = wagon.main.doffingEmid;
        item.落丝开始时间 = wagon.main.doffingStartTime;
        item.测丹尼操作员 = wagon.main.testDannyOperator;
        item.测丹尼员工id = wagon.main.testDannyEmid;
        item.测丹尼时间 = wagon.main.testDannyTime;
        item.摇袜操作员 = wagon.main.rockOperator;
        item.摇袜时间 = wagon.main.rockTime;
        item.摇袜员工id = wagon.main.rockEmid;
        item.判色员工id = wagon.main.colourEmid;
        item.判色操作员 = wagon.main.colourOperator;
        item.判色时间 = wagon.main.colourTime;
        item.检验操作员 = wagon.main.checkOperator;
        item.检验员工id = wagon.main.checkEmid;
        item.检验时间 = wagon.main.checkTime;
        item.包装操作员 = wagon.main.packageOperator;
        item.包装员工id = wagon.main.packageEmid;
        item.包装时间 = wagon.main.packageTime;
        item.aa级 = wagon.check.aaWeight;
        item.aa纬 = wagon.check.aawWeight;
        item.a1级 = wagon.check.a1Weight;
        item.a级 = wagon.check.aweight;
        item.b级 = wagon.check.bweight;
        item.检查数量 = wagon.check.checkNum;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }
  initListstat(stat) {
    this.filters.craftState = stat;
    this.initList();
  }
  initList() {
    // 初始化丝车列表
    this.filters.createTime = this.parseTime(this.createTime);
    this.filters.doffingStartTime = this.parseTime(this.doffingStartTime);
    this.filters.testDannyTime = this.parseTime(this.testDannyTime);
    this.filters.colourTime = this.parseTime(this.colourTime);
    this.filters.rockTime = this.parseTime(this.rockTime);
    this.filters.checkTime = this.parseTime(this.checkTime);
    this.filters.packageStartTime = this.parseTime(this.packageStartTime);
    this.filters.packagEndTime = this.parseTime(this.packagEndTime);
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.historyPage(filter).subscribe((res) => {
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

  delete() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.main.pmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('请选择一条主记录', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要删除选中的信息吗？`,
      nzOnOk: () => {
        const ids = [];
        this.tableConfig.loading = true;

        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            // ids.push(key);
            this.ingotAlarmService.newCraftDel({ pmId: key }).subscribe((res) => {
              if (res.code === 0) {
                this.messageService.showToastMessage('记录已删除！', 'info');
                this.messageService.closeLoading();
                this.initList();
              }
              else {
                this.messageService.showToastMessage(res.value, 'error');
                this.messageService.closeLoading();
              }
            });
          }
        }
        // 这边写批量删除的方法
        // this.ingotAlarmService.removeBatch(ids).subscribe((resData) => {
        //   this.messageService.showToastMessage('删除成功', 'success');
        //   this.tableConfig.loading = false;
        //   this.checkedId = {};
        //   this.isAllChecked = false;
        // }, (error: any) => {
        //   this.tableConfig.loading = false;
        //   this.messageService.showAlertMessage('', error.message, 'error');
        // });
      }
    });
  }

  showDetail (data) {
    this.submitModel = data;
    this.messageService.showLoading('');
    this.ingotAlarmService.getCheckInfo(data.pmId).subscribe((res) => {
      this.checkInfo = res.value;
  });
    this.ingotAlarmService.getDoffings({pmId: data.pmId}).subscribe((res) => {
      this.doffList = res.value;
      for (let idx = 0; idx < this.doffList.length; idx ++) {
        const item = this.doffList[idx];
        if (item.doffingTime !== undefined && item.doffingTime !== '' && item.doffingTime !== null) {
          item.doffingTime = new Date(item.doffingTime);
        }
        // 设置 exception
        this.ingotAlarmService.getDoffingExceptions({pdId: item.pdId}).subscribe((res1) => {
          item.showtable = false;
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

  toggleTable(item)
  {
    item.showtable = !item.showtable;
  }
  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.main.pmId !== '-1') {
        this.checkedId[item.main.pmId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.main.pmId !== '-1').every(item => this.checkedId[item.main.pmId]);
  }

  parseTime(time) {
    if (time) {
      if (time instanceof Date) {
        return format(time, 'yyyy-MM-dd HH:mm');
      } else {
        return null;
      }
    } else {
      return null;
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
    this.createTime= '';
    this.doffingStartTime= '';
    this.testDannyTime= '';
    this.colourTime= '';
    this.rockTime='';
    this.checkTime='';
    this.packageStartTime= '';
    this.packagEndTime='';
    this.initList();
  }

  // export() {
  //   this.ingotAlarmService.newCraftPage({'pageNum': 1, 'pageSize': 10000, 'filters': {craftState: '7'}}).subscribe((res) => {
  //     if (res.code !== 0) {
  //       return;
  //     }
  //     const arr = [];
  //     for (const wagon of res.value.list) {
  //       console.log(wagon);
  //       const item: any = [];
  //       item.记录id = wagon.pmId;
  //       item.批号 = wagon.batchNum;
  //       item.要因记录 = wagon.cause;
  //       item.班别 = wagon.classType;
  //       item.丝车编码 = wagon.code;
  //       item.工艺状态 = wagon.craftState;
  //       item.规格 = wagon.standard;
  //       item.锭数合股次数 = wagon.jointNum;
  //       item.线别 = wagon.lineType;
  //       item.净重 = wagon.weight;
  //       item.检验操作员 = wagon.checkOperator;
  //       item.检验时间 = wagon.checkTime;
  //       item.判色操作员 = wagon.colourOperator;
  //       item.判色时间 = wagon.colourTime;
  //       item.生产时间 = wagon.createTime;
  //       item.创建人 = wagon.creator;
  //       item.落丝结束时间 = wagon.doffingEndTime;
  //       item.落丝操作员 = wagon.doffingOperator;
  //       item.落丝开始时间 = wagon.doffingStartTime;
  //       item.包装操作员 = wagon.packageOperator;
  //       item.包装时间 = wagon.packageTime;
  //       item.卷别 = wagon.reelType;
  //       item.摇袜操作员 = wagon.rockOperator;
  //       item.摇袜时间 = wagon.rockTime;
  //       item.测丹尼操作员 = wagon.testDannyOperator;
  //       item.测丹尼时间 = wagon.testDannyTime;
  //
  //       arr.push(item);
  //     }
  //     this.exportList(arr);
  //   });
  // }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '历史数据');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

}
