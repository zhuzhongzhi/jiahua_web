import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-danni-manage',
  templateUrl: './danni-manage.component.html',
  styleUrls: ['./danni-manage.component.scss']
})
export class DanniManageComponent implements OnInit {

  isCollapse = false;
  // table控件配置
  tableConfig: any;
  listOfAllData = [
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
    {no: '1231231', luosishijian: '2019.2.10 10:10:00', xianbie: 'A3', pihao: '198102986', guige: '12321321', banbie: '甲', jinzhong: '88', shengchanriqi: '2019.6.30', gongyizhuangtai: '摇袜', luosicaozuoyuan: '103', luosikaishijian: '2019.2.10 10.10:00' },
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
