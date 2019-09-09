import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lathe-list',
  templateUrl: './lathe-list.component.html',
  styleUrls: ['./lathe-list.component.scss']
})
export class LatheListComponent implements OnInit {
  isCollapse = false;
  // table控件配置
  tableConfig: any;
  listOfAllData = [
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '落丝' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '测丹尼' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '摇袜' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '测丹尼' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '判色' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '判色' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '判色' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '检验' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '检验' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '打包' },
    {no: '1231231', xianbie: 'A3', guige: '12331231', pihao: '198102986', gongyizhuangtai: '打包' },
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
