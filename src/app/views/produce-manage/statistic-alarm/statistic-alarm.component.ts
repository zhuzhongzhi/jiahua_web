import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {NzModalService} from 'ng-zorro-antd';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {format} from "date-fns";


@Component({
  selector: 'app-statistic-alarm',
  templateUrl: './statistic-alarm.component.html',
  styleUrls: ['./statistic-alarm.component.scss']
})
export class StatisticAlarmComponent implements OnInit {
  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  // 表格类
  isAllChecked = false;
  widthConfig = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '1px'];
  scrollConfig = { x: '1501px' };
  dateRange = [];
  // ranges1 = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private modal: NzModalService,
              private modalService: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      startTime: '',
      endTime: '',
      statType: '0',
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
    this.search();
    this.messageService.closeLoading();

  }

  search() {
    console.log(this.dateRange);
    if (this.dateRange !== [] && this.dateRange !== null && this.dateRange !== undefined && this.dateRange.length > 1) {
      const filter: any = {
        'statType': this.filters.statType,
        'pageNum': this.tableConfig.pageNum,
        'pageSize': this.tableConfig.pageSize
      };
      filter.startTime = format(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filter.endTime = format(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss');
      this.tableConfig.loading = true;
      this.ingotAlarmService.pageRangeAlarm(filter).subscribe((res) => {
        if (res.code !== 0) {
          return;
        }
        this.listOfAllData = res.value.list;
        this.tableConfig.pageTotal = res.value.total;
        this.tableConfig.loading = false;
      });
    } else {
      const cond: any ={};
      cond.statType = this.filters.statType;
      const filter: any = {
        'filters': cond,
        'pageNum': this.tableConfig.pageNum,
        'pageSize': this.tableConfig.pageSize
      };
      this.tableConfig.loading = true;
      this.ingotAlarmService.pageAlarm(filter).subscribe((res) => {
        if (res.code !== 0) {
          return;
        }
        this.listOfAllData = res.value.list;
        this.tableConfig.pageTotal = res.value.total;
        this.tableConfig.loading = false;
      });
    }
  }

  pageChange() {
    this.search();
  }

}
