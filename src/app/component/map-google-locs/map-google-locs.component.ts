import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LocationUtilService, LocationService, LocationServiceNs } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
declare let google: any;

@Component({
  selector: 'app-map-google-locs',
  templateUrl: './map-google-locs.component.html',
  styleUrls: ['./map-google-locs.component.scss']
})
export class MapGoogleLocsComponent implements OnInit, AfterViewInit, OnChanges {
  map: any;
  @ViewChild('googleMapContainer') googleMapElement: ElementRef;
  @Input() status = 0;
  @Input() vehicles = [];
  @Input() isScreen: boolean = false;
  @Output() googleZoomOutEvent = new EventEmitter<any>();
  // googleZoom;
  // public vehiclesGoo: LocationServiceNs.UfastHttpVehiclesMapResModel[];
  public makersGoo: any = [];
  public makersGooMap: any = [];
  public makersDistGoo: any = [];
  public totalNumGoo: number;
  public distClusterGoo: any;
  detailInfo = {
    vehicleId: '',
    deviceId: ''
  };
  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    errTxt: '',
    showContinue: false,
    showSaveBtn: false
  };
  // 是否第一次加载map
  // fristMap = true;
  // loadMapZoom:number;
  infoWinsForSearch = [];
  constructor(private locationService: LocationService,
    private locationUtilService: LocationUtilService, private messageService: ShowMessageService) {
  }

  ngOnInit() {
    const map = this.getMap();
  }
  ngAfterViewInit() {
    // const map = this.getMap();
    // if (!map) {
    //   return;
    // }
    // this.loadMapDistrictClusterAndMakers();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.vehicles) {
      const map = this.getMap();
      this.refreshMapDistrictClusterAndMakers();
    }
    if (changes.status) {
      if (!this.isScreen) {
        this.setMap();
      }
    }
  }
  setZoomAndCenter(zoom, lat, lng) {
    let latLng = new google.maps.LatLng(lat,
      lng);
    this.getMap().setCenter(latLng);
    this.getMap().setZoom(zoom);
  }
  loadMapDistrictClusterAndMakers() {
    // console.log('refresh(googlezoom小于11)现在的层级：' + this.getMap().getZoom());
    if (this.getMap().getZoom() <= 11) {
      this.initDistrictCluster();
      this.clearMarkers();
    } else {
      if (this.distClusterGoo) {
        this.removeDistrictClusterMakers();
      }
      this.addMakers();
    }
  }
  refreshMapDistrictClusterAndMakers() {
    // console.log('refresh(vehgooglezoom小于11)现在的层级：' + this.getMap().getZoom());
    if (this.getMap().getZoom() <= 11) {
      this.refreshDistrictCluster();
      this.clearMarkers();
    } else {
      if (this.distClusterGoo) {
        this.removeDistrictClusterMakers();
      }
      this.addMakers();
    }
  }
  refreshDistrictCluster() {
    this.initDistrictCluster().clearMarkers();
    this.initDistrictCluster().addMarkers(this.getMakers(), false);;
  }
  removeDistrictClusterMakers() {
    if (this.distClusterGoo) {
      this.distClusterGoo.clearMarkers();
    }
    this.clearMarkersDist();
  }
  initDistrictCluster() {
    if (this.distClusterGoo) {
      return this.distClusterGoo;
    }
    this.makersDistGoo = this.getMakers();
    this.distClusterGoo = new MarkerClusterer(this.getMap(), this.makersDistGoo, { imagePath: '/assets/image/mapgoogle/m' });
    return this.distClusterGoo;
  }
  clearMarkers() {
    this.setMapOnAll(null);
  }
  setMapOnAll(map) {
    if (null != this.makersGoo && this.makersGoo.length > 0) {
      for (let i = 0; i < this.makersGoo.length; i++) {
        this.makersGoo[i].setMap(map);
      }
      this.makersGoo = [];
      this.makersGooMap = [];
    }
  }
  clearMarkersDist() {
    this.setMapOnAllDist(null);
  }
  setMapOnAllDist(map) {
    if (null != this.makersDistGoo && this.makersDistGoo.length > 0) {
      for (let i = 0; i < this.makersDistGoo.length; i++) {
        this.makersDistGoo[i].setMap(map);
      }
      this.makersDistGoo = [];
    }
  }
  getMakers() {
    let makers = [];
    if (null != this.vehicles) {
      for (let i = 0; i < this.vehicles.length; i++) {
        let data = this.vehicles[i];
        let vehicleId = data.vehicleId;// 车辆id
        // let lng = data.lngEnc;// 原始经度
        // let lat = data.latEnc;// 原始纬度
        let lng = data.lng;// 偏移经度
        let lat = data.lat;// 偏移纬度
        let license = data.license;// 车牌号
        let onlineState = data.onlineState;// 在线状态
        let workState = data.workState;// 工作状态
        let repairState = data.repairState;// 维修状态
        let alarmState = data.alarmState;// 报警状态
        let orgName = data.orgName;// 机构名称
        let vehicleTypeName = data.vehicleTypeName;// 车型名称
        let teamGroupName = data.teamGroupName;// 班组名称
        let driverName = data.driverName;// 司机名
        let gpsTime = data.gpsTime;// sps时间
        let deviceId = data.deviceId;
        if ("null" == gpsTime) {
          gpsTime = '';
        }
        const title = `<input type='hidden' value='${vehicleId}'/><span>${license}</span><input type='hidden' value='${deviceId}'/>`;
        // var title = license;
        const content = [];
        content.push(`<span style='text-align:right' class='col-sm-4'>机构：</span><span class='col-sm-8'>${orgName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>类型：</span><span class='col-sm-8'>${vehicleTypeName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>班组：</span><span class='col-sm-8'>${teamGroupName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>司机：</span><span class='col-sm-8'>${driverName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>报警：</span><span class='col-sm-8'>${alarmState}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>时间：</span><span class='col-sm-8'>${gpsTime}</span>`);
        let infoWin = this.createInfoWindow(title, content.join('<br>'));
        let infowindow = new google.maps.InfoWindow({
          content: infoWin
        });
        /**this.locationUtilService.getGoogleIconUrl((url: string) => {
          const icon = {
            url: url
          };
          let latLng = new google.maps.LatLng(lat,
            lng);

          let marker = new google.maps.Marker({
            'position': latLng,
            icon: icon,
          });
          marker.addListener('click', () => {
            infowindow.open(this.getMap(), marker);
          });
          makers.push(marker);
        });*/
        let icon = this.locationUtilService.getGoogleIconUrlForCluster();
        let latLng = new google.maps.LatLng(lat,
          lng);

        let marker = new google.maps.Marker({
          'position': latLng,
          icon: icon,
        });
        marker.addListener('click', () => {
          infowindow.open(this.getMap(), marker);
        });
        makers.push(marker);
      }
    }
    return makers;
  }
  openMakerInfoWinIm(data) {
    this.clearInfWins();
    let vehicleId = data.vehicleId;// 车辆id
    // let lng = data.lngEnc;// 原始经度
    // let lat = data.latEnc;// 原始纬度
    let lng = data.lng;// 偏移经度
    let lat = data.lat;// 偏移纬度
    let license = data.license;// 车牌号
    let onlineState = data.onlineState;// 在线状态
    let workState = data.workState;// 工作状态
    let repairState = data.repairState;// 维修状态
    let alarmState = data.alarmState;// 报警状态
    let orgName = data.orgName;// 机构名称
    let vehicleTypeName = data.vehicleTypeName;// 车型名称
    let teamGroupName = data.teamGroupName;// 班组名称
    let driverName = data.driverName;// 司机名
    let gpsTime = data.gpsTime;// sps时间
    let deviceId = data.deviceId;
    if ("null" == gpsTime) {
      gpsTime = '';
    }
    const title = `<input type='hidden' value='${vehicleId}'/><span>${license}</span><input type='hidden' value='${deviceId}'/>`;
    // var title = license;
    const content = [];
    content.push(`<span style='text-align:right' class='col-sm-4'>机构：</span><span class='col-sm-8'>${orgName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>类型：</span><span class='col-sm-8'>${vehicleTypeName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>班组：</span><span class='col-sm-8'>${teamGroupName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>司机：</span><span class='col-sm-8'>${driverName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>报警：</span><span class='col-sm-8'>${alarmState}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>时间：</span><span class='col-sm-8'>${gpsTime}</span>`);
    let infoWin = this.createInfoWindow(title, content.join('<br>'));
    let latLng = new google.maps.LatLng(lat,
      lng);
    const size = new google.maps.Size(0, -71);
    let infowindow = new google.maps.InfoWindow({
      content: infoWin,
      position: latLng,
      pixelOffset: size
    });
    // let icon = this.locationUtilService.getGoogleIconUrlForCluster();

    // let marker = new google.maps.Marker({
    //   'position': latLng,
    //   icon: icon,
    // });
    // marker.addListener('click', () => {
    //   infowindow.open(this.getMap(), marker);
    // });
    infowindow.open(this.getMap());
    this.infoWinsForSearch.push(infowindow);
  }
  clearInfWins() {
    // console.log("google");
    for (let i = 0; i < this.infoWinsForSearch.length; i++) {
      let item = this.infoWinsForSearch[i];
      item.close();
    }
    this.infoWinsForSearch = [];
  }
  addMakers() {
    /***/
    if (!this.isScreen) {
      if (this.makersGoo.length > 0) {
        this.clearMarkers();
        this.makersGoo = [];
      }
    }
    if (this.makersDistGoo.length > 0) {
      this.clearMarkersDist();
    }
    if (null != this.vehicles) {
      for (let i = 0; i < this.vehicles.length; i++) {
        let data = this.vehicles[i];
        let vehicleId = data.vehicleId;// 车辆id
        let existMarker = this.isExistMaker(vehicleId);
        // let lng = data.lngEnc;// 原始经度
        // let lat = data.latEnc;// 原始纬度
        let lng = data.lng;// 偏移经度;google对中国区经纬度进行了偏移处理
        let lat = data.lat;// 偏移纬度;google对中国区经纬度进行了偏移处理
        let license = data.license;// 车牌号
        let onlineState = data.onlineState;// 在线状态
        let workState = data.workState;// 工作状态
        let repairState = data.repairState;// 维修状态
        let alarmState = data.alarmState;// 报警状态
        let orgName = data.orgName;// 机构名称
        let vehicleTypeName = data.vehicleTypeName;// 车型名称
        let teamGroupName = data.teamGroupName;// 班组名称
        let driverName = data.driverName;// 司机名
        let gpsTime = data.gpsTime;// sps时间
        let deviceId = data.deviceId;
        if ("null" == gpsTime) {
          gpsTime = '';
        }
        const title = `<input type='hidden' value='${vehicleId}'/><span>${license}</span><input type='hidden' value='${deviceId}'/>`;
        // var title = license;
        const content = [];
        content.push(`<span style='text-align:right' class='col-sm-4'>机构：</span><span class='col-sm-8'>${orgName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>类型：</span><span class='col-sm-8'>${vehicleTypeName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>班组：</span><span class='col-sm-8'>${teamGroupName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>司机：</span><span class='col-sm-8'>${driverName}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>报警：</span><span class='col-sm-8'>${alarmState}</span>`);
        content.push(`<span style='text-align:right' class='col-sm-4'>时间：</span><span class='col-sm-8'>${gpsTime}</span>`);
        let infoWin = this.createInfoWindow(title, content.join('<br>'));
        let infowindow = new google.maps.InfoWindow({
          content: infoWin
        });
        if (!this.isScreen) {
          this.locationUtilService.getGoogleIconUrl((url: string) => {
            const icon = {
              url: url,
              anchor: new google.maps.Point(LocationServiceNs.OFFSET_GOOGLE_MAKER_X, LocationServiceNs.OFFSET_GOOGLE_MAKER_Y),
            };
            this.addOneMaker(lat, lng, icon, infowindow, vehicleId);
          }, onlineState, workState, repairState, alarmState, vehicleTypeName);
        } else {
          this.locationUtilService.getGoogleIconUrlForScreen((url: string) => {
            const icon = {
              url: url
            };
            this.proccessScreenMaker(lat, lng, icon, infowindow, vehicleId, existMarker);
          }, onlineState, workState, repairState, alarmState, vehicleTypeName);
        }
      }
    }
    // console.log(this.makersGooMap);
  }
  isExistMaker(vehicleId) {
    if (this.makersGooMap.length < 1) {
      return null;
    }
    for (let i = 0; i < this.makersGooMap.length; i++) {
      let item = this.makersGooMap[i];
      if (item.vehicleId === vehicleId) {
        // let event = item.event;
        let infoWin = item.infoWin;
        // google.maps.event.removeListener(event);
        // google.maps.event.clearInstanceListeners(item.marker);
        google.maps.event.clearListeners(item.marker, 'click');
        infoWin.close();
        this.removeMarkerFromStore(this.makersGooMap, item);
        return item.marker;
      }
    }
  }
  removeMarkerFromStore(makersGooMap, item) {
    const index = makersGooMap.indexOf(item);   //找到要删除的元素对应的下标,从0开始
    const delEle = makersGooMap.splice(index, 1);   //splice为从要删除的元素开始,删除一个,刚好就是删除那个元素
  }
  // 创建信息弹框
  createInfoWindow(title, content) {
    const show = this.detailModal;
    const detInfo = this.detailInfo;
    function showDetails_ifram(e) {
      show.show = true;
      const id = e.currentTarget.firstChild.value;
      const devId = e.currentTarget.lastChild.value;
      detInfo.vehicleId = id;
      detInfo.deviceId = devId;
    }
    const info = document.createElement('div');
    info.className = 'info';

    // 可以通过下面的方式修改自定义窗体的宽高
    // info.style.width = "400px";
    // 定义顶部标题
    const top = document.createElement('div');
    const titleD = document.createElement('div');
    titleD.className = 'goo-infwin-title';
    titleD.innerHTML = title;
    titleD.onclick = showDetails_ifram;

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
  public getMap() {
    if (this.map) {
      return this.map;
    }
    const mapProp = this.getMapProp();
    this.map = new google.maps.Map(this.googleMapElement.nativeElement, mapProp);
    this.map.addListener('zoom_changed', () => {
      let center = this.map.getCenter();
      this.googleZoomOutEvent.emit({
        zoom: this.map.getZoom(),
        lng: center.lng(),
        lat: center.lat(),
        map: 'google'
      });
      this.refreshMapDistrictClusterAndMakers();
    });
    this.map.addListener('dragend', () => {
      let center = this.map.getCenter();
      // console.log(center.lat(), center.lng());
      this.googleZoomOutEvent.emit({
        zoom: this.map.getZoom(),
        lng: center.lng(),
        lat: center.lat(),
        map: 'google'
      });
    });
    return this.map;
  }
  setMap() {
    const result = this.status === 1 ? 'hybrid' : 'roadmap';
    this.getMap().setMapTypeId(result);
  }
  // 取消弹框
  handleDetailCancel() {
    this.detailModal.show = false;
  }
  getMapProp() {
    let lng;
    let lat
    let mapProp;
    if (!this.isScreen) {
      lng = LocationServiceNs.LNG;
      lat = LocationServiceNs.LAT;
    } else {
      //大屏
      lng = LocationServiceNs.LNG_SCREEN;
      lat = LocationServiceNs.LAT_SCREEN;
    }
    if (!this.isScreen) {
      mapProp = {
        center: new google.maps.LatLng(lat, lng),
        zoom: LocationServiceNs.ZOOM_LOCS_GOO,
        mapTypeControl: false,
        mapTypeId: this.status === 1 ? 'hybrid' : 'roadmap',
        disableDefaultUI: true
      };
    } else {
      //大屏
      mapProp = {
        center: new google.maps.LatLng(lat, lng),
        zoom: LocationServiceNs.ZOOM_LOCS_GOO_FOR_SCREEN,
        // mapTypeControl: false,
        mapTypeId: 'hybrid',
        disableDefaultUI: true
      };
    }
    return mapProp;
  }
  proccessScreenMaker(lat, lng, icon, infowindow, vehicleId, existMarker) {
    if (null != existMarker) {
      existMarker.setPosition({ lat: lat, lng: lng });
      existMarker.setIcon(icon);
      existMarker.addListener('click', () => {
        infowindow.open(this.getMap(), existMarker);
      });
      this.makersGooMap.push({ vehicleId: vehicleId, marker: existMarker, event: event, infoWin: infowindow });
    } else {
      let latLng = new google.maps.LatLng(lat,
        lng);
      let marker = new google.maps.Marker({
        'position': latLng,
        icon: icon,
        map: this.getMap(),
      });
      let event = marker.addListener('click', () => {
        infowindow.open(this.getMap(), marker);
      });
      this.makersGoo.push(marker);
      this.makersGooMap.push({ vehicleId: vehicleId, marker: marker, event: event, infoWin: infowindow });
    }
  }
  addOneMaker(lat, lng, icon, infowindow, vehicleId) {
    let latLng = new google.maps.LatLng(lat,
      lng);

    let marker = new google.maps.Marker({
      'position': latLng,
      icon: icon,
      map: this.getMap(),
    });
    let event = marker.addListener('click', () => {
      infowindow.open(this.getMap(), marker);
    });
    this.makersGoo.push(marker);
    this.makersGooMap.push({ vehicleId: vehicleId, marker: marker, event: event });
  }
}
