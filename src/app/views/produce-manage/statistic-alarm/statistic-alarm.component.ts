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

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private modal: NzModalService,
              private modalService: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      startTime: '',
      statType: '',
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
  }

  search() {
    if(this.filters.startTime === '' || this.filters.startTime === undefined || this.filters.startTime === null) {
      this.messageService.showToastMessage('起始日期未选择', 'error');
      return;
    }
    if(this.filters.statType === '' || this.filters.statType === undefined || this.filters.statType === null) {
      this.messageService.showToastMessage('统计类型未选择', 'error');
      return;
    }
    const date = new Date(this.filters.startTime);
    let month;
    if (date.getMonth() === 12) {
      month = 1;
    } else {
      month = date.getMonth() + 1;
    }
    const filter = {
      'filters': {
        'statMonth': month,
        'statYear': date.getFullYear(),
        'statDay': date.getDate()
      },
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

  pageChange() {
    this.search();
  }

}
