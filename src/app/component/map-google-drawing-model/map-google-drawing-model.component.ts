import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationService, LocationServiceNs, LocationUtilService } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
@Component({
  selector: 'app-map-google-drawing-model',
  templateUrl: './map-google-drawing-model.component.html',
  styleUrls: ['./map-google-drawing-model.component.scss']
})
export class MapGoogleDrawingModelComponent implements OnInit, AfterViewInit, OnChanges {
  // 地图
  @ViewChild('mapDrawingContainerGoogle') mapElement: ElementRef;
  public map: any;
  public maker: any;
  @Input() handleFlag: number = 0;
  //围栏数据data,isShowOrEdit 0 展示；1增加编辑此标志位暂时不用
  //[{"fencePointId":"319177383913455616","fenceId":"319177050369818624","pointIndex":7,"lonEnc":117.255297,"latEnc":28.328986}]
  //pointIndex从0开始
  @Input() mapDrawingIn = [];
  // @Input() isRedrawFlag;
  @Output() mapDrawingOutEvent = new EventEmitter();
  @Input() status = 0;
  public satelliteLayer: any;
  drawingManager: any;
  fencePointList = [];
  polygon: any;
  polygonAddList = [];
  @Input() addOrEditNum = 0;
  constructor(private locationService: LocationService, private locationUtilService: LocationUtilService, private messageService: ShowMessageService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapDrawingIn || changes.addOrEditNum) {
      this.getMap();
      this.initData();
    }
    if (changes.status) {
      this.changeGaodeMapModel();
    }
  }
  redrawDrawPolygon() {
    this.clear();
    this.startAddOrEditPloygon('redraw');
  }
  startAddOrEditPloygon(flag) {
    //编辑、增加
    // if (1 === this.handleFlag) {
    if (1 === this.handleFlag && 'start' === flag && !this.polygon) {
      this.showFencePoints();
    }
    if (!this.drawingManager) {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        // drawingControlOptions: {
        //   position: google.maps.ControlPosition.BOTTOM_CENTER_CENTER,
        //   drawingModes: [
        //     //多邊形
        //     google.maps.drawing.OverlayType.POLYGON
        //   ]
        // },
        drawingMode:'polygon',
        polygonOptions: {
          strokeColor: LocationServiceNs.COLOR_DRAW_AFTER_STROKE,
          // strokeOpacity: 1,
          strokeWeight: LocationServiceNs.WEIGHT_DRAW,
          fillColor: LocationServiceNs.COLOR_DRAW_AFTER_FILL,
          fillOpacity: LocationServiceNs.COLOR_DRAW_AFTER_FILL_OPACITY,
          editable: true,
          geodesic: true,
        }
      });
      this.drawingManager.setMap(this.getMap());
      google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon) => {
        //退出繪圖模式
        //drawingManager.setDrawingMode(null);
        if (this.polygonAddList.length > 0) {
          this.messageService.showAlertMessage('', '只能画一个围栏', 'warning');
          polygon.setMap(null);
          return;
        }
        this.polygonAddList.push(polygon);
        //退出編輯模式
        polygon.setEditable(false);
        var array = polygon.getPath().getArray();
        // console.log(array);
        // var pathStrArr = [];
        for (var i = 0; i < array.length; i++) {
          var items = array[i];
          let item = { lonEnc: 0, latEnc: 0, pointIndex: 0 };
          item.lonEnc = items.lng();
          item.latEnc = items.lat();
          item.pointIndex = i;
          this.fencePointList.push(item);
        }
      });
    }
    // }
    // //增加
    // if (0 === this.handleFlag) {

    // }
  }
  savePolygonPoints() {
    if (this.fencePointList.length > 0) {
      this.mapDrawingOutEvent.emit(this.fencePointList);
    } else if (1 === this.handleFlag) {
      this.mapDrawingOutEvent.emit(this.mapDrawingIn);
    }
  }
  initData() {
    this.clear();
    //查看、编辑
    if (this.handleFlag !== 0) {
      this.showFencePoints();
    }
  }
  clear() {
    if (this.drawingManager) {
      this.drawingManager.setMap(null);
      this.drawingManager = null;
    }
    this.fencePointList = [];
    if (this.polygon) {
      this.polygon.setMap(null);
      this.polygon = null;
    }
    if (this.polygonAddList.length > 0) {
      for (let i = 0; i < this.polygonAddList.length; i++) {
        let item = this.polygonAddList[i];
        item.setMap(null);
      }
      this.polygonAddList = [];
    }
  }
  showFencePoints() {
    if (this.mapDrawingIn && this.mapDrawingIn.length > 0) {
      let ps = [];
      for (let i = 0; i < this.mapDrawingIn.length; i++) {
        let item = this.mapDrawingIn[i];
        let pi = { lat: item.latEnc, lng: item.lonEnc };
        ps.push(pi);
      }
      if (ps.length > 0) {
        this.polygon = new google.maps.Polygon({
          paths: ps,
          strokeColor: LocationServiceNs.COLOR_DRAW_BEFORE_STROKE,
          // strokeOpacity: 0.8,
          strokeWeight: LocationServiceNs.WEIGHT_DRAW,
          fillColor: LocationServiceNs.COLOR_DRAW_BEFORE_FILL,
          fillOpacity: LocationServiceNs.COLOR_DRAW_BEFORE_FILL_OPACITY,
        });
        this.polygon.setMap(this.getMap());
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
  }
  // 切换卫星状态
  changeGaodeMapModel(): void {
    const result = this.status === 1 ? 'hybrid' : 'roadmap';
    this.getMap().setMapTypeId(result);
  }
  initMap() {
    if (!this.map) {
      let lng = null;
      let lat = null;
      if (this.mapDrawingIn && this.mapDrawingIn.length > 1) {
        lng = this.mapDrawingIn[0].lonEnc; // 偏移经度
        lat = this.mapDrawingIn[0].latEnc; // 偏移纬度
      }
      this.map = this.locationUtilService.getGoogleMap(this.mapElement, this.map, lng, lat, 16, null);
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
