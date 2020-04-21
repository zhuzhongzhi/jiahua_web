import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LocationService, LocationServiceNs, LocationUtilService} from '../../core/biz-services/location/location-service.service';
import {MapGaodeShowComponent} from '../map-gaode-show/map-gaode-show.component';
import {MapGoogleShowComponent} from '../map-google-show/map-google-show.component';
import {TerminalServiceNs} from '../../core/biz-services/resource/terminal.service';
import {CehicleListService} from '../../core/biz-services/vehicleMonitor/cehicle-list.service';
import {ShowMessageService} from '../../widget/show-message/show-message';

@Component({
  selector: 'app-cehicle-detail-model',
  templateUrl: './cehicle-detail-model.component.html',
  styleUrls: ['./cehicle-detail-model.component.scss']
})
export class CehicleDetailModelComponent implements OnInit {

  // 切换地图，高德地图——1，谷歌地图——2
  showGaoDe = 1;
  // 单选按钮值，标准或卫星地图——标准是‘0’，卫星是‘1’
  radioMapValue = 0;
  currentZoomAndCenter: any = null;
  @ViewChild('gaodeShow')
  private gaodeShow: MapGaodeShowComponent;
  @ViewChild('googleShow')
  private googleShow: MapGoogleShowComponent;
  @Input() info;
  baseMap;
  screenItem = {};
  // 定义IconLable的默认样式
  defaultLabel = {
    // 设置样式
    style: {
      color: '#f55707',
      fontSize: '120%',
      marginTop: '15px'
    }
  };
  defaultStyle = {
    src: '../../../static/common/images/poi-green.png',
    style: {
      width: '30px',
      height: '30px'
    }
  };
  posInfo = {
    lat: null,
    lng: null,
    latEnc: null,
    lngEnc: null,
    address: null,
    alarmAddress: null
  };
  vehicleInfo = {
    vehicleModelName: '',
    vehicleTypeName: ''
  };

  constructor(private locationUtilService: LocationUtilService,
              private locationService: LocationService,
              private messageService: ShowMessageService) {
  }

  ngOnInit() {
    this.getInfo();
    // this.getBaseMap();
    const address = this.info.province + this.info.city + this.info.area + this.info.road;
    this.posInfo = {
      lat: this.info.posNum[0],
      lng: this.info.posNum[1],
      latEnc: this.info.posEncNum[0],
      lngEnc: this.info.posEncNum[1],
      address: '',
      alarmAddress: address
    };
    console.log(this.posInfo);
    this.locationUtilService.lngLatToLoc([this.info.posEncNum[1], this.info.posEncNum[0]], this.posInfo);
    // const lng = this.info.posNum[1]; // 偏移经度
    // const lat = this.info.posNum[0]; // 偏移纬度
    // if (lng || lat) {
    //   this.addMaker();
    // }
  }

  // 同步比例尺
  zoomOutFromChild(e) {
    this.currentZoomAndCenter = e;
    this.changeMapZoomAndCenter();
  }

  changeMapZoomAndCenter() {
    if (this.currentZoomAndCenter) {
      if (this.currentZoomAndCenter.map === 'google') {
        this.gaodeShow.getMap().setZoomAndCenter(this.currentZoomAndCenter.zoom,
          [this.currentZoomAndCenter.lng, this.currentZoomAndCenter.lat]);
      }
      if (this.currentZoomAndCenter.map === 'gaode') {
        this.googleShow.setZoomAndCenter(this.currentZoomAndCenter.zoom, this.currentZoomAndCenter.lat, this.currentZoomAndCenter.lng);
      }
    }
  }

  // 卫星地图与道路地图切换
  changeSelectedMap() {
    this.radioMapValue = this.radioMapValue === 0 ? 1 : 0;
  }

  getInfo() {
    // 获取车辆信息
    this.locationService.getVehiclesMapDataNotExist({vehicleId: this.info.vehicleId})
      .subscribe((res: LocationServiceNs.UfastHttpAnyResModel) => {
        // if (!(null != res.value && res.value.length > 0)) {
        //   this.messageService.showAlertMessage('', '车辆不存在', 'error');
        //   return false;
        // }
        const item = res.value[0];
        item.lat = this.info.posEncNum[0];
        item.latEnc = this.info.posEncNum[0];
        item.lng = this.info.posEncNum[1];
        item.lngEnc = this.info.posEncNum[1];
        item.onlineState = '';
        item.workState = '';
        item.repairState = '';
        item.alarmState = '报警';
        this.screenItem = {vehiclePlaceInfo: item};
        console.log(this.screenItem);
        this.vehicleInfo = {
          vehicleModelName: item.vehicleModelName,
          vehicleTypeName: item.vehicleTypeName
        };
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
  }

  addMaker() {
    const lng = this.info.posNum[1]; // 偏移经度
    const lat = this.info.posNum[0]; // 偏移纬度
    const pic = this.locationUtilService.getPicContainer(this.info.type,
      this.info.onlineStateName, this.info.workStateName,
      this.info.repairStateName, this.info.alarmStateName);
    const maker = new AMap.Marker({
      position: [parseFloat(lng), parseFloat(lat)],
      content: pic,
      offset: new AMap.Pixel(LocationServiceNs.OFFSET_GAODE_MAKER_X, LocationServiceNs.OFFSET_GAODE_MAKER_Y),
      title: '',
      iconLabel: this.defaultLabel,
      iconStyle: this.defaultStyle,
      map: this.getBaseMap(),
    });
    this.getBaseMap().add(maker);
  }

  private getBaseMap() {
    const self = this;
    if (this.baseMap) {
      return this.baseMap;
    }
    let lng = this.info.posNum[1]; // 偏移经度
    let lat = this.info.posNum[0]; // 偏移纬度
    if (null == lng || null == lat) {
      lng = 117.24135;
      lat = 28.325019;
    }
    this.baseMap = new AMap.Map('map', {
      resizeEnable: true,
      center: [parseFloat(lng), parseFloat(lat)],
      zoom: 11
    });
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],
      () => {
        const toolbar = new AMap.ToolBar();
        self.baseMap.addControl(toolbar);
      });
    return this.baseMap;
  }

}
