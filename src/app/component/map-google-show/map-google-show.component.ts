import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import { LocationUtilService, LocationService, VehicleScreenService, LocationServiceNs } from '../../core/biz-services/location/location-service.service';
@Component({
  selector: 'app-map-google-show',
  templateUrl: './map-google-show.component.html',
  styleUrls: ['./map-google-show.component.scss']
})
export class MapGoogleShowComponent implements OnInit, AfterViewInit {
  @Input() showStye = 0;
  @Input() screenItem;
  @Input() status = 0;
  // @Output() gaodeZoomOutEvent = new EventEmitter<any>();
  //地图
  @ViewChild('mapScreenContainerGoogle') mapElement: ElementRef;
  public map: any;
  public maker: any;
  public zoomForOne = '12';
  public satelliteLayer: any;
  @Output() googleZoomOutEvent = new EventEmitter<any>();
  constructor(private locationService: LocationService, private locationUtilService: LocationUtilService) { }

  ngOnInit() {
    if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      this.initMap();
      this.zoomChange();
      this.proccessMaker();
    }
  }
  ngAfterViewInit() {
    if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      this.getMap();
      this.zoomChange();
      this.proccessMaker();
    }
  }
  zoomChange() {
    this.getMap().addListener('zoom_changed', () => {
      let center = this.getMap().getCenter();
      this.googleZoomOutEvent.emit({
        zoom: this.getMap().getZoom(),
        lng: center.lng(),
        lat: center.lat(),
        map: 'google'
      });
    });
    this.getMap().addListener('dragend', () => {
      let center = this.getMap().getCenter();
      this.googleZoomOutEvent.emit({
        zoom: this.getMap().getZoom(),
        lng: center.lng(),
        lat: center.lat(),
        map: 'google'
      });
    });
  }
  setZoomAndCenter(zoom, lat, lng) {
    let latLng = new google.maps.LatLng(lat,
      lng);
    this.getMap().setCenter(latLng);
    this.getMap().setZoom(zoom);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.screenItem && this.screenItem && this.screenItem.vehiclePlaceInfo) {
      this.getMap();
      this.zoomChange();
      this.proccessMaker();
    }
    if (changes.status && this.screenItem && this.screenItem.vehiclePlaceInfo) {
      this.changeGaodeMapModel();
    }
  }
  proccessMaker() {
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
    // let icon = this.locationUtilService.getGoogleIconUrlForCluster();
    //     let latLng = new google.maps.LatLng(lat,
    //       lng);

    //     let marker = new google.maps.Marker({
    //       'position': latLng,
    //       // icon: icon,
    //       map: this.getMap(),
    //       zIndex:20000
    //     });
    this.locationUtilService.getGoogleIconUrl((url: string) => {
      if (this.maker) {
        this.maker.setMap(null);
      }
      const icon = {
        url: url,
        anchor:new google.maps.Point(LocationServiceNs.OFFSET_GOOGLE_MAKER_X,LocationServiceNs.OFFSET_GOOGLE_MAKER_Y),
      };
      let latLng = new google.maps.LatLng(lat,
        lng);

      this.maker = new google.maps.Marker({
        'position': latLng,
        icon: icon,
        map: this.getMap(),
        cursor: 'auto'
      });
      this.getMap().panTo(latLng);
    }, onlineState, workState, repairState, alarmState, vehicleTypeName);
  }
  // 切换卫星状态
  changeGaodeMapModel(): void {
    const result = this.status === 1 ? 'hybrid' : 'roadmap';
    this.getMap().setMapTypeId(result);
  }
  initMap() {
    if (!this.map) {
      this.map = this.locationUtilService.getGoogleMap(this.mapElement, this.map, this.screenItem.vehiclePlaceInfo.lng, this.screenItem.vehiclePlaceInfo.lat, 17, null);
    }
  }
  getMap() {
    if (this.map) {
      return this.map;
    }
    this.initMap();
    return this.map;
  }
}
