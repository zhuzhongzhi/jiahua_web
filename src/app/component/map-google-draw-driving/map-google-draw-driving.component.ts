import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationService, LocationServiceNs, LocationUtilService } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
@Component({
  selector: 'app-map-google-draw-driving',
  templateUrl: './map-google-draw-driving.component.html',
  styleUrls: ['./map-google-draw-driving.component.scss']
})
export class MapGoogleDrawDrivingComponent implements OnInit, AfterViewInit, OnChanges {
  // 地图
  @ViewChild('googleDrawDrivingContainer') mapElement: ElementRef;
  public map: any;
  @Input() handleFlag: number = 0;
  //[{"linePointId":"320140500835237888","lineId":"318071551729598464","pointType":1,"pointIndex":0,"lonEnc":117.215300,"latEnc":28.318634}]
  //pointType 1 起点  2途径点 3终点
  //pointIndex从0开始
  @Input() mapDrawDrivingIn;
  @Output() googleDrawingDrivingOut = new EventEmitter<any>();
  @Input() status = 0;
  public satelliteLayer: any;
  public makerWay = [];
  makerWayMakers = [];
  startPoint: any;
  endPoint: any;
  markerStart: any;
  markerEnd: any;
  markerStarts: any;
  markerEnds: any;
  drawingManager: any;
  drawingMakerManager: any;
  //新增点集合
  pointList = [];
  polyline: any;
  polylineAddList = [];
  makerAddList = [];
  linePointListSave = [];
  @Input() addOrEditNum = 0;
  constructor(private locationService: LocationService, private locationUtilService: LocationUtilService, private messageService: ShowMessageService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    // this.getMap();
    // this.initData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapDrawDrivingIn || changes.addOrEditNum) {
      this.getMap();
      this.initData();
    }
    if (changes.status) {
      this.changeGoogleMapModel();
    }
  }
  removeMakerWay() {
    if (this.makerAddList && this.makerAddList.length > 0) {
      for (let i = 0; i < this.makerAddList.length; i++) {
        let item = this.makerAddList[i];
        item.setMap(null);
      }
      this.makerAddList = [];
    }
  }
  ////编辑、增加
  redrawDriving() {
    this.clearMap(false);
    this.startAddOrEditPloyLine('redraw');
  }
  saveDriving() {
    this.linePointListSave = [];
    if (this.pointList && this.pointList.length > 0) {
      for (let i = 0; i < this.pointList.length; i++) {
        this.linePointListSave.push(this.pointList[i]);
      }
    }
    if (this.makerAddList && this.makerAddList.length > 0) {
      for (let i = 0; i < this.makerAddList.length; i++) {
        let items = this.makerAddList[i].getPosition();
        let item = { lonEnc: 0, latEnc: 0, pointIndex: 0, pointType: 0 };
        item.lonEnc = items.lng();
        item.latEnc = items.lat();
        item.pointIndex = i;
        item.pointType = 2;
        this.linePointListSave.push(item);
      }
    }
    //编辑
    if (this.handleFlag === 1 && this.linePointListSave.length < 1) {
      this.linePointListSave = this.mapDrawDrivingIn;
    }
    this.googleDrawingDrivingOut.emit(this.linePointListSave);
  }
  drawMakerWay() {
    // if (this.drawingManager) {
    //   this.drawingManager.setMap(null);
    //   this.drawingManager = null;
    // }
    if (this.drawingMakerManager) {
      // this.drawingMakerManager.setDrawingMode('polyline');
      this.drawingMakerManager.setMap(null);
      this.drawingMakerManager = null;
    }
    if (!this.drawingMakerManager) {
      this.drawingMakerManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        // drawingControlOptions: {
        //   position: google.maps.ControlPosition.TOP_CENTER,
        //   drawingModes: [
        //     //多邊形
        //     google.maps.drawing.OverlayType.MARKER
        //   ]
        // },
        drawingMode: 'marker',
        polylineOptions: {
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 2,
          editable: true,
          geodesic: true,
        }
      });
      this.drawingMakerManager.setMap(this.getMap());
      google.maps.event.addListener(this.drawingMakerManager, 'markercomplete', (maker) => {
        this.makerAddList.push(maker);
      });
    }
  }
  startAddOrEditPloyLine(flag) {
    //编辑
    if ('start' === flag && 1 === this.handleFlag) {
      this.showLinePoints();
    };
    if (this.drawingManager) {
      // this.drawingMakerManager.setDrawingMode('polyline');
      this.drawingManager.setMap(null);
      this.drawingManager = null;
    }
    if (!this.drawingManager) {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        // drawingControlOptions: {
        //   position: google.maps.ControlPosition.TOP_CENTER,
        //   drawingModes: [
        //     //多邊形
        //     google.maps.drawing.OverlayType.POLYLINE
        //   ]
        // },
        drawingMode: 'polyline',
        polylineOptions: {
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 2,
          editable: true,
          geodesic: true,
        }
      });
      this.drawingManager.setMap(this.getMap());
      google.maps.event.addListener(this.drawingManager, 'polylinecomplete', (polyline) => {
        //退出繪圖模式
        //drawingManager.setDrawingMode(null);
        if (this.polylineAddList.length > 0) {
          this.messageService.showAlertMessage('', '只能画一条路线', 'warning');
          polyline.setMap(null);
          return;
        }
        this.polylineAddList.push(polyline);
        //退出編輯模式
        polyline.setEditable(false);
        let array = polyline.getPath().getArray();
        // console.log(array);
        // var pathStrArr = [];
        for (let i = 0; i < array.length; i++) {
          let items = array[i];
          let item = { lonEnc: 0, latEnc: 0, pointIndex: 0, pointType: 0 };
          item.lonEnc = items.lng();
          item.latEnc = items.lat();
          item.pointIndex = i;
          if (0 === i) {
            item.pointType = 1;
            this.startPoint = { lat: items.lat(), lng: items.lng() };
          }
          if ((array.length - 1) === i) {
            item.pointType = 3;
            this.endPoint = { lat: items.lat(), lng: items.lng() };
          }
          this.pointList.push(item);
        }
        this.processMakers(this.startPoint, this.endPoint, null);
        this.drawingManager.setDrawingMode(null);
      });
    }
  }
  clearMap(flag) {
    this.linePointListSave = [];
    this.pointList = [];
    //是否清除所有，包含途经点
    if (flag) {
      if (this.makerAddList && this.makerAddList.length > 0) {
        for (let i = 0; i < this.makerAddList.length; i++) {
          let item = this.makerAddList[i];
          item.setMap(null);
        }
        this.makerAddList = [];
      }
    }
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
    if (this.polylineAddList.length > 0) {
      for (let i = 0; i < this.polylineAddList.length; i++) {
        let item = this.polylineAddList[i];
        item.setMap(null);
      }
      this.polylineAddList = [];
    }
    this.clearMarkers(this.markerStarts);
    this.markerStarts = [];
    this.clearMarkers(this.markerEnds);
    this.markerEnds = [];
    this.clearMarkers(this.makerWayMakers);
    this.makerWayMakers = [];
    this.makerWay = [];
  }
  clearMarkers(makers) {
    if (null != makers && makers.length > 0) {
      for (let i = 0; i < makers.length; i++) {
        makers[i].setMap(null);
      }
    }
  }
  clear() {
    this.clearMap(true);
    if (this.markerStart) {
      this.markerStart.setMap(null);
      this.markerStart = null;
    }
    if (this.markerEnd) {
      this.markerEnd.setMap(null);
      this.markerEnd = null;
    }
    if (this.startPoint) {
      this.startPoint = null;
    }
    if (this.endPoint) {
      this.endPoint = null;
    }
    if (this.drawingManager) {
      this.drawingManager.setMap(null);
      this.drawingManager = null;
    }
    if (this.drawingMakerManager) {
      this.drawingMakerManager.setMap(null);
      this.drawingMakerManager = null;
    }
  }
  initData() {
    this.clear();
    //查看、编辑
    if (this.handleFlag !== 0) {
      this.showLinePoints();
    }
  }
  showLinePoints() {
    if (this.polyline) {
      return;
    }
    if (null != this.mapDrawDrivingIn && null != this.mapDrawDrivingIn[0]) {
      let ps = this.processItem(this.mapDrawDrivingIn);
      if (ps.length > 0) {
        this.polyline = new google.maps.Polyline({
          path: ps,
          geodesic: true,
          strokeColor: LocationServiceNs.COLOR_DRAW_BEFORE,
          strokeOpacity: 1.0,
          strokeWeight: LocationServiceNs.WEIGHT_DRAW
        });
        this.polyline.setMap(this.getMap());
      }
      this.processMakers(this.startPoint, this.endPoint, this.makerWay);
      let i = 0;
      if (ps.length % 2 === 0) {
        i = ps.length / 2;
      } else {
        i = (ps.length + 1) / 2;
      }
      this.getMap().setCenter(ps[i]);
      this.getMap().setZoom(LocationServiceNs.ZOOM_LOC_DRAW_SHOW);
    }
  }
  /**
   * 
   * @param startP 展示
   * @param endP 
   * @param makerWay 
   */
  processMakers(startP, endP, makerWay) {
    if (startP) {
      let start = new google.maps.Marker({
        'position': startP,
        label: '起',
        map: this.getMap(),
      });
      this.markerStart = start;
      if (2 !== this.handleFlag) {
        this.markerStarts.push(start);
      }
    }
    if (endP) {
      let end = new google.maps.Marker({
        'position': endP,
        label: '终',
        map: this.getMap(),
      });
      this.markerEnd = end;
      if (2 !== this.handleFlag) {
        this.markerEnds.push(end);
      }
    }
    if (makerWay && makerWay.length > 0) {
      for (let i = 0; i < makerWay.length; i++) {
        let item = makerWay[i];
        let marker = new google.maps.Marker({
          'position': item,
          map: this.getMap(),
        });
        marker.setMap(this.getMap());
        this.makerWayMakers.push(marker);
      }
    }
  }
  processItem(pointList) {
    let arr = [];
    if (null == pointList || pointList.length == 0) {
      return arr;
    }
    for (let i = 0; i < pointList.length; i++) {
      let item = pointList[i];
      let a = { lat: item.latEnc, lng: item.lonEnc };
      if (item.pointType === 1) {
        this.startPoint = a;
      }
      if (item.pointType === 3) {
        this.endPoint = a;
      }
      if (item.pointType === 2) {
        this.makerWay.push(a);
      } else {
        arr.push(a);
      }
    }
    return arr;
  }
  // 切换卫星状态
  changeGoogleMapModel(): void {
    const result = this.status === 1 ? 'hybrid' : 'roadmap';
    this.getMap().setMapTypeId(result);
  }
  initMap() {
    if (!this.map) {
      let lng = null;
      let lat = null;
      if (this.mapDrawDrivingIn && this.mapDrawDrivingIn.length > 1) {
        lng = this.mapDrawDrivingIn[0].lonEnc; // 偏移经度
        lat = this.mapDrawDrivingIn[0].latEnc; // 偏移纬度
      }
      this.map = this.locationUtilService.getGoogleMap(this.mapElement, this.map, lng, lat, LocationServiceNs.ZOOM_LOC_DRAW, null);
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
