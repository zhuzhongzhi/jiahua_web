import {Component, OnInit} from '@angular/core';
import {LatheManageService} from '../../../core/biz-services/latheManage/lathe-manage.service';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-lathe-list',
  templateUrl: './lathe-list.component.html',
  styleUrls: ['./lathe-list.component.scss']
})
export class LatheListComponent implements OnInit {
  isCollapse = false;
  // table控件配置
  tableConfig: any;
  filters: any;
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  src = '';
  listOfAllData = [];

  constructor(private fb: FormBuilder,
              private modal: NzModalService,
              private sanitizer: DomSanitizer,
              private messageService: ShowMessageService,
              private latheManageService: LatheManageService) {
    this.filters = {
      code: '',
      batchNum: '',
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

  ngOnInit() {
    this.filters.craftState='';
    this.initList();
    this.messageService.closeLoading();
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

  showPos(data) {
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.detailModal.title = `纺车位置查看`;
    // @ts-ignore
    // /track/map/map2d/svg/follow/?tag=000034b5
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl('/track/map/map2d/svg/follow/?tag=' + data.tagId);
    this.detailModal.show = true;
  }

  showLocus(data) {
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.detailModal.title = `纺车轨迹回看`;
    // @ts-ignore
    // /map/map2d/svg/sim/?anony=super&map=test_4&tagmac=000034b5&starttime=1568862844240&endtime=1568863845240&isHideBtn=1
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/track/map/map2d/svg/sim/?anony=super&map=test_4&tagmac=' +
      data.tagId + '&starttime=' + (Date.parse(new Date().toString()) - 3600 * 1000 * 12) + '&endtime=' +
      Date.parse(new Date().toString()) + '&isHideBtn=1');
    this.detailModal.show = true;
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
    this.initList();
  }

  export() {
    this.latheManageService.getWagonList({'pageNum': 1, 'pageSize': 10000}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value) {
        console.log(wagon);
        const item: any = [];
        item.丝车id = wagon.swId;
        item.丝车编号 = wagon.code;
        item.工艺状态 = this.trans(wagon.craftState);
        item.批号 = wagon.batchNum;
        item.车间 = wagon.shop;
        item.线别 = wagon.lineType;
        item.规格 = wagon.standard;
        item.更新时间 = wagon.updateTime;
        item.是否有效 = wagon.valid === 1 ? '有效' : '无效';
        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '丝车列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

  initList() {
    // 初始化丝车列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.listOfAllData =null;
    this.tableConfig.loading = true;
    this.latheManageService.getWagonListWithPageCondition(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.latheManageService.getWagonList({'pageNum': 1, 'pageSize': 10000}).subscribe((result) => {
        this.tableConfig.pageTotal = result.value.length;
      });
      this.tableConfig.loading = false;
    });
  }

  resetCond() {
    this.filters = {
      code: '',
      batchNum: '',
      craftState: null
    };
    this.initList();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  // 表格页码、页数改变时
  pageChange(reset: boolean = false): void {
    // if (reset) {
    //   this.tableConfig.pageNum = 1;
    // }
    // this.checkedId = {};
    // this.isAllChecked = false;
    // this.searchData();
    // this.checkedId = {};
    // this.isAllChecked = false;
    this.initList();
  }
}
