import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ingotalarm-manage',
  templateUrl: './ingotalarm-manage.component.html',
  styleUrls: ['./ingotalarm-manage.component.scss']
})
export class IngotalarmManageComponent implements OnInit {

  isCollapse = false;
  // table控件配置
  tableConfig: any;
  listOfAllData = [
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
    {pihao:'16092312', guige: '12132131', xianbie: 'A3', fangwei: '6', dingwei: '6', zuixinshengchanriqi: '2019.6.30', baojinleixing: '毛丝报警', baojincishu: '5' },
  ];
  constructor() {  this.tableConfig = {
    showCheckBox: false,
    allChecked: false,
    pageSize: 10,
    pageNum: 1,
    total: 10,
    loading: false
  }; }

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
