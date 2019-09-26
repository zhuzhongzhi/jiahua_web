import {Component, OnInit} from '@angular/core';
import {format, formatDistance, formatRelative, subDays} from 'date-fns';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quality-billboard',
  templateUrl: './quality-billboard.component.html',
  styleUrls: ['./quality-billboard.component.scss']
})
export class QualityBillboardComponent implements OnInit {


  time = format(new Date(), 'yyyy-MM-dd');

  causeList: any = {};
  dyeList: any;
  lousinessList: any;
  floatSilkList: any;
  windList: any;
  // 实时预警
  spinAlarms = [];
  residentAlarmS = [];

  chart1;
  chart2;
  chart3;
  chart4;

  constructor(private messageService: ShowMessageService, private router: Router,
              private ingotAlarmService: IngotAlarmService) {
  }

  ngOnInit() {
    this.initData();
    this.initWarns();
  }

  private initData() {
    this.ingotAlarmService.boardQualityToday().subscribe((res) => {
      if (res.value.causeList.length > 0) {
        this.causeList = res.value.causeList[0];
      }
      this.dyeList = res.value.dyeList;
      this.floatSilkList = res.value.floatSilkList;
      this.lousinessList = res.value.lousinessList;
      this.windList = res.value.windList;


      let dyeXData = [];
      let dyeYData = [];
      if (this.dyeList.lineQualityBoardVOToday) {
        dyeXData.push(this.dyeList.lineQualityBoardVOToday.lineType);
        dyeYData.push(this.dyeList.lineQualityBoardVOToday.dyeRatio);
      }
      if (this.dyeList.lineQualityBoardVOYesterday) {
        dyeXData.push(this.dyeList.lineQualityBoardVOYesterday.lineType);
        dyeYData.push(this.dyeList.lineQualityBoardVOYesterday.dyeRatio);
      }
      if (this.dyeList.lineQualityBoardVOBeforeYesterday) {
        dyeXData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.lineType);
        dyeYData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.dyeRatio);
      }
      let floatXData = [];
      let floatYData = [];
      if (this.dyeList.lineQualityBoardVOToday) {
        floatXData.push(this.dyeList.lineQualityBoardVOToday.lineType);
        floatYData.push(this.dyeList.lineQualityBoardVOToday.floatSilkRatio);
      }
      if (this.dyeList.lineQualityBoardVOYesterday) {
        floatXData.push(this.dyeList.lineQualityBoardVOYesterday.lineType);
        floatYData.push(this.dyeList.lineQualityBoardVOYesterday.floatSilkRatio);
      }
      if (this.dyeList.lineQualityBoardVOBeforeYesterday) {
        floatXData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.lineType);
        floatYData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.floatSilkRatio);
      }
      let lousinessXData = [];
      let lousinessYData = [];
      if (this.dyeList.lineQualityBoardVOToday) {
        lousinessXData.push(this.dyeList.lineQualityBoardVOToday.lineType);
        lousinessYData.push(this.dyeList.lineQualityBoardVOToday.lousinessRatio);
      }
      if (this.dyeList.lineQualityBoardVOYesterday) {
        lousinessXData.push(this.dyeList.lineQualityBoardVOYesterday.lineType);
        lousinessYData.push(this.dyeList.lineQualityBoardVOYesterday.lousinessRatio);
      }
      if (this.dyeList.lineQualityBoardVOBeforeYesterday) {
        lousinessXData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.lineType);
        lousinessYData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.lousinessRatio);
      }
      let windXData = [];
      let windYData = [];
      if (this.dyeList.lineQualityBoardVOToday) {
        windXData.push(this.dyeList.lineQualityBoardVOToday.lineType);
        windYData.push(this.dyeList.lineQualityBoardVOToday.windRatio);
      }
      if (this.dyeList.lineQualityBoardVOYesterday) {
        windXData.push(this.dyeList.lineQualityBoardVOYesterday.lineType);
        windYData.push(this.dyeList.lineQualityBoardVOYesterday.windRatio);
      }
      if (this.dyeList.lineQualityBoardVOBeforeYesterday) {
        windXData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.lineType);
        windYData.push(this.dyeList.lineQualityBoardVOBeforeYesterday.windRatio);
      }

      // init chart
      this.chart1 = {
        title: {
          text: '近三日线别毛丝不良率排名'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: lousinessXData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: lousinessYData
          }
        ]
      };
      this.chart2 = {
        title: {
          text: '近三日线别染色不良率排名'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dyeXData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: dyeYData
          }
        ]
      };
      this.chart3 = {
        title: {
          text: '近三日线别GR绕丝不良率排名'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: windXData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: windYData
          }
        ]
      };
      this.chart4 = {
        title: {
          text: '近三日线别飘丝不良率排名'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: floatXData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: floatYData
          }
        ]
      };

    });
  }

  private initWarns() {
    this.ingotAlarmService.warnRealTimeList().subscribe((res) => {
      this.spinAlarms = res.value.spinAlarmS;
      this.residentAlarmS = res.value.residentAlarmS;
    });
  }

  private go(type) {
    switch (type) {
      case 1:
        this.router.navigateByUrl('/main/produceManage/wiringAlarm');
      case 2:
        this.router.navigateByUrl('/main/produceManage/stayAlarm');
    }
  }
}
