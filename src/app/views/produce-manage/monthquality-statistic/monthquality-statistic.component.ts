import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monthquality-statistic',
  templateUrl: './monthquality-statistic.component.html',
  styleUrls: ['./monthquality-statistic.component.scss']
})
export class MonthqualityStatisticComponent implements OnInit {

  isCollapse = false;
  // table控件配置
  tableConfig: any;
  listOfAllData = [
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
    {riqi: '2019.6', pihao: '160972632', xianbie: 'A3', zhongliang: '1050' },
  ];

  constructor() {
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
  }
}
