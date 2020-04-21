import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {BaseConfirmModal} from '../base-confirm-modal';

export interface AddressComponent {
  adcode?: string; // 行政区编码 如 110101
  province?: string; // 坐标点所在省名称 例如：北京市
  city?: string; // 坐标点所在城市名称 当所在城市为北京、上海、天津、重庆四个直辖市时，该字段返回为空, 当所在城市属于县级市的时候，此字段为空
  district?: string; // 坐标点所在区 例如：海淀区
  township?: string; // 坐标点所在乡镇/街道,此街道为社区街道  例如：燕园街道
  street?: string; // 街道名称 例如：中关村北二条
  streetNumber?: string; // 门牌号 例如：3号
  provinceId?: string; // 省id，为了兼容性，自解析
  cityId?: string; // 城市id，为了兼容性，自解析
}

export interface PositionLocation {
  lat?: number;
  lng?: number;
  address?: string;
  addressComponent?: AddressComponent;
}

@Component({
  selector: 'app-position-picker',
  templateUrl: './position-picker.component.html',
  styleUrls: ['./position-picker.component.scss']
})
export class PositionPickerComponent extends BaseConfirmModal.BasicConfirmModalComponent<any> implements OnInit, OnDestroy {
  public searchAddress: string;
  public geocoder: any;
  public currentLocation: PositionLocation;
  public positionPicker: any;
  private map: any;
  @ViewChild('mapContainer') mapElement: ElementRef;
  constructor(private modalRef: NzModalRef, private nzMessageService: NzMessageService) {
    super();
    this.getPlugin();
    this.currentLocation = {
      lat: 0,
      lng: 0,
      address: '',
      addressComponent: {}
    };
  }

  ngOnInit() {
    console.log(this.params);
    if (this.params) {
      this.currentLocation =  Object.assign({}, this.currentLocation,  this.params);
    }
    this.createPositionPicker().then( () => {
      if (!this.currentLocation.lat && !this.currentLocation.lng) {
        // this.searchAddressLocation(this.currentLocation.address);
      } else {
        this.positionPicker.start(new AMap.LngLat( this.currentLocation.lng, this.currentLocation.lat));
      }
    });
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }
  private getPlugin() {
    return new Promise( (resolve, reject) => { // 异步加载插件
      if (this.geocoder) {
        return resolve(true);
      }
      AMap.plugin('AMap.Geocoder', () => {
        this.geocoder =  new AMap.Geocoder();
        resolve(true);
      });
    });
  }
  protected getCurrentValue() { // 模态返回值
    return {
      lng: this.currentLocation.lng,
      lat: this.currentLocation.lat,
      address: this.currentLocation.address,
      addressComponent: this.currentLocation.addressComponent
    };
  }
  public searchAddressLocation(address) {
    if (!address) {
      this.nzMessageService.create('error', '请输入地址');
      return;
    }
    return this.getLocationByAddress(address).then( () => {
      this.positionPicker.start(new AMap.LngLat( this.currentLocation.lng, this.currentLocation.lat));
    });
  }

  private getLocationByAddress(address) {
    return new Promise( (resolve, reject) => {
      this.getPlugin().then( () => {
        this.geocoder.getLocation(address, (status, result) => {
          if (status === 'complete' && result.geocodes.length) {
            console.log(result);
            const lnglat = result.geocodes[0].location;
            this.currentLocation.lng = lnglat.lng;
            this.currentLocation.lat = lnglat.lat;
            this.currentLocation.addressComponent.adcode = result.geocodes[0].adcode;
            this.currentLocation.addressComponent.province = result.geocodes[0].addressComponent.province;
            this.currentLocation.addressComponent.city = result.geocodes[0].addressComponent.city;
            this.currentLocation.addressComponent.district = result.geocodes[0].addressComponent.district;
            this.currentLocation.addressComponent.township = result.geocodes[0].addressComponent.township;
            this.currentLocation.addressComponent.street = result.geocodes[0].addressComponent.street;
            this.currentLocation.addressComponent.streetNumber = result.geocodes[0].addressComponent.streetNumber;
            this.createFullAddress();
            resolve(lnglat);
          } else {
            this.nzMessageService.create('error', '地址搜索失败', {nzDuration: 2000});
          }
        });
      });
    });
  }

  public createPositionPicker() {
    return new Promise( (resolve, reject) => {
      (<any>window).AMapUI.loadUI(['misc/PositionPicker'], (function(PositionPicker) {
       this.map = new AMap.Map(this.mapElement.nativeElement, {
          zoom: 16,
        });
        this.positionPicker = new PositionPicker({
          mode: 'dragMarker',
          map: this.map // 依赖地图对象
        });
        this.positionPicker.on('success', (positionResult) => {
          console.log(positionResult);
          this.currentLocation.lng = positionResult.position.lng;
          this.currentLocation.lat = positionResult.position.lat;
          this.currentLocation.addressComponent.adcode = positionResult.regeocode.addressComponent.adcode;
          this.currentLocation.addressComponent.province = positionResult.regeocode.addressComponent.province;
          this.currentLocation.addressComponent.city = positionResult.regeocode.addressComponent.city;
          this.currentLocation.addressComponent.district = positionResult.regeocode.addressComponent.district;
          this.currentLocation.addressComponent.township = positionResult.regeocode.addressComponent.township;
          this.currentLocation.addressComponent.street = positionResult.regeocode.addressComponent.street;
          this.currentLocation.addressComponent.streetNumber = positionResult.regeocode.addressComponent.streetNumber;
          this.createFullAddress();
          // this.currentLocation.address = positionResult.address;
        });
        resolve();
      }).bind(this));
    });
  }

  private createFullAddress() {
    this.currentLocation.address = this.currentLocation.addressComponent.province +
     this.currentLocation.addressComponent.city +
      this.currentLocation.addressComponent.district +
      this.currentLocation.addressComponent.township +
      this.currentLocation.addressComponent.street +
      this.currentLocation.addressComponent.streetNumber;
      if (this.currentLocation.addressComponent.adcode.length === 6) {
        this.currentLocation.addressComponent.provinceId = this.currentLocation.addressComponent.adcode.substr(0, 2) + '0000';
        this.currentLocation.addressComponent.cityId = this.currentLocation.addressComponent.adcode.substr(0, 4) + '00';
      }
  }

}
