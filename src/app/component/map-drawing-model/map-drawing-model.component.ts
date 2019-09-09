import { Component, ElementRef, ViewChild, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationService, VehicleScreenService, LocationServiceNs } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
@Component({
  selector: 'app-map-drawing-model',
  templateUrl: './map-drawing-model.component.html',
  styleUrls: ['./map-drawing-model.component.scss']
})
export class MapDrawingModelComponent implements OnInit, OnChanges, AfterViewInit {
  // 地图
  @ViewChild('mapDrawingContainer') mapElement: ElementRef;
  public map: any;
  public maker: any;
  @Input() handleFlag: number = 0;
  //围栏数据data,isShowOrEdit 0 展示；1增加编辑此标志位暂时不用
  @Input() mapDrawingIn = [];
  // @Input() isRedrawFlag;
  @Output() mapDrawingOutEvent = new EventEmitter();
  mouseTool: any;
  polygon: any;
  overlaysAdd = [];
  points = [];
  fencePointListAdd = [];
  @Input() status = 0;
  public satelliteLayer: any;
  @Input() addOrEditNum = 0;
  // drawNum = 0;
  // polyEditor:any;
  constructor(private locationService: LocationService, private vehicleScreenService: VehicleScreenService, private messageService: ShowMessageService) {

  }

  ngOnInit() {
    // this.getMap();
    // this.initData();
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   ;
    // }, 1000);
    // this.getMap();
    // this.initData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.mapDrawingIn || changes.addOrEditNum) {
      this.getMap();
      this.initData();
    }
    if (changes.status) {
      this.changeGaodeMapModel();
    }
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
  /**删除指定位置车辆监控 */
  mapDrawingOut() {
    this.mapDrawingOutEvent.emit();
  }
  private initMap() {
    if (this.map) {
      return this.map;
    }
    let lng: number = null;
    let lat: number = null;
    lng = 117.24135;
    lat = 28.325019;
    this.map = new AMap.Map(this.mapElement.nativeElement, {
      resizeEnable: true,
      center: [lng, lat],
      zoom: LocationServiceNs.ZOOM_LOC_DRAW
    });
    return this.map;
  }
  clearData() {
    // 缩放地图到合适的视野级别
    if (this.polygon) {
      this.map.remove(this.polygon);
      this.polygon = null;
    }
    this.getMap().clearMap();
    if (this.mouseTool) {
      this.mouseTool.close(true);
      this.map.remove(this.mouseTool);
    }
    this.fencePointListAdd = [];
    this.overlaysAdd = [];
  }
  initData() {
    this.clearData();
    //查看、编辑
    if (this.handleFlag !== 0) {
      this.showPolygon();
    }
  }
  showPolygon() {
    if (null != this.mapDrawingIn && null != this.mapDrawingIn[0]) {
      // this.map.setFitView(this.mapDrawingIn); 
      let pointList = this.processItem(this.mapDrawingIn);
      // this.map.setFitView(pointList);
      this.polygon = new AMap.Polygon({
        path: pointList,
        strokeColor: LocationServiceNs.COLOR_DRAW_BEFORE_STROKE,
        strokeWeight: LocationServiceNs.WEIGHT_DRAW,
        // strokeOpacity: 0.2,
        fillOpacity: LocationServiceNs.COLOR_DRAW_BEFORE_FILL_OPACITY,
        fillColor: LocationServiceNs.COLOR_DRAW_BEFORE_FILL,
        zIndex: 50
      });

      this.getMap().add(this.polygon);
      // const poly = this.polygon;
      // 缩放地图到合适的视野级别
      // this.getMap().setFitView([poly]);
      let paths = pointList;
      let i = 0;
      if (paths.length % 2 === 0) {
        i = paths.length / 2;
      } else {
        i = (paths.length + 1) / 2;
      }
      this.getMap().setZoomAndCenter(LocationServiceNs.ZOOM_LOC_DRAW_SHOW, paths[i]);
    }
  }
  public getMap() {
    if (this.map) {
      return this.map;
    }
    this.map = this.initMap();
    return this.map;
  }
  processItem(fencePointList) {
    let arr = [];
    if (null == fencePointList || fencePointList.length == 0) {
      return arr;
    }
    for (let i = 0; i < fencePointList.length; i++) {
      let item = fencePointList[i];
      let a = [item.lonEnc, item.latEnc];
      arr.push(a);
    }
    return arr;
  }
  startDrawPolygon() {
    /**if (null != this.mapDrawingIn && null != this.mapDrawingIn[0]) {
      this.map.plugin('AMap.PolyEditor', () => {
        let polyEditor = new AMap.PolyEditor(this.map, this.polygon);
        polyEditor.open();
        this.polygon.ediot = polyEditor;
      });
    } else {*/
    if (1 === this.handleFlag && !this.polygon) {
      this.showPolygon();
    }
    // 添加地图绘制功能 鼠标左键开始绘制  右键关闭
    this.map.plugin('AMap.MouseTool', () => {
      this.mouseTool = new AMap.MouseTool(this.map);

      this.mouseTool.polygon({
        fillColor: LocationServiceNs.COLOR_DRAW_AFTER_FILL,
        strokeColor: LocationServiceNs.COLOR_DRAW_AFTER_STROKE
      });

      this.mouseTool.on('draw', (e) => {
        if (this.overlaysAdd.length > 0) {
          this.messageService.showAlertMessage('', '只能画一个围栏', 'warning');
          e.obj.hide();
          return;
        }
        this.overlaysAdd.push(e.obj);
        let overlay = e.obj.getPath();
        // if (null != this.fencePointList) {
        //   this.fencePointList = [];
        // }
        for (let i in overlay) {
          let item = { lonEnc: 0, latEnc: 0, pointIndex: 0 };
          item.lonEnc = overlay[i].lng;
          item.latEnc = overlay[i].lat;
          item.pointIndex = parseInt(i);
          this.fencePointListAdd.push(item);
        }
      });
    });
    // }
  }
  redrawDrawPolygon() {
    // let polygons = this.getMap().getAllOverlays('polygon');
    this.clearData();
    // if(this.polyEditor){
    //   this.polyEditor.close();
    // }
    // this.startDrawPolygon();
    // 添加地图绘制功能 鼠标左键开始绘制  右键关闭
    this.map.plugin('AMap.MouseTool', () => {
      this.mouseTool = new AMap.MouseTool(this.map);

      this.mouseTool.polygon({
        fillColor: LocationServiceNs.COLOR_DRAW_AFTER_FILL,
        strokeColor: LocationServiceNs.COLOR_DRAW_AFTER_STROKE
      });

      this.mouseTool.on('draw', (e) => {
        this.overlaysAdd.push(e.obj);
        let overlay = e.obj.getPath();
        // if (null != this.fencePointList) {
        //   this.fencePointList = [];
        // }
        for (let i in overlay) {
          let item = { lonEnc: 0, latEnc: 0, pointIndex: 0 };
          item.lonEnc = overlay[i].lng;
          item.latEnc = overlay[i].lat;
          item.pointIndex = parseInt(i);
          this.fencePointListAdd.push(item);
        }
      });
    });
  }
  savePolygonPoints() {
    if (1 === this.handleFlag && this.fencePointListAdd.length < 1) {
      this.fencePointListAdd = this.mapDrawingIn;
    }
    /**
    if (null != this.mapDrawingIn && null != this.mapDrawingIn[0] && this.polygon) {
      this.fencePointListAdd = [];
      this.polygon.ediot.close();
      const path = this.polygon.getPath();
      console.log(path);
      for (let i in path) {
        let item = { lonEnc: 0, latEnc: 0, pointIndex: 0 };
        item.lonEnc = path[i].lng;
        item.latEnc = path[i].lat;
        item.pointIndex = parseInt(i);
        this.fencePointListAdd.push(item);
      }
    } */
    this.mapDrawingOutEvent.emit(this.fencePointListAdd);
  }
  clearOverLay() {
    this.getMap().clearMap();
    this.fencePointListAdd = [];
  }
  /**
  startEditPolygon() {
    if (this.polygon) {
      this.map.plugin('AMap.PolyEditor', () => {
        let polyEditor = new AMap.PolyEditor(this.map, this.polygon);
        polyEditor.open();
      });
    }
  } */
}
