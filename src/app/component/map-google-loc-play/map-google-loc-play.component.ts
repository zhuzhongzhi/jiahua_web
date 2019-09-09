import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationService, LocationServiceNs, LocationUtilService } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
@Component({
  selector: 'app-map-google-loc-play',
  templateUrl: './map-google-loc-play.component.html',
  styleUrls: ['./map-google-loc-play.component.scss']
})
export class MapGoogleLocPlayComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() googleZoomOutEvent = new EventEmitter<any>();
  @Input() screenItem;
  @Input() resultData;
  @Input() statusLoc = 0;
  @Output() gaodeLocPlayDispOut = new EventEmitter<any>();
  //地图
  @ViewChild('hisLocMapDivGoo') mapElement: ElementRef;
  // 地图
  public hisLocMap: any;
  private timer;
  devHisLocInfo = [];
  hisLocData: any = [];
  polyline: any;
  passedPolylines: any = [];
  passedPolyline: any;
  passedPolylineWithIcon: any;
  // 历史轨迹停留点
  activityList = [];
  // 历史轨迹班组信息
  workGroupByVehicleVOList = [];
  public makersGoo: any = [];
  @Input() speedRangeValueLoc = 100;
  speedRangeValue = 2000;
  maxSpeedRangeValue = 120000;
  speed = this.maxSpeedRangeValue / this.speedRangeValue;
  tripCount: number = 0;
  makerMove: any = null;
  constructor(private messageService: ShowMessageService,
    private locationService: LocationService,
    private locationUtilService: LocationUtilService) {
    this.tripCount = 0;
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resultData) {
      this.getHisLocMap();
      if (this.resultData) {
        this.initHisLocData();
      }
    }
    if (changes.statusLoc) {
      this.changeMapModel();
    }
  }
  setZoomAndCenter(zoom, lat, lng) {
    let latLng = new google.maps.LatLng(lat,
      lng);
    this.getHisLocMap().setCenter(latLng);
    this.getHisLocMap().setZoom(zoom);
  }
  // 销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  initMap() {
    if (!this.hisLocMap) {
      let lng = null;
      let lat = null;
      if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
        lng = this.screenItem.vehiclePlaceInfo.lng; // 偏移经度
        lat = this.screenItem.vehiclePlaceInfo.lat; // 偏移纬度
      }
      this.hisLocMap = this.locationUtilService.getGoogleMap(this.mapElement, this.hisLocMap, lng, lat, LocationServiceNs.ZOOM_LOC_PALY, null);
      this.locationUtilService.googleZoomAndDragendChange(this.hisLocMap, this.googleZoomOutEvent);
    }
  }
  getHisLocMap() {
    if (this.hisLocMap) {
      return this.hisLocMap;
    }
    this.initMap();
    return this.hisLocMap;
  }
  changeMapModel() {
    const result = this.statusLoc === 1 ? 'hybrid' : 'roadmap';
    this.getHisLocMap().setMapTypeId(result);
  }
  clearData() {
    this.devHisLocInfo = [];
    this.hisLocData = [];
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    if (this.makersGoo.length > 0) {
      this.clearMarkers();
      this.makersGoo = [];
    }
    if (this.makerMove) {
      this.makerMove.setMap(null);
    }
  }
  initNum() {
    this.tripCount = 0;
    if (this.passedPolylines.length > 0) {
      for (let i = 0; i < this.passedPolylines.length; i++) {
        let passedPolyline = this.passedPolylines[i];
        passedPolyline.setMap(null);
        passedPolyline = null;
      }
      this.passedPolylines = [];
      this.passedPolylineWithIcon = null;
    }
    if (this.passedPolyline) {
      this.passedPolyline.setMap(null);
      this.passedPolyline = null;
    }
  }
  initPassedPolyline() {
    this.tripCount = 0;
    if (this.passedPolylines.length > 0) {
      for (let i = 0; i < this.passedPolylines.length; i++) {
        let passedPolyline = this.passedPolylines[i];
        passedPolyline.setMap(null);
        // passedPolyline = null;
      }
      this.passedPolylines = [];
      this.passedPolylineWithIcon = null;
    }
    if (this.passedPolyline) {
      this.passedPolyline.setMap(null);
      this.passedPolyline = null;
    }
  }
  initHisLocData() {
    this.hisLocData = this.locationUtilService.procHisLocResItemForGoogle(this.resultData);
    if (!this.hisLocData || this.hisLocData.length < 1) {
      return;
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.initNum();
    let i = 0;
    if (this.hisLocData.length % 2 === 0) {
      i = this.hisLocData.length / 2;
    } else {
      i = (this.hisLocData.length + 1) / 2;
    }
    this.getHisLocMap().setCenter(this.hisLocData[i]);
    this.activityList = this.locationUtilService.procHisLocActivityList(this.resultData);
    this.workGroupByVehicleVOList = this.locationUtilService.procHisLocWorkGroup(this.resultData);
    this.procHisLocLine(this.hisLocData);
    this.procStartAndEndPoint();
    this.procStopPoint();
  }
  procStartAndEndPoint() {
    if (!this.hisLocData || this.hisLocData.length < 1) {
      return;
    }
    let start = this.hisLocData[0];
    const icon = {
      url: '/assets/image/mapgoogle/start.png'
    };
    let markerStart = new google.maps.Marker({
      'position': start,
      // label: '起',
      icon: icon,
      map: this.getHisLocMap(),
    });
    const l = this.hisLocData.length;
    let end = this.hisLocData[l - 1];
    const iconEnd = {
      url: '/assets/image/mapgoogle/end.png'
    };
    let markerEnd = new google.maps.Marker({
      'position': end,
      // label: '终',
      icon: iconEnd,
      map: this.getHisLocMap(),
    });
    this.makersGoo.push(markerStart);
    this.makersGoo.push(markerEnd);

  }
  procStopPoint() {
    let showList = this.locationUtilService.procHisLocActivityBusiness(this.activityList, this.workGroupByVehicleVOList);
    if (showList.length > 0) {
      for (let i = 0; i < showList.length; i++) {
        let item = showList[i];
        const title = '停留信息';
        const content = [];
        content.push('<span style="text-align:right" class="col-sm-4">班组：</span><span class="col-sm-8">' + item[3][0] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">司机：</span><span class="col-sm-8">' + item[3][1] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">时间：</span><span class="col-sm-8">' + item[1] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">时长：</span><span class="col-sm-8">' + item[2] + '</span> </br> ');
        let infoWin = this.createInfoWindow(title, content.join('<br>'));
        let infowindow = new google.maps.InfoWindow({
          content: infoWin
        });
        let latLng = new google.maps.LatLng(item[0][1],
          item[0][0]);
        const icon = {
          url: '/assets/image/mapgoogle/pass.png'
        };
        let marker = new google.maps.Marker({
          'position': latLng,
          icon: icon,
          map: this.getHisLocMap(),
        });
        marker.addListener('click', () => {
          infowindow.open(this.getHisLocMap(), marker);
        });
        this.makersGoo.push(marker);
      }
    }
  }
  // 创建信息弹框
  createInfoWindow(title, content) {
    const info = document.createElement('div');
    info.className = 'info';

    // 可以通过下面的方式修改自定义窗体的宽高
    // info.style.width = "400px";
    // 定义顶部标题
    const top = document.createElement('div');
    const titleD = document.createElement('div');
    titleD.className = 'goo-infwin-title';
    titleD.innerHTML = title;
    // titleD.onclick = showDetails_ifram;

    top.appendChild(titleD);
    // top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    const middle = document.createElement('div');
    middle.className = 'info-middle';
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    return info;
  }
  clearMarkers() {
    this.setMapOnAll(null);
  }
  setMapOnAll(map) {
    if (null != this.makersGoo && this.makersGoo.length > 0) {
      for (let i = 0; i < this.makersGoo.length; i++) {
        this.makersGoo[i].setMap(map);
      }
    }
  }
  procHisLocLine(hisLocData) {
    // let lineSymbol = {
    //   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //   //scale: 2,
    //   strokeColor: '#FFFF00'
    // };
    this.polyline = new google.maps.Polyline({
      path: hisLocData,
      // icons: [{
      //   icon: lineSymbol,
      //   offset: '0%'
      // }],
      strokeColor: LocationServiceNs.HISLOC_LINE_COLOR,
      strokeWeight: LocationServiceNs.HISLOC_LINE_WIDTH,
      map: this.getHisLocMap()
    });
  }

  animateCircle(line, speed) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    console.log(speed);
    if (0 === speed) {
      speed = 1;
    }
    speed = 1000 / speed;
    console.log(speed);
    // let count = 0;
    this.timer = setInterval(() => {
      // count = (count + 1) % 200;
      /**
      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons); */
      let passedLineData = this.hisLocData.slice(0, this.tripCount);
      /***/
      let lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        //scale: 2,
        //fillColor: '#FFFF00',
        fillColor: '#05BE00',
        fillOpacity: 1,
        //strokeColor: '#FFFF00'
        strokeColor: '#05BE00'
      };
      if (this.passedPolylineWithIcon) {
        // this.passedPolylineWithIcon.set('icons', null);
        // this.passedPolylineWithIcon.setPath([]);
        this.passedPolylineWithIcon.set('icons', null);
      }
      this.passedPolylineWithIcon = new google.maps.Polyline({
        path: passedLineData,
        strokeColor: LocationServiceNs.HISLOC_PASSED_LINE_COLOR,
        strokeWeight: LocationServiceNs.HISLOC_PASSED_LINE_WIDTH,
        map: this.getHisLocMap(),
        icons: [{
          icon: lineSymbol,
          offset: '100%'
        }],
      });
      this.passedPolylines.push(this.passedPolylineWithIcon);
      /**
     if (this.passedPolyline) {
       this.passedPolyline.setMap(null);
       this.passedPolyline = null;
     }
     this.passedPolyline = new google.maps.Polyline({
       path: passedLineData,
       strokeColor: LocationServiceNs.HISLOC_PASSED_LINE_COLOR,
       strokeWeight: LocationServiceNs.HISLOC_PASSED_LINE_WIDTH,
       map: this.getHisLocMap()
     }); */
      let itemMaker = this.hisLocData[this.tripCount];
      this.refreshDeviceInfo(itemMaker);
      /** 
       if (this.makerMove) {
        this.makerMove.setMap(null);
      }
      const icon = {
        // url: '/assets/image/trail-option.png'
        url: '/assets/image/car-icon-0.png'
      };
      let latLng = new google.maps.LatLng(itemMaker.lat,
        itemMaker.lng);

      this.makerMove = new google.maps.Marker({
        'position': latLng,
        icon: icon,
        map: this.getHisLocMap(),
        cursor: 'auto'
      });*/
      //终点停车
      if (this.tripCount >= this.hisLocData.length) {
        this.pause();
      }
      this.tripCount++;
      // if ((count / 2) >= 99) {
      //   this.pause();
      // }
    }, speed);
  }
  /**
   *cc状态  Acc开启状态  1开启  0关闭
5	String	否	怠速状态 Integer 1怠速 0正常（暂定）
   * @param e
   */
  public refreshDeviceInfo(itemMaker) {
    if (null == itemMaker) {
      return;
    }
    this.devHisLocInfo[0] = itemMaker.time;
    let accState = '';
    if ('1' === itemMaker.accstate) {
      accState = '打开';
    } else {
      accState = '关闭';
    }
    this.devHisLocInfo[1] = accState;
    this.devHisLocInfo[2] = itemMaker.speed + ' km/h';
    // const st = this.devHisLocInfo[5] === 1 ? '怠速' : '正常';
    let st = '';
    if ('1' === itemMaker.daisu) {
      st = '怠速';
    } else {
      st = '正常';
    }
    this.devHisLocInfo[3] = st;
    let workGroupInfo = procWorkGroupInfo(this.workGroupByVehicleVOList, itemMaker.time);
    // $('#teamGroup').html('班组：' + workGroupInfo[0]);
    this.devHisLocInfo[4] = workGroupInfo[0];
    // $('#driver').html('司机：' + workGroupInfo[1]);
    this.devHisLocInfo[5] = workGroupInfo[1];
    this.gaodeLocPlayDispOut.emit(this.devHisLocInfo);
    function procWorkGroupInfo(workGroup, time) {
      let ti = convertMsgtimeToDate(time);
      if (workGroup) {
        for (let i = 0; i < workGroup.length; i++) {
          let item = workGroup[i];
          let startTime = item.startTime;
          if (startTime.length < 5) {
            startTime = '0' + startTime;
          }
          let endTime = item.endTime;
          let startDate = convertMsgtimeToDate(item.arrangeDate + " " + startTime);
          let endDate = convertMsgtimeToDate(item.arrangeDate + " " + endTime);
          let isBetween = isBetweenStimeAndEndTime(startDate, endDate, ti);
          if (isBetween) {
            return [item.workGroupName, item.workPersonnelName];
          }
        }
      }
      return ['', ''];
    }
    function convertMsgtimeToDate(date: string) {
      return new Date(date)
    }
    function isBetweenStimeAndEndTime(startTime, endTime, compTime) {
      if (compTime.getTime() >= startTime.getTime() && compTime.getTime <= endTime.getTime) {
        return true;
      }
      return false;
    }
  }
  pause() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  start(speed) {
    this.initNum();
    this.initPassedPolyline();
    if (this.polyline) {
      // const speed = this.maxSpeedRangeValue / (this.speedRangeValueLoc * 2);
      this.animateCircle(this.polyline, speed);
    }
  }
  refresh() {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    if (this.hisLocData) {
      this.initNum();
      this.initPassedPolyline();
      this.procHisLocLine(this.hisLocData);
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  }
  changeSpeed(speedRangeValue) {
    this.pause();
    this.start(speedRangeValue);
    // if (this.timer) {
    //   clearInterval(this.timer);
    //   const speed = this.maxSpeedRangeValue / (speedRangeValue * 2);
    //   this.animateCircle(this.polyline, speed);
    // }
  }
}
