import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-output-statistic',
  templateUrl: './output-statistic.component.html',
  styleUrls: ['./output-statistic.component.scss']
})
export class OutputStatisticComponent implements OnInit {


  isCollapse = false;
  // table控件配置
  tableConfig: any;
  listOfAllData = [
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
    {riqi: '2019.6.30', banbie: '甲', gonghao: '103', pihao: '160972378', guige: '1212312312', cheliangshu: '30', dingshu: '5', gongyizhuangtai: '测丹尼', chanliang: '550'},
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
