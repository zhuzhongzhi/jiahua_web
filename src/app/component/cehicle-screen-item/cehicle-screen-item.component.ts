import {Component, ElementRef, ViewChild, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {
  LocationUtilService,
  LocationService,
  VehicleScreenService,
  LocationServiceNs
} from '../../core/biz-services/location/location-service.service';
import {NzFormatEmitEvent} from 'ng-zorro-antd';
import {ShowMessageService} from '../../widget/show-message/show-message';
import {ActionCode} from '../../../environments/actionCode';
import {MapGaodeShowComponent} from '../../component/map-gaode-show/map-gaode-show.component';
import {MapGoogleShowComponent} from '../../component/map-google-show/map-google-show.component';

// import { EventEmitter } from 'protractor';
@Component({
  selector: 'app-cehicle-screen-item',
  templateUrl: './cehicle-screen-item.component.html',
  styleUrls: ['./cehicle-screen-item.component.scss']
})
export class CehicleScreenItemComponent implements OnInit {
  ActionCode = ActionCode;
  // 切换地图，高德地图——1，谷歌地图——2
  showGaoDe = 1;
  // 单选按钮值，标准或卫星地图——标准是‘0’，卫星是‘1’
  radioMapValue = 0;
  // 弹框类
  orgVehicleTree = {
    show: false,
    loading: false,
    title: '',
    errTxt: '',
    showContinue: false,
    showSaveBtn: false
  };
  //需要搜索的车辆
  searchVehValue: string;
  vehicleId: string;
  nodes = [];
  @Output() event = new EventEmitter();
  // @Output() changeLocsEvent = new EventEmitter();
  isRefresh: boolean;
  @Input() screenItem;
  currentZoomAndCenter: any = null;
  @ViewChild('gaodeShow')
  private gaodeShow: MapGaodeShowComponent;
  @ViewChild('googleShow')
  private googleShow: MapGoogleShowComponent;
  private timer;
  private i: number = 0;
  options = [];
  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    errTxt: '',
    showContinue: false,
    showSaveBtn: false
  };
  detailInfo = {
    vehicleId: '',
    deviceId: ''
  };

  constructor(private locationService: LocationService, private locationUtilService: LocationUtilService, private vehicleScreenService: VehicleScreenService, private messageService: ShowMessageService) {
  }

  ngOnInit() {
    // this.timer = setInterval(() => {
    //   this.initData();
    // }, 1000);
  }

  ngAfterViewInit() {
    this.timer = setInterval(() => {
      this.initData();
    }, 10000);
  }

  //销毁组件时清除定时器
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  initData() {
    if (this.screenItem && this.screenItem.vehiclePlaceInfo) {
      const lic = this.screenItem.vehiclePlaceInfo.license; // 车辆id
      const vehicleMonitorId = this.screenItem.vehicleMonitorId;  // 监控id
      const filter = {license: lic};
      this.locationService.getVehiclesMapData(filter).subscribe((res: LocationServiceNs.UfastHttpAnyResModel) => {

        if (!(null != res.value && res.value.length > 0)) {
          // this.messageService.showAlertMessage('', '车辆不存在', 'error');
          return;
        }
        const item = res.value[0];
        this.screenItem = {vehiclePlaceInfo: item, vehicleMonitorId: vehicleMonitorId};
      }, (error: any) => {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.messageService.showAlertMessage('', error.message, 'error');
      });
    }
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

  // 卫星地图与道路地图切换
  changeSelectedMap() {
    this.radioMapValue = this.radioMapValue === 0 ? 1 : 0;
  }

  nzOrgVehEvent(event: NzFormatEmitEvent): void {
    if (event) {
      this.searchVehValue = event.node.title;
      this.vehicleId = event.node.key;
    }
  }

  /**修改指定位置车辆 */
  handleOnModOk() {
    this.modAndRefresh();
    this.orgVehicleTree.show = false;
  }

  async modAndRefresh() {
    await this.modVehLoc();
  }

  async delAndRefresh() {
    await this.delVehLoc();
  }

  refreshData() {
    this.isRefresh = true;
    this.event.emit(this.isRefresh);
  }

  modVehLoc() {
    const filter = {license: this.searchVehValue};
    this.locationService.getVehiclesMapData(filter).subscribe((res: LocationServiceNs.UfastHttpAnyResModel) => {
      if (res.value == null || res.value.length < 0) {
        this.messageService.showAlertMessage('', '车辆不存在', 'error');
        return;
      }
      this.vehicleId = res.value[0].vehicleId;
      const filter1 = {vehicleMonitorId: this.screenItem.vehicleMonitorId, vehicleId: this.vehicleId};
      this.vehicleScreenService.modScreenVehData(filter1).subscribe((resp: LocationServiceNs.UfastHttpAnyResModel) => {
        if (resp.code !== 0) {
          this.messageService.showAlertMessage('', resp.message, 'error');
          this.refreshData();
          return;
        }
        this.refreshData();
        this.messageService.showToastMessage('操作成功', 'success');
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });

    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  delVehLoc() {
    const filter = [this.screenItem.vehicleMonitorId];
    this.vehicleScreenService.delScreenVehData(filter).subscribe((res: LocationServiceNs.UfastHttpAnyResModel) => {
      if (res.code !== 0) {
        this.messageService.showAlertMessage('', res.message, 'error');
        this.refreshData();
        return;
      }
      this.refreshData();
      this.messageService.showToastMessage('操作成功', 'success');
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  checkVehExistAndNotSame() {
    if (this.screenItem.vehiclePlaceInfo.license == this.searchVehValue) {
      this.messageService.showAlertMessage('', '被修改车辆与目前车辆一致', 'error');
      return;
    }
    const filter = {license: this.searchVehValue};
    this.locationService.getVehiclesMapData(filter).subscribe((res: LocationServiceNs.UfastHttpAnyResModel) => {

      if (!(null != res.value && res.value.length > 0)) {
        this.messageService.showAlertMessage('', '车辆不存在', 'error');
        return false;
      }
      this.vehicleId = res.value.vehicleId;
      return true;
    });
  }

  handleDetailCancel() {
    this.orgVehicleTree.show = false;
  }

  selectVehicle() {
    this.initOrgVehTree();
    this.searchVehValue = '';
    this.orgVehicleTree.show = true;
  }

  initOrgVehTree() {
    this.vehicleScreenService.getOrgVehsTree(null).subscribe((resData: LocationServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'error');
        return;
      }
      this.nodes = this.locationUtilService.procNodes(resData.value);
    }, (error: any) => {
      // this.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  getMockOrgVehData() {
    this.nodes = [{
      title: '0-0',
      key: '0-0',
      expanded: true,
      selectable: false,
      children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {title: '0-0-0-0', key: '0-0-0-0', icon: 'anticon anticon-car-o', isLeaf: true},
          {title: '0-0-0-1', key: '0-0-0-1', isLeaf: true},
          {title: '0-0-0-2', key: '0-0-0-2', isLeaf: true}
        ]
      }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {title: '0-0-1-0', key: '0-0-1-0', isLeaf: true},
          {title: '0-0-1-1', key: '0-0-1-1', isLeaf: true},
          {title: '0-0-1-2', key: '0-0-1-2', isLeaf: true}
        ]
      }, {
        title: '0-0-2',
        key: '0-0-2',
        isLeaf: true
      }]
    }, {
      title: '0-1',
      key: '0-1',
      children: [
        {title: '0-1-0-0', key: '0-1-0-0', isLeaf: true},
        {title: '0-1-0-1', key: '0-1-0-1', isLeaf: true},
        {title: '0-1-0-2', key: '0-1-0-2', isLeaf: true}
      ]
    }, {
      title: '0-2',
      key: '0-2',
      isLeaf: true
    }];
  }

  /**删除指定位置车辆监控 */
  delScreenVehsLoc() {
    this.delAndRefresh();
  }

  onKeyEnter(event) {
    if (event.keyCode === 13) {
      this.handleOnModOk();
    }
  }

  onInput(value: string): void {
    const filter = {
      vehicleLicense: value
    };
    if (null != value && value.length > 0) {
      if (value.length > 0) {
        this.locationService.getLicenseList(filter).subscribe((resData: LocationServiceNs.UfastHttpAnyResModel) => {
          if (resData.code !== 0) {
            this.messageService.showAlertMessage('', resData.message, 'warning');
            return;
          }
          this.options = [];
          resData.value.forEach((item) => {
            this.options.push(item.vehicleLicense);
          });
        }, (error: any) => {
          this.messageService.showAlertMessage('', error.message, 'error');
        });
      } else {
        this.options = [];
      }
    }
  }

  // 取消弹框
  handleDetailCancelForItem() {
    this.detailModal.show = false;
  }

  lookInfo(license): void {
    this.detailModal.title = '车辆信息（' + license + ')';
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.detailInfo.vehicleId = this.screenItem.vehiclePlaceInfo.vehicleId;
    this.detailInfo.deviceId = this.screenItem.vehiclePlaceInfo.deviceId;
    this.showDetailModal();
  }

  showDetailModal(): void {
    this.detailModal.errTxt = '';
    this.detailModal.show = true;
  }
}
