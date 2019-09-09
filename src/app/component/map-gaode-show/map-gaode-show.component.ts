import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationUtilService, LocationService, VehicleScreenService, LocationServiceNs } from '../../core/biz-services/location/location-service.service';
declare var AMapUI: any;
@Component({
  selector: 'app-map-gaode-show',
  templateUrl: './map-gaode-show.component.html',
  styleUrls: ['./map-gaode-show.component.scss']
})
export class MapGaodeShowComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() showStye = 0;
  @Input() screenItem;
  @Input() status = 0;
  @Output() gaodeZoomOutEvent = new EventEmitter<any>();
  //地图
  @ViewChild('mapScreenContainer') mapElement: ElementRef;
  public map: any;
  public maker: any;
  public zoomForOne = '12';
  public satelliteLayer: any;
  //定义IconLable的默认样式
  defaultLabel = {
    //设置样式
    style: {
      color: '#f55707',
      fontSize: '120%',
      marginTop: '15px'
    }
  }
  defaultStyle = {
    src: '../../../static/common/images/poi-green.png',
    style: {
      width: '30px',
      height: '30px'
    }
  };
  private i: number = 0;
  constructor(private locationService: LocationService, private locationUtilService: LocationUtilService) { }

  ngOnInit() {
    if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      this.getMap();
      this.zoomChangeEvent();
      this.proccessMaker();
    }
  }
  ngAfterViewInit() {
    if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      this.getMap();
      this.zoomChangeEvent();
      this.proccessMaker();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.screenItem && this.screenItem && this.screenItem.vehiclePlaceInfo) {
      // console.log('gaode ' + this.i++);
      this.getMap();
      this.zoomChangeEvent();
      this.proccessMaker();
    }
    if (changes.status) {
      this.changeGaodeMapModel();
      // if(this.maker){
      //   this.getMap().addMaker(this.maker);
      // }
      // this.proccessMaker();
    }
  }
  zoomChangeEvent() {
    this.getMap().on('zoomchange', (e) => {
      let center = this.getMap().getCenter();
      this.gaodeZoomOutEvent.emit({
        zoom: this.getMap().getZoom(),
        lng: center.getLng(),
        lat: center.getLat(),
        map: 'gaode'
      });
    });
    this.getMap().on('dragend', (e) => {
      // this.i++;
      // console.log("GaoDe_dragend；第" + this.i + "次；zoom:" + this.getMap().getZoom());
      let center = this.getMap().getCenter();
      // console.log("GaoDe_dragend；第" + this.i + "次；center:" + center.lng + "," + center.lat);
      this.gaodeZoomOutEvent.emit({
        type: 'drag',
        zoom: this.getMap().getZoom(),
        lng: center.getLng(),
        lat: center.getLat(),
        map: 'gaode'
      });
    });
  }
  // 切换卫星状态
  changeGaodeMapModel(): void {
    if (this.status === 1) {
      this.satelliteLayer = new AMap.TileLayer.Satellite();
      // this.getMap().setLayers([this.satelliteLayer]);
      this.getMap().add(this.satelliteLayer);
    } else {
      if (this.satelliteLayer) {
        this.getMap().remove(this.satelliteLayer);
      }
    }
  }
  proccessMaker() {
    this.getMap().clearMap();
    let data = this.screenItem;
    let vehicleId = data.vehiclePlaceInfo.vehicleId;//车辆id
    let lng = data.vehiclePlaceInfo.lng;//偏移经度
    let lat = data.vehiclePlaceInfo.lat;//偏移纬度
    let license = data.vehiclePlaceInfo.license;//车牌号
    let onlineState = data.vehiclePlaceInfo.onlineState;//在线状态
    let workState = data.vehiclePlaceInfo.workState;//工作状态
    let repairState = data.vehiclePlaceInfo.repairState;//维修状态
    let alarmState = data.vehiclePlaceInfo.alarmState;//报警状态
    let orgName = data.vehiclePlaceInfo.orgName;//机构名称
    let vehicleTypeName = data.vehiclePlaceInfo.vehicleTypeName;//车型名称
    let teamGroupName = data.vehiclePlaceInfo.teamGroupName;//班组名称
    let driverName = data.vehiclePlaceInfo.driverName;//司机名
    let gpsTime = data.vehiclePlaceInfo.gpsTime;//sps时间
    if ("null" == gpsTime) {
      gpsTime = "";
    }
    let pic = this.locationUtilService.getPicContainer(vehicleTypeName, onlineState, workState, repairState, alarmState);
    let title = license;
    let content = [];
    content.push("<span style='text-align:right' class='col-sm-4'>机构：</span><span class='col-sm-8'>" + orgName + "</span> </br> ");
    content.push("<span style='text-align:right' class='col-sm-4'>类型：</span><span class='col-sm-8'>" + vehicleTypeName + "</span> </br> ");
    content.push("<span style='text-align:right' class='col-sm-4'>班组：</span><span class='col-sm-8'>" + teamGroupName + "</span> </br> ");
    content.push("<span style='text-align:right' class='col-sm-4'>司机：</span><span class='col-sm-8'>" + driverName + "</span> </br> ");
    content.push("<span style='text-align:right' class='col-sm-4'>报警：</span><span class='col-sm-8'>" + alarmState + "</span> </br> ");
    content.push("<span style='text-align:right' class='col-sm-4'>时间：</span><span class='col-sm-8'>" + gpsTime + "</span> </br> ");
    const pathItem = [lng, lat];
    // const infoWin = { map: this.getMap(), title: title, content: content };
    const mapInfo = { map: this.getMap(), pic: pic, point: pathItem };
    let maker = this.locationUtilService.addMakerForShow(mapInfo, null);
    this.getMap().setFitView(maker);
  }
  public getMap() {
    if (this.map) {
      return this.map;
    }
    this.map = this.locationUtilService.getGaodeMap(this.mapElement, this.map, this.screenItem.vehiclePlaceInfo.lng, this.screenItem.vehiclePlaceInfo.lat, 17);
    return this.map;
  }
}
