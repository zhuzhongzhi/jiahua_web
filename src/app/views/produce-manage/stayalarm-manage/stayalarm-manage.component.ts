import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stayalarm-manage',
  templateUrl: './stayalarm-manage.component.html',
  styleUrls: ['./stayalarm-manage.component.scss']
})
export class StayalarmManageComponent implements OnInit {

  isCollapse = false;
  // table控件配置
  tableConfig: any;
  listOfAllData = [
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
    {sichebianhao: '320938',pihao:'16092312', guige: '12132131', xianbie: 'A3',shengchanriqi: '2019.6.30', gongyizhuangtai: '落丝', baojinleixing: '驻留报警', jiankashijian: '2019.2.10 10.10:00' },
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
