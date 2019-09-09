import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationService, LocationServiceNs, LocationUtilService } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
declare var AMapUI: any;
@Component({
  selector: 'app-map-gaode-loc-play',
  templateUrl: './map-gaode-loc-play.component.html',
  styleUrls: ['./map-gaode-loc-play.component.scss']
})
export class MapGaodeLocPlayComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() gaodeZoomOutEvent = new EventEmitter<any>();
  /*历史轨迹 */
  @Input() screenItem;
  // screenItem = { vehiclePlaceInfo: { "vehicleId": "318053349935022080", "license": "苏CRR123", "deviceId": null, "lng": 117.24135, "lngEnc": 0.0, "lat": 28.325019, "latEnc": 0.0, "onlineState": "离线", "onlineStateKey": "0", "workState": "闲置", "workStateKey": "0", "repairState": "正常", "repairStateKey": "0", "alarmState": null, "alarmStateKey": "正常", "orgName": "江铜物流", "vehicleModelName": null, "vehicleTypeName": "装载机", "teamGroupName": null, "driverName": null, "gpsTime": null, "state": null, "userParentIds": null } };
  @Input() resultData;
  @Input() statusLoc = 0;
  public satelliteLayer: any;
  hisLocCarUrl;
  // 地图
  public hisLocMap: any;
  isLoadPathUi = false;
  pathSimplifierIns: any;
  navg1: any;
  speedRangeValue = 1000;
  hisLocData: any;
  // LocationServiceNs.HisLocModel;
  devHisLocInfo = [];
  isShowConPanel = true;
  infoShow = {
    acc: '',
    vehicleTypeName: '',
    vehicleLicense: '',
    vehicleModelName: '',
    deptName: '',
    onlineState: '0',
    alarmTypeCodeName: '',
    speed: '',
    vehicleStateName: ''
  };
  // 历史轨迹停留点
  activityList = [];
  // 历史轨迹班组信息
  workGroupByVehicleVOList = [];
  @Output() gaodeLocPlayDispOut = new EventEmitter<any>();
  constructor(private messageService: ShowMessageService,
    private locationService: LocationService,
    private locationUtilService: LocationUtilService) {
    this.speedRangeValue = 1000;
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // this.getHisLocMap();
    // if (this.resultData) {
    //   this.initHisLocData();
    // }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.resultData && !changes.firstChange) {
      this.getHisLocMap();
      if (this.resultData) {
        this.initHisLocData();
      }
    }
    if (changes.statusLoc) {
      this.changeMapModel();
    }
  }
  // 切换卫星状态
  changeMapModel(): void {
    if (this.statusLoc === 1) {
      this.satelliteLayer = new AMap.TileLayer.Satellite();
      this.getHisLocMap().add(this.satelliteLayer);
    } else {
      if (this.satelliteLayer) {
        this.getHisLocMap().remove(this.satelliteLayer);
      }
    }
  }
  clearData() {
    this.devHisLocInfo = [];
    this.hisLocData = [];
    if (this.pathSimplifierIns) {
      this.pathSimplifierIns.clearPathNavigators();
      this.pathSimplifierIns.setData(null);
      this.pathSimplifierIns = null;
    }
    this.getHisLocMap().clearMap();
  }
  /** 历史轨迹 start */
  private loadPathUI() {
    // 加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
    AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {

      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
      }

      // 启动页面
      this.initPage(PathSimplifier);
      if (this.activityList) {
        this.procStopPoint();
      };
      if (this.hisLocData && this.hisLocData[0].path && this.hisLocData[0].path.length > 0) {
        let paths = this.hisLocData[0].path;
        let i = 0;
        if (paths.length % 2 === 0) {
          i = paths.length / 2;
        } else {
          i = (paths.length + 1) / 2;
        }
        let c = new AMap.LngLat(paths[i][0], paths[i][1]);
        this.hisLocMap.setCenter(c);
      }
      // console.log(this.getHisLocMap().getAllOverlays().length);
      // console.log("ONE: " + this.getHisLocMap().getZoom());
      // this.getHisLocMap().setFitView();
      // this.getHisLocMap().setZoom(17);
      // this.getHisLocMap().setZoom(16);
      // console.log("TWO: " + this.getHisLocMap().getZoom());
    });
  }
  initPage(PathSimplifier) {
    if (!this.getHisLocMap()) {
      return;
    }
    if (!this.hisLocData || !this.hisLocData[0].path || this.hisLocData[0].path.length < 1) {
      return;
    }
    if (this.pathSimplifierIns) {
      this.pathSimplifierIns.clearPathNavigators();
    }
    // 创建组件实例
    this.pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      autoSetFitView: false,
      map: this.getHisLocMap(), // 所属的地图实例

      getPath: (pathData, pathIndex) => {
        this.processHisLocMakers(pathData.path);
        return pathData.path;
      },
      getHoverTitle: function (pathData, pathIndex, pointIndex) {
        // 返回鼠标悬停时显示的信息
        if (pointIndex >= 0) {
          // b鼠标悬停在某个轨迹节点上
          // console.log("pathDATA" + pathData);
          // console.log("pathIndex" + pathIndex);
          // console.log("pointIndex" + pointIndex);
          let item = pathData.path[pointIndex];

          return "时间：" + item[2] + ' 点所在的位置:' + (pointIndex + 1) + '/' + pathData.path.length;
        }
        // 鼠标悬停在节点之间的连线上
        return pathData.name + '：点数量' + pathData.path.length;
      },
      renderOptions: {
        // 轨迹线的样式
        pathLineStyle: {
          strokeStyle: LocationServiceNs.HISLOC_LINE_COLOR,
          lineWidth: LocationServiceNs.HISLOC_LINE_WIDTH,
          dirArrowStyle: true
        }
      }
    });
    this.pathSimplifierIns.setData(this.hisLocData);
    // this.pathSimplifierIns.setFitView(0);
    // const url = this.hisLocCarUrl ? this.hisLocCarUrl : '/assets/image/car-icon.png';
    const url = '/assets/image/car-icon.png';
    // console.log("car url " + url);
    this.navg1 = this.pathSimplifierIns.createPathNavigator(0, {
      loop: false, // 轨迹是否循环播放
      speed: this.speedRangeValue,
      pathNavigatorStyle: {
        width: 18,
        height: 40,
        // 使用图片
        content: PathSimplifier.Render.Canvas.getImageContent(url, onload, onerror),
        lineWidth: 3,
        strokeStyle: null,
        fillStyle: null,
        autoRotate: true,
        // 经过路径的样式
        pathLinePassedStyle: {
          lineWidth: LocationServiceNs.HISLOC_PASSED_LINE_WIDTH,
          strokeStyle: LocationServiceNs.HISLOC_PASSED_LINE_COLOR,
          dirArrowStyle: {
            stepSpace: 15,
            strokeStyle: 'red'
          }
        }
      }
    });
    this.navg1.showPathDatas = this.pathSimplifierIns.getPathData(0).path;
    this.navg1.on('move', this.refreshDeviceInfo.bind(this));
  }
  /**
   *cc状态  Acc开启状态  1开启  0关闭
5	String	否	怠速状态 Integer 1怠速 0正常（暂定）
   * @param e
   */
  public refreshDeviceInfo(e) {
    // const self = this;
    const navg1 = e.target;
    const id = navg1.getCursor().idx;
    let info = navg1.showPathDatas[id];
    // $('#gpstimep').html('时间：' + this.devHisLocInfo[2]);
    this.devHisLocInfo[0] = info[2];
    let accState = '';
    if ('1' === info[4]) {
      accState = '打开';
    } else {
      accState = '关闭';
    }
    // $('#vehState').html('ACC状态：' + accState);
    this.devHisLocInfo[1] = accState;
    // $('#speedp').html('速度：' + this.devHisLocInfo[6]);
    this.devHisLocInfo[2] = info[6] + ' km/h';
    // const st = this.devHisLocInfo[5] === 1 ? '怠速' : '正常';
    let st = '';
    if ('1' === info[5]) {
      st = '怠速';
    } else {
      st = '正常';
    }
    // $('#alarmState').html('怠速状态：' + st);
    this.devHisLocInfo[3] = st;
    let workGroupInfo = procWorkGroupInfo(this.workGroupByVehicleVOList, info[2]);
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

  processHisLocMakers(path) {
    for (let i = 0; i < path.length; i++) {
      const pathItem = path[i];
      if (i === 0) {
        // 创建一个 Icon
        const startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(25, 34),
          // 图标的取图地址
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          // 图标所用图片大小
          imageSize: new AMap.Size(135, 40),
          // 图标取图偏移量
          imageOffset: new AMap.Pixel(-9, -3)
        });
        const mapInfo = { map: this.getHisLocMap(), icon: startIcon, point: pathItem };
        this.locationUtilService.addMaker(mapInfo, null);
      }
      if (i === (path.length - 1)) {
        // 创建一个 icon
        const endIcon = new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          imageSize: new AMap.Size(135, 40),
          imageOffset: new AMap.Pixel(-95, -3)
        });
        const mapInfo = { map: this.getHisLocMap(), icon: endIcon, point: pathItem };
        this.locationUtilService.addMaker(mapInfo, null);
      }
      /**
      if (true === pathItem[9]) {
        const mapIn = {
          map: this.getHisLocMap(),
          point: pathItem,
          icons: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png'
        };
        const title = '停留信息';
        const content = [];
        content.push('<span style="text-align:right" class="col-sm-4">班组：</span><span class="col-sm-8">' + pathItem[6] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">司机：</span><span class="col-sm-8">' + pathItem[7] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">时间：</span><span class="col-sm-8">' + pathItem[2] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">时长：</span><span class="col-sm-8">' + pathItem[10] + '</span> </br> ');

        // const footContent = '<div style='text-align: right;padding: 5px'>
        // <img src='../../../static/common/images/weibode.png' alt=''>
        // <a href='javascript:void(0)' onclick='alertdata(\'' + vehicleId + '\')'>详细信息</a></div>';

        const infWin = { map: this.getHisLocMap(), title: title, content: content };
        this.locationUtilService.addMaker(mapIn, infWin);

        // maker.infww = this.locationUtilService.createInfoWindow(infWin);

        // //给Marker绑定单击事件
        // maker.on('click', this.markerClick);

      } */
    }
  }
  procStopPoint() {
    let showList = this.locationUtilService.procHisLocActivityBusiness(this.activityList, this.workGroupByVehicleVOList);
    if (showList.length > 0) {
      for (let i = 0; i < showList.length; i++) {
        let item = showList[i];
        // 创建一个 Icon
        const icon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(25, 34),
          // 图标的取图地址
          image: '/assets/image/mapgoogle/pass.png',
          // 图标取图偏移量
          //imageOffset: new AMap.Pixel(-9, -3)
        });
        const mapIn = {
          map: this.getHisLocMap(),
          point: item[0],
          icon: icon
        };
        const title = '停留信息';
        const content = [];
        content.push('<span style="text-align:right" class="col-sm-4">班组：</span><span class="col-sm-8">' + item[3][0] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">司机：</span><span class="col-sm-8">' + item[3][1] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">时间：</span><span class="col-sm-8">' + item[1] + '</span> </br> ');
        content.push('<span style="text-align:right" class="col-sm-4">时长：</span><span class="col-sm-8">' + item[2] + '</span> </br> ');

        // const footContent = '<div style='text-align: right;padding: 5px'>
        // <img src='../../../static/common/images/weibode.png' alt=''>
        // <a href='javascript:void(0)' onclick='alertdata(\'' + vehicleId + '\')'>详细信息</a></div>';

        const infWin = { map: this.getHisLocMap(), title: title, content: content };
        this.locationUtilService.addMaker(mapIn, infWin);
      }
    }
  }
  initHisLocData() {
    this.hisLocData = this.locationUtilService.procHisLocResItem(this.resultData);
    this.activityList = this.locationUtilService.procHisLocActivityList(this.resultData);
    this.workGroupByVehicleVOList = this.locationUtilService.procHisLocWorkGroup(this.resultData);
    this.loadPathUI();
    // console.log(this.screenItem);
    /**
     if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      const data = this.screenItem;
      const onlineState = data.vehiclePlaceInfo.onlineState;//在线状态
      const workState = data.vehiclePlaceInfo.workState;//工作状态
      const repairState = data.vehiclePlaceInfo.repairState;//维修状态
      const alarmState = data.vehiclePlaceInfo.alarmState;//报警状态
      const vehicleTypeName = data.vehiclePlaceInfo.vehicleTypeName;//车型名称

      this.locationUtilService.getGoogleIconUrl((url: string) => {
        this.hisLocCarUrl = url;
      }, onlineState, workState, repairState, alarmState, vehicleTypeName);
    }*/
  }
  getHisLocMap() {
    if (this.hisLocMap) {
      return this.hisLocMap;
    }
    let lng = null;
    let lat = null;
    if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      lng = this.screenItem.vehiclePlaceInfo.lng; // 偏移经度
      lat = this.screenItem.vehiclePlaceInfo.lat; // 偏移纬度
    }
    if (null == lng || null == lat) {
      lng = 117.24135;
      lat = 28.325019;
    }
    const hisLocMap = new AMap.Map('hisLocMapDiv', {
      resizeEnable: true,
      center: [lng, lat],
      zoom: LocationServiceNs.ZOOM_LOC_PALY
    });
    // AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],
    //   () => {
    //     const toolbar = new AMap.ToolBar();
    //     hisLocMap.addControl(toolbar);
    //   });
    this.hisLocMap = hisLocMap;
    this.locationUtilService.gaodeZoomChangeEvent(this.hisLocMap,this.gaodeZoomOutEvent);
    return this.hisLocMap;
  }
  /** 历史轨迹 end */
}
