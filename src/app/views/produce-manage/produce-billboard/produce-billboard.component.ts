import {Component, OnInit} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {format, formatDistance, formatRelative, subDays} from 'date-fns';

@Component({
  selector: 'app-produce-billboard',
  templateUrl: './produce-billboard.component.html',
  styleUrls: ['./produce-billboard.component.scss']
})
export class ProduceBillboardComponent implements OnInit {

  // 今日产量
  output: any = 0;
  // 更新时间
  updatetime: any;
  // 看板数据
  boardData: any;
  detail = {
    doffingWeight: 0,
    testDannyWeight: 0,
    rockWeight: 0,
    colourWeight: 0,
    checkWeight: 0,
    packageWeight: 0,
    a1Weight: 0,
    aaweight: 0,
    aweight: 0,
    bweight: 0
  };
  dateList = [];
  doffList = [];
  testList = [];
  rockList = [];
  colourList = [];
  checkList = [];
  packageList = [];

  produceOption;

  constructor(private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {


  }

  ngOnInit() {
    this.initBoard();
    this.initCharts();
    this.messageService.closeLoading();

  }

  initBoard() {
    this.ingotAlarmService.boardOutputToday().subscribe((res) => {
      // 获取看板数据
      this.boardData = res.value;
      this.updatetime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      res.value.forEach(item => {
        this.output += item.totalWeight ? item.totalWeight : 0;
        this.detail.doffingWeight += item.doffingWeight ? item.doffingWeight : 0;
        this.detail.testDannyWeight += item.testDannyWeight ? item.testDannyWeight : 0;
        this.detail.rockWeight += item.rockWeight ? item.rockWeight : 0;
        this.detail.colourWeight += item.colourWeight ? item.colourWeight : 0;
        this.detail.checkWeight += item.checkWeight ? item.checkWeight : 0;
        this.detail.packageWeight += item.packageWeight ? item.packageWeight : 0;
        this.detail.a1Weight += item.a1Weight ? item.a1Weight : 0;
        this.detail.aaweight += item.aaweight ? item.aaweight : 0;
        this.detail.aweight += item.aweight ? item.aweight : 0;
        this.detail.bweight += item.bweight ? item.bweight : 0;
      });

      if (this.output === undefined || this.output === null || this.output === '') {
        this.output = 0;
      }
    });
  }

  /**
   checkWeight: 220
   colourWeight: 320
   doffingWeight: 210
   packageWeight: 430
   pbId: 1
   produceTime: "2019-09-16 06:32:05"
   rockWeight: 870
   testDannyWeight: 176
   totalWeight: 2910
   updateTime: "2019-09-12 06:32:05"
   */
  private initCharts() {
    this.ingotAlarmService.boardOutputHistory().subscribe((res) => {
      const dataList = res.value;
      dataList.map(item => {
        this.dateList.push(format(new Date(item.produceTime), 'MM.dd'));
        this.doffList.push(item.doffingWeight);
        this.testList.push(item.testDannyWeight);
        this.checkList.push(item.checkWeight);
        this.colourList.push(item.colourWeight);
        this.packageList.push(item.packageWeight);
        this.rockList.push(item.rockWeight);
      });
      console.log(this.dateList);
      console.log(this.doffList);
      console.log(this.testList);
      console.log(this.colourList);
      console.log(this.checkList);
      console.log(this.packageList);
      console.log(this.rockList);
      this.produceOption = {
        title: {
          text: '每日产量趋势图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: true
          }
        },
        legend: {
          icon: 'rectangle',
          data: ['落丝', '测丹尼', '摇袜', '判色', '检验', '包装']
        },
        grid: {
          left: '3%',   //组件离容器左侧的距离
          right: '4%',
          bottom: '0%',
          containLabel: true     //grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {color: '#555'},
          },
          data: this.dateList,
          splitLine: {show: false, lineStyle: {color: '#ccc'}},
          splitNumber: 12,
          axisPointer: {
            show: false,
            lineStyle: {
              color: '#478cf1',
              width: 1.5
            }
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
        },
        series: [
          {
            name: '落丝',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.doffList,
          },
          {
            name: '测丹尼',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.testList,
          },
          {
            name: '摇袜',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.rockList,
          },
          {
            name: '判色',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.colourList,
          },
          {
            name: '检验',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.checkList,
          },
          {
            name: '包装',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.packageList,
          },
        ]
      };
    });
  }
}
