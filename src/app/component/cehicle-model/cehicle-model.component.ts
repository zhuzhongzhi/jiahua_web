import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { requireStatusNode } from '../../../environments/type-search';
import { CehicleListService } from '../../core/biz-services/vehicleMonitor/cehicle-list.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
import { TerminalServiceNs } from '../../core/biz-services/resource/terminal.service';
import { AlarmListService } from '../../core/biz-services/vehicleMonitor/alarm-list.service';
import { TeamTallyService, TeamTallyServiceNs } from '../../core/biz-services/dispatchManage/team-tally.service';
import { RefuelCardService } from '../../core/biz-services/brownfields/refuel-card.service';
import { MaintenanceRecordService } from '../../core/biz-services/maintenance/maintenance-record.service';
import { VindicateRecordService, VindicateRecordServiceNs } from '../../core/biz-services/vindicate/vindicate-record.service';
import { LocationService, LocationServiceNs, LocationUtilService } from '../../core/biz-services/location/location-service.service';
import { MapGaodeShowComponent } from '../../component/map-gaode-show/map-gaode-show.component';
import { MapGoogleShowComponent } from '../../component/map-google-show/map-google-show.component';
import { MapGaodeLocPlayComponent } from '../../component/map-gaode-loc-play/map-gaode-loc-play.component';
import { MapGoogleLocPlayComponent } from '../../component/map-google-loc-play/map-google-loc-play.component';
import {RefuelRecordService} from '../../core/biz-services/brownfields/refuel-record.service';
declare var $: any;
declare var AMapUI: any;
@Component({
  selector: 'app-cehicle-model',
  templateUrl: './cehicle-model.component.html',
  styleUrls: ['./cehicle-model.component.scss']
})
export class CehicleModelComponent implements OnInit, AfterViewInit, OnDestroy {
  // 切换地图，高德地图——1，谷歌地图——2
  showGaoDe = 1;
  showGaoDeLoc = 1;
  // speedRangeValueLoc = 10;
  // 单选按钮值，标准或卫星地图——标准是‘0’，卫星是‘1’
  radioMapValue = 0;
  radioMapValueLoc = 0;
  currentZoomAndCenter: any = null;
  currentZoomAndCenterForLoc: any = null;
  @ViewChild('gaodeShow')
  private gaodeShow: MapGaodeShowComponent;
  @ViewChild('googleShow')
  private googleShow: MapGoogleShowComponent;
  @ViewChild('mapGaodeLocPlay')
  private mapGaodeLocPlay: MapGaodeLocPlayComponent;
  @ViewChild('mapGoogleLocPlay')
  private mapGoogleLocPlay: MapGoogleLocPlayComponent;
  screenItem = {};
  screenItemForLoc = { vehiclePlaceInfo: { onlineState: '', workState: '', repairState: '', alarmState: '', vehicleTypeName: '' } };
  hisLocCarUrl;
  title: string;
  // 基本信息
  @Input() info;
  @Input() alertStatusNodes;
  menuActiveIndex: number;
  menulist;
  registerInfo = {
    num: '',
    sim: '',
    registerTime: '',
  };
  /**
   * 位置信息
   * lat: 纬度
   * lng：经度
   * latEnc: 纬度——偏移
   * lngEnc：经度——偏移
   * **/
  posInfo = {
    info: null, updateTime: null,
    lat: null, lng: null,
    latEnc: null, lngEnc: null,
    address: ''
  };

  // 日期模式选择
  dateMode = 'date';

  // 报警列表
  date = null;
  alertStatus: string;
  alarmDateRange;
  alarmList = [];
  alarmLoading = false;
  alarmPageNum = 1;
  alarmPageSize = 14;
  alarmTotal = 0;
  alarmListSort = '';

  // 活动曲线
  actDateRange = new Date();
  actTimes;
  actInfo = { stop: '00小时00分00秒', idling: '00小时00分00秒', drive: '00小时00分00秒', repairTime: '00小时00分00秒' };
  option;
  actLineList = [];
  actLineLoading = false;
  // actLinePageNum = 1;
  // actLinePageSize = 12;
  // actLineTotal = 0;

  // 点检记录
  teamTallyDateRange;
  teamTallyList = [];
  teamTallyLoading = false;
  teamTallyPageNum = 1;
  teamTallyPageSize = 14;
  teamTallyTotal = 0;

  // 加油记录
  refuelDateRange;
  refuelList = [];
  refuelLoading = false;
  refuelPageNum = 1;
  refuelPageSize = 14;
  refuelTotal = 0;

  // 保养记录
  keepDateRange;
  keepList = [];
  keepLoading = false;
  keepPageNum = 1;
  keepPageSize = 14;
  keepTotal = 0;

  // 维修记录
  requireStatus: string;
  requireStatusNodes = requireStatusNode;
  requireDateRange;
  requireList = [];
  requireLoading = false;
  requirePageNum = 1;
  requirePageSize = 14;
  requireTotal = 0;

  // 速度曲线
  speedLineDate = new Date();
  speedInfo;
  speedLineOption;
  // 加油曲线
  oilLineDate = new Date();
  oilLineOption;
  /*历史轨迹 */
  // 查询时间
  hisLocDateRange = null;
  speedRangeValue = 1000;
  speedRangeValueForGoo = 10;
  resultData: any;
  isShowConPanel = true;
  infoShow = {
    acc: '',
    alarmTypeName: '',
    vehicleTypeName: '',
    vehicleLicense: '',
    vehicleModelName: '',
    deptName: '',
    onlineState: '0',
    alarmTypeCodeName: '',
    alarmTypeStr: '',
    speed: '',
    vehicleStateName: '',
    workGroupName: '',
    position: '0',
    carriageNo: '',
    engineNo: ''
  };
  private timer;
  private i: number = 0;
  isInit: boolean = true;
  devHisLocInfo = [];
  isOpenAccFilter: boolean = true;
  isPositionFilter: boolean = true;
  constructor(private cehicleListService: CehicleListService,
    private alarmListService: AlarmListService,
    private teamTallyService: TeamTallyService,
    private refuelCardService: RefuelCardService,
    private refuelRecordService: RefuelRecordService,
    private maintenanceRecordService: MaintenanceRecordService,
    private vindicateRecordService: VindicateRecordService,
    private messageService: ShowMessageService,
    private locationService: LocationService,
    private locationUtilService: LocationUtilService) {
    this.speedRangeValue = 1000;
    this.speedRangeValueForGoo = 10;
    this.hisLocDateRange = null;
    this.isShowConPanel = true;
  }
  ngAfterViewInit() {
    this.getBaseInfo();
    this.processHisLoc();
    this.timer = setInterval(() => {
      this.getBaseInfo();
    }, 10000);
  }

  // 日期模式选择
  openChangeDate() {
    this.dateMode = 'date';
  }
  modelChange() {
    if (this.dateMode === 'date') {
      this.dateMode = 'time';
    }
  }
  // 销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  ngOnInit() {
    this.menulist = [
      { name: '基本信息', id: 1 },
      { name: '历史轨迹', id: 2 },
      { name: '报警列表', id: 3 },
      { name: '历史工况', id: 4 },
      { name: '点检记录', id: 5 },
      { name: '加油记录', id: 6 },
      { name: '保养记录', id: 7 },
      { name: '维修记录', id: 8 },
      { name: '速度曲线', id: 9 },
      { name: '加油曲线', id: 10 },
    ];
    this.title = this.menulist[0].name;
    this.menuActiveIndex = this.menulist[0].id;
    this.infoShow = this.info;
  }
  zoomOutFromChild(e) {
    this.currentZoomAndCenter = e;
    this.changeMapZoomAndCenter();
  }
  changeMapZoomAndCenter() {
    if (this.currentZoomAndCenter) {
      if (this.currentZoomAndCenter.map === 'google') {
        this.gaodeShow.getMap().setZoomAndCenter(this.currentZoomAndCenter.zoom, [this.currentZoomAndCenter.lng, this.currentZoomAndCenter.lat]);
      }
      if (this.currentZoomAndCenter.map === 'gaode') {
        this.googleShow.setZoomAndCenter(this.currentZoomAndCenter.zoom, this.currentZoomAndCenter.lat, this.currentZoomAndCenter.lng);
      }
    }
  }
  zoomOutFromChildForLoc(e) {
    this.currentZoomAndCenterForLoc = e;
    this.changeMapZoomAndCenterForLoc();
  }
  changeMapZoomAndCenterForLoc() {
    if (this.currentZoomAndCenterForLoc) {
      if (this.currentZoomAndCenterForLoc.map === 'google') {
        this.mapGaodeLocPlay.getHisLocMap().setZoomAndCenter(this.currentZoomAndCenterForLoc.zoom, [this.currentZoomAndCenterForLoc.lng, this.currentZoomAndCenterForLoc.lat]);
      }
      if (this.currentZoomAndCenterForLoc.map === 'gaode') {
        this.mapGoogleLocPlay.setZoomAndCenter(this.currentZoomAndCenterForLoc.zoom, this.currentZoomAndCenterForLoc.lat, this.currentZoomAndCenterForLoc.lng);
      }
    }
  }
  // 卫星地图与道路地图切换
  changeSelectedMap() {
    this.radioMapValue = this.radioMapValue === 0 ? 1 : 0;
  }
  // 卫星地图与道路地图切换
  changeSelectedMapLoc() {
    this.radioMapValueLoc = this.radioMapValueLoc === 0 ? 1 : 0;
  }
  openChange(menu) {
    this.menuActiveIndex = menu.id;
    this.title = menu.name;
    if (menu.id === 1) {
      this.timer = setInterval(() => {
        this.getBaseInfo();
      }, 10000);
    } else {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
    if (menu.id === 3 && this.alarmList.length === 0) {
      this.getAlarmList();
    }
    if (menu.id === 4) {
      this.getActLineInit();
    }
    if (menu.id === 5) {
      this.getTeamTallyInfo();
    }
    if (menu.id === 6) {
      this.getRefuelInfo();
    }
    if (menu.id === 7) {
      this.getkeepInfo();
    }
    if (menu.id === 8) {
      this.getRequireInfo();
    }
    if (menu.id === 9) {
      this.getSpeedLine();
    }
    if (menu.id === 10) {
      this.getOilLine();
    }
  }
  /** 历史轨迹 start */
  hisLocDispDataFromChild(e) {
    this.devHisLocInfo = e;
  }
  changeDisplayModel() {
    this.isShowConPanel = false;
  }
  changeDisplayModelToF() {
    this.isShowConPanel = true;
  }
  processHisLoc() {
    // 获取默认时间
    const startDefault = new Date();
    startDefault.setHours(0);
    startDefault.setMinutes(0);
    startDefault.setSeconds(0);
    const endDefault = new Date();
    this.hisLocDateRange = [];
    this.hisLocDateRange[0] = startDefault;
    this.hisLocDateRange[1] = endDefault;
    const startD = this.hisLocDateRange ? this.initDateTime(this.hisLocDateRange[0]) : null;
    const endD = this.hisLocDateRange ? this.initDateTime(this.hisLocDateRange[1]) : null;
    this.initHisLocData(startD, endD, true);
  }
  speedRangeChange(speedRangeValue) {
    if (1 === this.showGaoDeLoc && this.mapGaodeLocPlay.navg1) {
      this.mapGaodeLocPlay.navg1.setSpeed(speedRangeValue);
    }
    // if (2 === this.showGaoDeLoc) {
    //   this.speedRangeValueLoc = speedRangeValue;
    //   this.mapGoogleLocPlay.changeSpeed(speedRangeValue);
    // }
  }
  speedRangeChangeForGoo(speedRangeValue) {
    // if (1 === this.showGaoDeLoc && this.mapGaodeLocPlay.navg1) {
    //   this.mapGaodeLocPlay.navg1.setSpeed(speedRangeValue);
    // }
    if (2 === this.showGaoDeLoc) {
      // this.speedRangeValueLoc = speedRangeValue;
      this.mapGoogleLocPlay.changeSpeed(speedRangeValue);
    }
  }

  startClick() {
    if (1 === this.showGaoDeLoc && this.mapGaodeLocPlay.navg1) {
      if ('pause' === this.mapGaodeLocPlay.navg1.getNaviStatus() && !(this.mapGaodeLocPlay.navg1.getCursor().idx === this.mapGaodeLocPlay.navg1.getPathEndIdx())) {
        this.mapGaodeLocPlay.navg1.resume();
      } else {
        this.mapGaodeLocPlay.navg1.start();
      }
    }
    if (2 === this.showGaoDeLoc) {
      this.mapGoogleLocPlay.start(this.speedRangeValueForGoo);
    }
  }
  pauseClick() {
    if (1 === this.showGaoDeLoc && this.mapGaodeLocPlay.navg1) {
      this.mapGaodeLocPlay.navg1.pause();
    }
    if (2 === this.showGaoDeLoc) {
      this.mapGoogleLocPlay.pause();
    }
  }
  refreshClick() {
    if (1 === this.showGaoDeLoc && this.mapGaodeLocPlay.navg1) {
      this.mapGaodeLocPlay.navg1.stop();
    }
    if (2 === this.showGaoDeLoc) {
      this.mapGoogleLocPlay.refresh();
    }
  }
  hisLocSearch() {
    if (null == this.hisLocDateRange) {
      this.messageService.showAlertMessage('', '请填入查询时间', 'warning');
      return;
    }
    this.mapGaodeLocPlay.clearData();
    this.mapGoogleLocPlay.clearData();
    const startD = this.hisLocDateRange ? this.initDateTime(this.hisLocDateRange[0]) : null;
    const endD = this.hisLocDateRange ? this.initDateTime(this.hisLocDateRange[1]) : null;
    this.initHisLocData(startD, endD, false);
  }
  initHisLocData(start, end, isInit) {
    let params;
    if (this.isOpenAccFilter) {
      params = { vehicleId: this.info.vehicleId, startDate: start, endDate: end, accStatus: '1' };
    } else {
      params = { vehicleId: this.info.vehicleId, startDate: start, endDate: end };
    }
    if (this.isPositionFilter) {
      params.position = '1';
    }
    this.locationService.getHisLocData(params).subscribe((resData: LocationServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      // 测试
      // resData.value = this.locationUtilService.mocHisData1();
      const data = this.locationUtilService.procHisLocResItem(resData.value);
      if (!isInit && (!data || data.length < 1 || !data[0].path || data[0].path.length < 1)) {
        this.messageService.showAlertMessage('', '指定时间范围内没有轨迹信息', 'warning');
        return;
      }
      this.resultData = resData.value;
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  /** 历史轨迹 end */
  // 获取基本信息
  getBaseInfo() {
    // 获取终端信息
    const param = {
      deviceId: this.info.deviceId
    };
    this.cehicleListService.getDeviceInfo(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      if (null == resData.value) {
        this.messageService.showAlertMessage('', '车辆不存在', 'warning');
        return;
      }
      this.registerInfo.registerTime = this.formatDate(new Date(resData.value.createDate));
      this.registerInfo.sim = resData.value.simNo;
      this.registerInfo.num = resData.value.deviceCode;
    }, (error: any) => {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.messageService.showAlertMessage('', error.message, 'error');
    });
    // 获取车辆信息
    this.cehicleListService.getVehicleBaseInfo({ id: this.info.vehicleId }).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      if (null == resData.value) {
        this.messageService.showAlertMessage('', '车辆不存在', 'warning');
        return;
      }
      this.infoShow = this.initBaseInfo(resData.value);
      const filter = { license: resData.value.vehicleLicense };
      this.locationService.getVehiclesMapData(filter).subscribe((res: LocationServiceNs.UfastHttpAnyResModel) => {

        if (!(null != res.value && res.value.length > 0)) {
          // this.messageService.showAlertMessage('', '车辆不存在', 'error');
          return false;
        }
        const item = res.value[0];
        this.screenItem = { vehiclePlaceInfo: item };
        this.screenItemForLoc = { vehiclePlaceInfo: item };
      }, (error: any) => {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.messageService.showAlertMessage('', error.message, 'error');
      });
    }, (error: any) => {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.messageService.showAlertMessage('', error.message, 'error');
    });
    // 获取车辆位置信息
    this.cehicleListService.getVehicleStatus({ id: this.info.vehicleId }).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      if (null == resData.value) {
        this.messageService.showAlertMessage('', '车辆位置信息不存在', 'warning');
        return;
      }
      this.posInfo.lat = resData.value.lat;
      this.posInfo.lng = resData.value.lon;
      this.posInfo.latEnc = resData.value.latEnc;
      this.posInfo.lngEnc = resData.value.lonEnc;
      this.locationUtilService.lngLatToLoc([resData.value.lon, resData.value.lat], this.posInfo);
      this.posInfo.updateTime = resData.value.statusDate;
      // this.getBaseMap();
      // this.addMaker();
    }, (error: any) => {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  initBaseInfo(info) {
    return {
      ...info,
      alarmTypeName: !info.alarmType || !info.alarmType.alarmTypeName ? '正常' : info.alarmType.alarmTypeName
    };
  }

  // 重置时间格式
  formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  // 获取报警列表
  getAlarmList() {
    const param = {
      pageNum: this.alarmPageNum,
      pageSize: this.alarmPageSize,
      sort: this.alarmListSort === '' ? 'start_time desc' : this.alarmListSort,
      filters: {
        vehicleId: this.info.vehicleId,
        alarmTypeCode: this.alertStatus,
        startTime: this.alarmDateRange ? this.initDateTime(this.alarmDateRange[0]) : null,
        endTime: this.alarmDateRange ? this.initDateTime(this.alarmDateRange[1]) : null
      }
    };
    this.alarmLoading = true;
    this.alarmListService.getAlarmList(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.alarmLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.alarmList = this.initAlarmList(resData.value.list);
      this.alarmPageNum = resData.value.pageNum;
      this.alarmTotal = resData.value.total;
    }, (error: any) => {
      this.alarmLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  initAlarmList(info) {
    return info.map((item) => {
      return {
        ...item,
        range: this.getRange(item.startTime, item.endTime)
      };
    });
  }
  // 排序
  alarmSort(sort: { key: string; value: string }): void {
    const sortName = sort.key;
    const sortValue = sort.value;
    let param = '';
    if (sortName && sortValue) {
      param = `${sortName} ${sortValue.replace('end', '')}`;
    }
    this.alarmListSort = param;
    this.getAlarmList();
  }

  // 获取活动曲线数据,初始化数据图
  getActLineInit() {
    // 获取开始结束时间
    const [start, end] = this.getStartAndEnd2(this.actDateRange);
    const param = {
      vehicleId: this.info.vehicleId,
      startTime: this.initDateTime(start),
      endTime: this.initDateTime(end)
    };
    this.actLineLoading = true;
    this.cehicleListService.getWorkStatus(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.actLineLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.initCharts(resData.value.vehicleActivitys);
      this.actInfo = {
        stop: resData.value.leaveTime ? this.getRange2(resData.value.leaveTime) : '00小时00分00秒',
        idling: resData.value.idleTime ? this.getRange2(resData.value.idleTime) : '00小时00分00秒',
        drive: resData.value.workTime ? this.getRange2(resData.value.workTime) : '00小时00分00秒',
        repairTime: resData.value.repairTime ? this.getRange2(resData.value.repairTime) : '00小时00分00秒',
      };
    }, (error: any) => {
      this.actLineLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  initCharts(data) {
    // 获取工作数据、闲置数据和维修数据
    const stopY = [];
    const driveY = [];
    const vindicateY = [];
    // 获取开始结束时间
    const [start, end] = this.getStartAndEnd(this.actDateRange);
    data = data.filter(item => item.startTime && item.endTime);
    // 排序
    data.sort((a, b) => {
      const aDate = new Date(a.startTime);
      const bDate = new Date(b.startTime);
      return aDate.getTime() - bDate.getTime();
    });
    // 修改值
    data.map(item => {
      let startTime = new Date(item.startTime);
      let endTime = new Date(item.endTime);
      // 获取工作数据、闲置数据和维修数据
      switch (item.activityType) {
        case 0:
          stopY.push([
            {xAxis: startTime.getTime()},
            {xAxis: endTime.getTime()}
          ]);
          break;
        case 2:
          driveY.push([
            {xAxis: startTime.getTime()},
            {xAxis: endTime.getTime()}
          ]);
          break;
        case 9:
          vindicateY.push([
            {xAxis: startTime.getTime()},
            {xAxis: endTime.getTime()}
          ]);
          break;
      }
      startTime = item.startTime && startTime < start ? start : startTime;
      endTime = item.endTime && endTime > end ? end : endTime;
      const range = startTime && endTime ? this.getRange(startTime, endTime) : 0;
      item.start = this.initDateTime(startTime);
      item.end = this.initDateTime(endTime);
      item.range = range;
      item.mileage = item.mileage === null ? 0 : item.mileage;
      return item;
    });
    // 赋值给表格
    this.actLineList = JSON.parse(JSON.stringify(data));
    // const xData = [];
    // const yData = [];
    // const onDay = this.isOneDay(data);
    // data.forEach((item) => {
    //   // const startTime = new Date(item.startTime);
    //   // let xInfoStart = this.initDateTime(startTime);
    //   let xInfoStart = item.startTime;
    //   xInfoStart = onDay && xInfoStart && xInfoStart.length > 6 ? xInfoStart.split(' ')[1] : xInfoStart;
    //   let xInfoEnd = item.endTime;
    //   xInfoEnd = onDay && xInfoEnd && xInfoEnd.length > 6 ? xInfoEnd.split(' ')[1] : xInfoEnd;
    //   xData.push(xInfoStart);
    //   // xData.push(xInfoEnd);
    //   yData.push(item.activityType);
    //   // yData.push(item.activityType);
    // });
    // this.option = {
    //   grid: { top: 30, right: 60 },
    //   xAxis: {
    //     type: 'category',
    //     data: xData,
    //     boundaryGap: false,
    //   },
    //   yAxis: {
    //     type: 'category',
    //     data: ['闲置', '怠速', '工作'],
    //     boundaryGap: false,
    //     // axisLine{
    //     //   show: false
    //     // }
    //   },
    //   series: [
    //     {
    //       type: 'line',
    //       step: 'start',
    //       showSymbol: false,
    //       itemStyle: {
    //         normal: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //             offset: 0,
    //             color: '#4F5FE8'
    //           }, {
    //             offset: 1,
    //             color: '#F255F7'
    //           }])
    //         },
    //       },
    //       areaStyle: {
    //         normal: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //             offset: 0,
    //             color: '#4F5FE8'
    //           },
    //             {
    //               offset: 1,
    //               color: '#F255F7'
    //             }
    //           ]),
    //           opacity: 1
    //         }
    //       },
    //       data: yData
    //     }
    //   ]
    // };
    this.option = {
        grid: [{ top: 0, left: 20, right: 20, height: 60, borderColor: '#ccc', borderWidth: 1, z: 10, show: true }],
        xAxis: [{
          type: 'time',
          gridIndex: 0,
          axisLine: {show: false, onZero: false, lineStyle: {color: '#ccc'}},
          axisTick: {show: false},
          axisLabel: {
            show: true,
            textStyle: {color: '#555'},
            formatter: function (value, index) {
              if (index === 12) {
                return '24: 00';
              }
              const date = new Date(value);
              let hour: string | number = date.getHours();
              hour = hour < 10 ? '0' + hour : hour;
              let minute: string | number = date.getMinutes();
              minute = minute < 10 ? '0' + minute : minute;
              return hour + ':' + minute;
            }
          },
          splitLine: {show: false, lineStyle: {color: '#ccc'}},
          splitNumber: 12,
          axisPointer: {
            show: false,
            lineStyle: {
              color: '#478cf1',
              width: 1.5
            }
          },
          min: start.getTime(),
          max: end.getTime(),
        }],
        yAxis: [{
          type: 'value',
          gridIndex: 0,
          nameLocation: 'middle',
          nameTextStyle: {
            color: '#333'
          },
          boundaryGap: ['30%', '30%'],
          axisTick: {show: false},
          axisLine: {lineStyle: {color: '#ccc'}},
          axisLabel: {show: false},
          splitLine: {show: false}
        }],
        series: [
          {
            name: '闲置',
            type: 'line',
            symbol: 'circle',
            symbolSize: 2,
            xAxisIndex: 0,
            yAxisIndex: 0,
            markArea: {
              itemStyle: {
                normal: {
                  color: '#95acdf'
                }
              },
              data: stopY
            }
          },
          {
            name: '在线',
            type: 'line',
            symbol: 'circle',
            symbolSize: 2,
            xAxisIndex: 0,
            yAxisIndex: 0,
            markArea: {
              itemStyle: {
                normal: {
                  color: '#3fdcb9'
                }
              },
              data: driveY
            }
          },
          {
            name: '在线',
            type: 'line',
            symbol: 'circle',
            symbolSize: 2,
            xAxisIndex: 0,
            yAxisIndex: 0,
            markArea: {
              itemStyle: {
                normal: {
                  color: '#F0BE3D'
                }
              },
              data: vindicateY
            }
          }
        ]
      };
    // const myChart = echarts.init(document.getElementById('echart'));
    // myChart.setOption(this.option);
  }
  // 获取点检记录数据
  getTeamTallyInfo() {
    const param = {
      pageNum: this.teamTallyPageNum,
      pageSize: this.teamTallyPageSize,
      sort: 'c.check_date desc',
      filters: {
        vehicleId: this.info.vehicleId,
        startDate: this.teamTallyDateRange ? this.initDateTime(this.teamTallyDateRange[0]) : null,
        endDate: this.teamTallyDateRange ? this.initDateTime(this.teamTallyDateRange[1]) : null
      }
    };
    this.teamTallyLoading = true;
    this.teamTallyService.getTeamTallyList(param).subscribe((resData: TeamTallyServiceNs.UfastHttpAnyResModel) => {
      this.teamTallyLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.teamTallyList = this.initTeamTallyList(resData.value.list);
      this.teamTallyPageNum = resData.value.pageNum;
      this.teamTallyTotal = resData.value.total;
    }, (error: any) => {
      this.teamTallyLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  initTeamTallyList(info) {
    return info.map((item) => {
      const date = new Date(item.checkDate);
      return {
        ...item,
        checkDate: this.initDateTime(date)
      };
    });
  }
  // 获取加油记录数据
  getRefuelInfo() {
    const param = {
      pageNum: this.refuelPageNum,
      pageSize: this.refuelPageSize,
      sort: 'oil.trade_time desc',
      filters: {
        vehicleId: this.info.vehicleId,
        trade_timeGe: this.refuelDateRange ? this.initDateTime(this.refuelDateRange[0]) : null,
        trade_timeLe: this.refuelDateRange ? this.initDateTime(this.refuelDateRange[1]) : null
      }
    };
    this.refuelLoading = true;
    this.refuelCardService.getRefuelCardList(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.refuelLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.refuelList = resData.value.list;
      this.refuelTotal = resData.value.total;
    }, (error: any) => {
      this.refuelLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 获取保养记录数据
  getkeepInfo() {
    const param = {
      pageNum: this.keepPageNum,
      pageSize: this.keepPageSize,
      sort: 'maintenance_date desc',
      filters: {
        vehicleId: this.info.vehicleId,
        startTime: this.keepDateRange ? this.initDate(this.keepDateRange[0]) : null,
        endTime: this.keepDateRange ? this.initDate(this.keepDateRange[1]) : null
      }
    };
    this.keepLoading = true;
    this.maintenanceRecordService.getMaintenanceRecordList(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.keepLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.keepList = this.initKeep(resData.value.list);
      this.keepTotal = resData.value.total;
    }, (error: any) => {
      this.keepLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  initKeep(info) {
    return info.map((item) => {
      const keepContent = item.recordDetailList.map((i) => {
        return i.recordDetailItem.maintenanceItemName;
      });
      return {
        ...item,
        keepContent: keepContent.join('、')
      };
    });
  }
  // 获取维修记录数据
  getRequireInfo() {
    const param = {
      pageNum: this.requirePageNum,
      pageSize: this.requirePageSize,
      sort: 'create_date desc',
      filters: {
        vehicleId: this.info.vehicleId,
        repairStatus: this.requireStatus,
        startDate: this.requireDateRange ? this.initDateTime(this.requireDateRange[0]) : null,
        endDate: this.requireDateRange ? this.initDateTime(this.requireDateRange[1]) : null,
      }
    };
    this.requireLoading = true;
    this.vindicateRecordService.getVindicateRecordList(param).subscribe((resData: VindicateRecordServiceNs.UfastHttpAnyResModel) => {
      this.requireLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.requireList = resData.value.list;
      this.requireTotal = resData.value.total;
    }, (error: any) => {
      this.requireLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 获取速度曲线
  getSpeedLine() {
    const param = {
      vehicleId: this.info.vehicleId,
      runDate: this.initDate(this.speedLineDate)
    };
    this.cehicleListService.getSpeedLine(param).subscribe((resData: any) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.speedInfo = {
        averageSpeed: resData.value.averageSpeed,
        maxSpeed: resData.value.maxSpeed,
        numsOfIdleAlarm: resData.value.numsOfIdleAlarm,
        numsOfOverSpeedAlarm : resData.value.numsOfOverSpeedAlarm,
        overSpeed: resData.value.overSpeed
      };
      this.initSpeedLine(resData.value.speedList, resData.value.overSpeed, resData.value.maxSpeed);
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  initSpeedLine(data, overSpeed, max = 20) {
    const newDate = data.map(item => {
      return {
        name: new Date(item[1]),
        value: [item[1].replace(/\-/g, '/'), item[0]]
      };
    });
    // 获取开始结束时间
    const [start, end] = this.getStartAndEnd(this.speedLineDate);
    this.speedLineOption = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          return params.name + ' ' + params.value;
        },
        axisPointer: {
          animation: true
        }
      },
      grid: {
        left: 50,
        right: 40,
        top: 20,
        bottom: 50,
      },
      xAxis: {
        type: 'time',
        // axisLine: {show: true, onZero: false, lineStyle: {color: '#ccc'}},
        // axisTick: {show: false},
        axisLabel: {
          show: true,
          textStyle: {color: '#555'},
          formatter: function (value, index) {
            if (index === 12) {
              return '24: 00';
            }
            const date = new Date(value);
            let hour: string | number = date.getHours();
            hour = hour < 10 ? '0' + hour : hour;
            let minute: string | number = date.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            return hour + ':' + minute;
          }
        },
        splitLine: {show: false, lineStyle: {color: '#ccc'}},
        splitNumber: 12,
        axisPointer: {
          show: false,
          lineStyle: {
            color: '#478cf1',
            width: 1.5
          }
        },
        min: start.getTime(),
        max: end.getTime(),
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        },
        min: 0,
        max: (overSpeed && overSpeed > max ? overSpeed : max) + 5,
      },
      visualMap: {
        show: false,
        pieces: [{
          gt: 0,
          lte: overSpeed,
          color: '#00FF7F'
        }, {
          gt: overSpeed,
          color: '#cc0033'
        }]
      },
      series: [{
        name: '速度',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: newDate,
        markLine: {
          // silent: true,
          data: [{yAxis: overSpeed}]
        }
      }]
    };
  }
  // 获取加油曲线
  getOilLine() {
    const param = {
      vehicleId: this.info.vehicleId,
      runDate: this.initMonth(this.oilLineDate)
    };
    this.refuelRecordService.getOilLine(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.refuelLoading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      console.log(resData.value);
      this.initOilLine(resData.value.oilList);
    }, (error: any) => {
      this.refuelLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });

  }
  initOilLine(data) {
    // const dataX = ['2019/6/1', '2019/6/2', '2019/6/3', '2019/6/4', '2019/6/5', '2019/6/6', '2019/6/7'];
    const dataX = data.map(item => item.dateTime.replace(/\-/g, '/'));
    // const dataYBar = [760, 700, 600, 540, 800, 480, 510];
    const dataYBar = data.map(item => item.tradeNums);
    // const dataYLine1 = [17, 16.5, 19, 14, 18, 21.2, 22];
    const dataYLine1 = data.map(item => item.worktime);
    // const dataYLine2 = [7000, 6180, 5300, 6570, 7800, 8901, 8000];
    const dataYLine2 = data.map(item => item.mileage);
    this.oilLineOption = {
      legend: {
        data: ['加油量', '时长', '里程']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: 50,
        bottom: 50,
        right: 150
      },
      xAxis: {
        type: 'category',
        // axisLine: {show: true, onZero: false, lineStyle: {color: '#ccc'}},
        axisTick: {alignWidthLabel: true},
        axisLabel: {
          show: true,
          textStyle: {color: '#555'},
        },
        splitLine: {show: false, lineStyle: {color: '#ccc'}},
        // axisPointer: {
        //   show: false},
        data: dataX
      },
      yAxis: [{
        name: '加油量',
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        },
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            color: '#5793f3'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {color: '#5793f3'},
          formatter: '{value}升'
        },
      }, {
        name: '时长',
        type: 'value',
        position: 'right',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        },
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            color: '#21D37D'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {color: '#21D37D'},
          formatter: '{value}小时'
        },
        max: 24,
        min: 0,
        interval: 4
      }, {
        name: '里程',
        type: 'value',
        position: 'right',
        boundaryGap: [0, '100%'],
        offset: 60,
        splitLine: {
          show: false
        },
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {color: '#555'},
          formatter: '{value}千米'
        },
      }],
      series: [{
        name: '加油量',
        type: 'bar',
        yAxisIndex: 0,
        showSymbol: false,
        hoverAnimation: false,
        barMaxWidth: 30,
        itemStyle: {
          color: '#5793f3'
        },
        data: dataYBar
      }, {
        name: '时长',
        type: 'line',
        yAxisIndex: 1,
        // symbol: 'circle',
        smooth: true,
        // hoverAnimation: false,
        itemStyle: {
          color: '#21D37D',
        },
        data: dataYLine1
      }, {
        name: '里程',
        type: 'line',
        yAxisIndex: 2,
        symbol: 'none',
        smooth: true,
        hoverAnimation: false,
        itemStyle: {
          normal: {
            color: '#555',
            lineStyle: {
              color: '#555',
              type: 'dotted'
            }
          }
        },
        data: dataYLine2
      }]
    };
  }
  getRepairStatusName(status) {
    const i = this.requireStatusNodes.findIndex((item) => {
      return item.val === Number(status);
    });
    return i > -1 ? this.requireStatusNodes[i].label : '';
  }

  // 初始化日期
  initDate(data): string {
    if (!data) {
      return null;
    }
    let month = data.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = data.getDate();
    day = day < 10 ? '0' + day : day;
    return data.getFullYear() + '-' + month + '-' + day;
  }
  // 初始化日期时间
  initDateTime(data): string {
    if (!data) {
      return null;
    }
    let month = data.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = data.getDate();
    day = day < 10 ? '0' + day : day;
    let hour = data.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute = data.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second = data.getSeconds();
    second = second < 10 ? '0' + second : second;
    return `${data.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  initMonth(data): string {
    if (!data) {
      return null;
    }
    let month = data.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    return `${data.getFullYear()}-${month}`;
  }
  // 获取时长
  getRange(start, end): string {
    if (!(start && end)) {
      return '';
    }
    let startDate, endDate;
    if (typeof start === 'string') {
      startDate = new Date(start.replace(/\-g/, '-'));
    } else {
      startDate = start;
    }
    if (typeof end === 'string') {
      endDate = new Date(end.replace(/\-g/, '-'));
    } else {
      endDate = end;
    }
    let range = Math.abs(endDate.getTime() - startDate.getTime());
    const day = Math.floor(range / (24 * 3600 * 1000));
    range = range % (24 * 3600 * 1000);
    const hour = Math.floor(range / (3600 * 1000));
    range = range % (3600 * 1000);
    const minute = Math.floor(range / (60 * 1000));
    range = range % (60 * 1000);
    const second = Math.ceil(range / (1000));
    if (day) {
      return `${day}天${hour}小时${minute}分${second}秒`;
    }
    if (hour) {
      return `${hour}小时${minute}分${second}秒`;
    }
    if (minute) {
      return `${minute}分${second}秒`;
    }
    if (second) {
      return `${second}秒`;
    }
    return '0秒';
  }
  getRange2(range): string {
    let day: string | number = Math.floor(range / (24 * 3600 * 1000));
    day = day < 10 && day > 0 ? '0' + day : day;
    range = range % (24 * 3600 * 1000);
    let hour: string | number = Math.floor(range / (3600 * 1000));
    hour = hour < 10 && hour > 0 ? '0' + hour : hour;
    range = range % (3600 * 1000);
    let minute: string | number = Math.floor(range / (60 * 1000));
    minute = minute < 10 && minute > 0 ? '0' + minute : minute;
    range = range % (60 * 1000);
    const second = Math.floor(range / (1000));
    if (day) {
      return `${day}天${hour}小时${minute}分${second}秒`;
    }
    if (hour) {
      return `${hour}小时${minute}分${second}秒`;
    }
    if (minute) {
      return `${minute}分${second}秒`;
    }
    if (second) {
      return `${second}秒`;
    }
    return '0秒';
  }

  // 判断是否是同一天
  isOneDay(info) {
    if (info.length === 0) {
      return true;
    }
    let infoFirst, infoEnd;
    infoFirst = info[0].startTime ? info[0].startTime.split(' ') : info[0].endTime.split(' ');
    infoEnd = info[info.length - 1].endTime ? info[info.length - 1].endTime.split(' ')
      : info[info.length - 1].startTime.split(' ');
    const dateFirst = infoFirst[0];
    const dateEnd = infoEnd[0];
    return dateFirst === dateEnd;
  }
  // 获取0——24点
  getStartAndEnd(date) {
    const start = new Date(date.getTime());
    const end = new Date(date.getTime());
    start.setHours(0);
    start.setSeconds(0);
    start.setMinutes(0);
    end.setHours(23);
    end.setSeconds(59);
    end.setMinutes(59);
    return [start, end];
  }
  getStartAndEnd2(date) {
    const start = new Date(date.getTime());
    let end = new Date(date.getTime());
    start.setHours(0);
    start.setSeconds(0);
    start.setMinutes(0);
    end.setHours(23);
    end.setSeconds(59);
    end.setMinutes(59);
    if (end > new Date()) {
      end = new Date();
    }
    return [start, end];
  }
}
