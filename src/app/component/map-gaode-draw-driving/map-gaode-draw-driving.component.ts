import { Component, ElementRef, ViewChild, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { LocationService, LocationUtilService, LocationServiceNs } from '../../core/biz-services/location/location-service.service';
import { ShowMessageService } from '../../widget/show-message/show-message';
@Component({
  selector: 'app-map-gaode-draw-driving',
  templateUrl: './map-gaode-draw-driving.component.html',
  styleUrls: ['./map-gaode-draw-driving.component.scss']
})
export class MapGaodeDrawDrivingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mapDrawDrivingIn;
  // @Input() mapDrawDrivingInShow;
  @Input() handleFlag: number = 0;
  @Output() gaodeDrawingDrivingOut = new EventEmitter<any>();
  //地图
  @ViewChild('gaodeDrawDrivingContainer') mapElement: ElementRef;
  public map: any;
  // public makerStart: any;
  // public makerEnd: any;
  public makerWay = [];
  public makerWayAdd = [];
  public mouseTool: any;
  public startIcon = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
    // 图标所用图片大小
    imageSize: new AMap.Size(135, 40),
    // 图标取图偏移量
    imageOffset: new AMap.Pixel(-9, -3)
  });
  public endIncon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
    imageSize: new AMap.Size(135, 40),
    imageOffset: new AMap.Pixel(-95, -3)
  });
  polyline: any;
  linePointList = [];
  startPoint;
  endPoint;
  addStartPoint;
  addEndPoint;
  @Input() status = 0;
  @Input() addOrEditNum = 0;
  public satelliteLayer: any;
  showStartMarker: any;
  showEndMarker: any;
  addStartMarker: any;
  addEndMarker: any;
  addPloyLine: any;
  constructor(private locationUtilService: LocationUtilService, private messageService: ShowMessageService) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.initMap();
    // this.initMouseTool();
    this.initLinePoints();
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.screenItem) {
    //   this.getMap();
    // }
    // if (changes.mapDrawDrivingInShow) {
    //   this.initLinePoints();
    // }
    if (changes.mapDrawDrivingIn || changes.addOrEditNum) {
      this.getMap();
      this.initLinePoints();
    }
    if (changes.status) {
      this.changeGaodeMapModel();
    }
  }
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
  clear(flag) {
    // this.getMap().clearMap();
    this.clearMapOverlays(flag);
    if (this.mouseTool) {
      this.mouseTool.close(false);
      this.getMap().remove(this.mouseTool);
      this.mouseTool = null;
    }
    // this.makerWay = [];
    // this.startPoint = null;
    // this.endPoint = null;
    // this.linePointList = [];
    // this.makerWayAdd = [];
  }
  clearMapOverlays(flag) {
    //展示起终点、途经点
    if (this.showStartMarker) {
      this.getMap().remove(this.showStartMarker);
      this.startPoint = null;
    }
    if (this.showEndMarker) {
      this.getMap().remove(this.showEndMarker);
      this.endPoint = null;
    }
    if (this.makerWay.length > 0) {
      this.getMap().remove(this.makerWay);
      this.makerWay = [];
    }
    //绘制增加起终点、途径地
    if (this.addStartMarker) {
      this.getMap().remove(this.addStartMarker);
      this.addStartPoint = null;
    }
    if (this.addEndMarker) {
      this.getMap().remove(this.addEndMarker);
      this.addEndPoint = null;
    }
    //是否清除新增途经点
    if (flag) {
      this.removeMakerWay();
    }
    // if(this.makerWayAdd.length>0){
    //   this.getMap().remove(this.makerWayAdd);
    //   this.makerWayAdd = [];
    // }
    //新增线
    if (this.addPloyLine) {
      this.getMap().remove(this.addPloyLine);
      this.linePointList = [];
    }
    //原始线
    if (this.polyline) {
      this.getMap().remove(this.polyline);
      this.polyline = null;
    }

  }
  initLinePoints() {
    this.clear(true);
    //查看、编辑
    if (this.handleFlag !== 0) {
      this.showLinePoints();
    }
  }
  startAddOrEditPloyLine() {
    //编辑
    if (1 === this.handleFlag) {
      this.showLinePoints();
    };
    /**
    if (1 === this.handleFlag) {
      if (this.polyline && this.polyline.ediot) {
        this.polyline.ediot.close();
      }
      this.showLinePoints();
      this.getMap().plugin('AMap.PolyEditor', () => {
        let polyEditor = new AMap.PolyEditor(this.map, this.polyline);
        polyEditor.open();
        this.polyline.ediot = polyEditor;
      });
    }; */

    this.initMouseTool('polyline');
    // this.drawPolyline();
  }
  drawPolyline() {
    this.getMouseTool().polyline({
      strokeColor: '#80d8ff'
    });
    this.getMouseTool().on('draw', (e) => {
      // this.overlays.push(e.obj);
      if (this.linePointList.length > 0) {
        // console.log(e);
        // console.log(this.getMap().getAllOverlays());
        e.obj.hide();
        this.messageService.showAlertMessage('', '只能画一条路线', 'warning');
        return;
      }
      let overlay = e.obj.getPath();
      this.addPloyLine = e.obj;
      for (let i = 0; i < overlay.length; i++) {
        let item = { lonEnc: 0, latEnc: 0, pointIndex: 0, pointType: 0 };
        item.lonEnc = overlay[i].lng;
        item.latEnc = overlay[i].lat;
        item.pointIndex = i;
        if (i === 0) {
          item.pointType = 1;
          this.addStartPoint = [item.lonEnc, item.latEnc];
        }
        if (i === (overlay.length - 1)) {
          item.pointType = 3;
          this.addEndPoint = [item.lonEnc, item.latEnc];
        }
        this.linePointList.push(item);
      }
      this.processMakersAdd(this.addStartPoint, this.addEndPoint);
    });
  }
  initMouseTool(type) {
    if (this.mouseTool) {
      this.mouseTool.close();
    }
    // 添加地图绘制功能 鼠标左键开始绘制  右键关闭
    this.getMap().plugin('AMap.MouseTool', () => {
      this.mouseTool = new AMap.MouseTool(this.map);
      if ('polyline' === type) {
        this.drawPolyline();
      }
      if ('makerWay' === type) {
        this.drawMaker();
      }
    });
  }
  drawMaker() {
    this.getMouseTool().marker({
    });
    this.getMouseTool().on('draw', (e) => {
      let maker = e.obj;
      this.makerWayAdd.push(maker);
    });
  }
  saveDriving() {
    //编辑
    if (this.handleFlag === 1 && this.linePointList.length < 1) {
      this.linePointList = this.mapDrawDrivingIn;
    }
    /**
    if (this.handleFlag === 1) {
      this.linePointList = [];
      if (this.polyline && this.polyline.ediot) {
        this.polyline.ediot.close();
      }
      if (this.polyline) {
        const path = this.polyline.getPath();
        console.log(path);
        for (let i = 0; i < path.length; i++) {
          let item = { lonEnc: 0, latEnc: 0, pointIndex: 0, pointType: 0 };
          item.lonEnc = path[i].lng;
          item.latEnc = path[i].lat;
          item.pointIndex = i;
          if (0 === i) {
            item.pointType = 1;
          }
          if ((path.length - 1) === i) {
            item.pointType = 3;
          }
          this.linePointList.push(item);
        }
      }
    } */
    if (this.makerWayAdd.length > 0) {
      for (let i = 0; i < this.makerWayAdd.length; i++) {
        let maker = this.makerWayAdd[i];
        let lng = maker.Mg.position.lng;
        let lat = maker.Mg.position.lat;
        let item = { lonEnc: 0, latEnc: 0, pointIndex: 0, pointType: 0 };
        item.lonEnc = lng;
        item.latEnc = lat;
        item.pointType = 2;
        this.linePointList.push(item);
      }
    }
    this.gaodeDrawingDrivingOut.emit(this.linePointList);
  }
  ////编辑、增加
  redrawDriving() {
    // let polygons = this.getMap().getAllOverlays('polygon');
    // this.getMap().clearMap();
    // this.linePointList = [];
    // this.makerWay = [];
    this.clear(false);
    this.initMouseTool('polyline');
  }
  showLinePoints() {
    if (this.polyline) {
      return;
    }
    if (null != this.mapDrawDrivingIn && null != this.mapDrawDrivingIn[0]) {
      // this.map.setFitView(this.mapDrawingIn); 

      let pointList = this.processItem(this.mapDrawDrivingIn);
      // this.map.setFitView(pointList);
      this.polyline = new AMap.Polyline({
        path: pointList,
        // isOutline: true,
        // outlineColor: '#ffeeff',
        // borderWeight: 3,
        strokeColor: LocationServiceNs.COLOR_DRAW_BEFORE,
        strokeOpacity: 1,
        strokeWeight: LocationServiceNs.WEIGHT_DRAW,
        // 折线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
        // lineJoin: 'round',
        // lineCap: 'round',
        // zIndex: 50,
      });

      this.polyline.setMap(this.getMap());
      // const poly = this.polyline;
      // 缩放地图到合适的视野级别
      // this.getMap().setFitView([poly]);
      let paths = pointList;
      let i = 0;
      if (paths.length % 2 === 0) {
        i = paths.length / 2;
      } else {
        i = (paths.length + 1) / 2;
      }
      // let c = new AMap.LngLat(paths[i][0], paths[i][1]);
      this.getMap().setZoomAndCenter(LocationServiceNs.ZOOM_LOC_DRAW_SHOW, paths[i]);
      this.processMakers(this.startPoint, this.endPoint);
    }
  }
  processMakers(startP, endP) {
    if (startP) {
      const mapInfo = { map: this.getMap(), icon: this.startIcon, point: startP };
      this.showStartMarker = this.locationUtilService.addMaker(mapInfo, null);
    }
    if (endP) {
      const mapInfo = { map: this.getMap(), icon: this.endIncon, point: endP };
      this.showEndMarker = this.locationUtilService.addMaker(mapInfo, null);
    }
  }
  processMakersAdd(startP, endP) {
    if (startP) {
      const mapInfo = { map: this.getMap(), icon: this.startIcon, point: startP };
      this.addStartMarker = this.locationUtilService.addMaker(mapInfo, null);
    }
    if (endP) {
      const mapInfo = { map: this.getMap(), icon: this.endIncon, point: endP };
      this.addEndMarker = this.locationUtilService.addMaker(mapInfo, null);
    }
  }
  processItem(pointList) {
    let arr = [];
    if (null == pointList || pointList.length == 0) {
      return arr;
    }
    for (let i = 0; i < pointList.length; i++) {
      let item = pointList[i];
      let a = [item.lonEnc, item.latEnc];
      if (item.pointType === 1) {
        this.startPoint = a;
      }
      if (item.pointType === 3) {
        this.endPoint = a;
      }
      if (item.pointType === 2) {
        const mapInfo = { map: this.getMap(), icons: 'any', point: a };
        //显示途径点
        let maker = this.locationUtilService.addMaker(mapInfo, null);
        this.makerWay.push(maker);
      } else {
        arr.push(a);
      }
    }
    return arr;
  }
  /** 
  initLinePointList() {
    if (null != this.mapDrawDrivingInShow && null != this.mapDrawDrivingInShow[0]) {
      this.proccessLinePointList();
    }
  }
  proccessLinePointList() {
    AMap.plugin('AMap.Driving', () => {
      //构造路线导航类
      let driving = new AMap.Driving({
        map: this.getMap()
        //panel: "panel"
      });
      let pointStart;
      let pointEnd;
      let pointWay = [];
      for (let i = 0; i < this.mapDrawDrivingInShow.length; i++) {
        let item = this.mapDrawDrivingInShow[i];
        let pointIndex = item.pointIndex;
        if (pointIndex === 1) {
          // makerStart = this.locationUtilService.makeMaker(item.lonEnc, item.latEnc, this.startIcon, 'makerStart');
          pointStart = new AMap.LngLat(item.lonEnc, item.latEnc);
        } else if (pointIndex === 2) {
          // makerEnd = this.locationUtilService.makeMaker(item.lonEnc, item.latEnc, this.startIcon, 'makerEnd');
          pointEnd = new AMap.LngLat(item.lonEnc, item.latEnc);
        } else {
          let lng = item.lonEnc;
          let lat = item.latEnc;
          let lngLat = new AMap.LngLat(lng, lat)
          pointWay.push(lngLat);
        }
      }
      // let waypoints = this.getWayPoints(makerWay);
      // 根据起终点经纬度规划驾车导航路线
      driving.search(pointStart, pointEnd, {
        waypoints: pointWay
      }, (status, result) => {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          // this.messageService.showAlertMessage('', '绘制路线完成', 'warning');
        } else {
          this.messageService.showAlertMessage('', '绘制路线失败：' + result, 'warning');
        }
      });
    });
    // this.drawDrivingForShow(makerStart, makerEnd, makerWay);
  }*/
  initMap() {
    if (!this.map) {
      let lng = null;
      let lat = null;
      if (this.mapDrawDrivingIn && this.mapDrawDrivingIn.length > 1) {
        lng = this.mapDrawDrivingIn[0].lonEnc; // 偏移经度
        lat = this.mapDrawDrivingIn[0].latEnc; // 偏移纬度
      }
      this.map = this.locationUtilService.getGaodeMap(this.mapElement, this.map, lng, lat, LocationServiceNs.ZOOM_LOC_DRAW);
    }
  }
  getMap() {
    if (this.map) {
      return this.map;
    }
    this.initMap();
    return this.map;
  }
  drawMakerWay() {
    let options = this.locationUtilService.getMakerOptionsWay('//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png');
    this.initMouseTool('makerWay');
  }
  getMouseTool() {
    if (this.mouseTool) {
      return this.mouseTool;
    }
    this.initMouseTool('');
    return this.mouseTool;
  }
  removeMakerWay() {
    if (this.makerWayAdd.length > 0) {
      this.getMap().remove(this.makerWayAdd);
      this.makerWayAdd = [];
    }
  }

  /**
   draw(type, options) {
    switch (type) {
      case 'makerStart': {
        this.getMouseTool().marker(options);
        break;
      }
      case 'makerEnd': {
        this.getMouseTool().marker(options);
        break;
      }
      case 'makerWay': {
        this.getMouseTool().marker({
        });
        this.getMouseTool().on('draw', (e) => {
          let maker = e.obj;
          this.makerWay.push(maker);
        });
        break;
      }
    }
  }
  initMouseTool() {
    if (this.mouseTool) {
      return this.mouseTool;
    }
    // 添加地图绘制功能 鼠标左键开始绘制  右键关闭
    this.getMap().plugin('AMap.MouseTool', () => {
      this.mouseTool = new AMap.MouseTool(this.getMap());
      this.mouseTool.on('draw', (e) => {
        let maker = e.obj;
        let type = maker.Mg.drawDrivingType;
        if ('makerStart' === type) {
          this.makerStart = maker;
        } else if ('makerEnd' === type) {
          this.makerEnd = maker;
        } else {
          this.makerWay.push(maker);
        }
      });
      return this.mouseTool;
    });
  }
  drawDriving() {
    this.drawDrivingForShow(this.makerStart, this.makerEnd, this.makerWay);
  }
  drawDrivingForShow(makerStart, makerEnd, makerWay) {
    if (null == makerStart) {
      this.messageService.showAlertMessage('', '请绘制起点', 'warning');
      return;
    }
    if (null == makerEnd) {
      this.messageService.showAlertMessage('', '请绘制终点', 'warning');
      return;
    }
    this.getMap().clearMap();
    // this.map.plugin('AMap.Driving', () => { });
    AMap.plugin('AMap.Driving', () => {
      //构造路线导航类
      let driving = new AMap.Driving({
        map: this.getMap()
        //panel: "panel"
      });
      let waypoints = this.getWayPoints(makerWay);
      // 根据起终点经纬度规划驾车导航路线
      driving.search(new AMap.LngLat(makerStart.Mg.position.lng, makerStart.Mg.position.lat), new AMap.LngLat(makerEnd.Mg.position.lng, makerEnd.Mg.position.lat), {
        waypoints: waypoints
      }, (status, result) => {
        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
        if (status === 'complete') {
          // this.messageService.showAlertMessage('', '绘制路线完成', 'warning');
        } else {
          this.messageService.showAlertMessage('', '绘制路线失败：' + result, 'warning');
        }
      });
    });
  }
  getWayPoints(makerWay) {
    let pointr = [];
    if (makerWay) {
      if (makerWay.length > 0) {
        makerWay.forEach(element => {
          let point = new AMap.LngLat(element.Mg.position.lng, element.Mg.position.lat);
          pointr.push(point);
        });
      }
    }
    return pointr;
  }
  drawMakerStart() {
 
    let options = this.locationUtilService.getMakerOptions(this.startIcon, 'makerStart');
    this.draw('makerStart', options);
  }
  drawMakerEnd() {
    let options = this.locationUtilService.getMakerOptions(this.endIncon, 'makerEnd');
    this.draw('makerEnd', options);
  }
  redrawDrawDriving() {
    // let polygons = this.getMap().getAllOverlays('polygon');
    this.getMap().clearMap();
    this.makerStart = null;
    this.makerEnd = null;
    this.makerWay = [];
  }
  saveDrawDriving() {
    let linePointList = [];
    let pointIndex = 1;
    if (this.makerStart) {
      this.proccessItem(linePointList, pointIndex++, this.makerStart);
    }
    if (this.makerEnd) {
      this.proccessItem(linePointList, pointIndex++, this.makerEnd);
    }
    if (null != this.makerWay && this.makerWay.length > 0) {
      this.makerWay.forEach(element => {
        this.proccessItem(linePointList, pointIndex++, element);
      });
    };
    this.gaodeDrawingDrivingOut.emit(linePointList);
  }
  proccessItem(linePointList, pointIndex, maker) {
    if (maker) {
      let lng = maker.Mg.position.lng;
      let lat = maker.Mg.position.lat;
      let item = {
        lonEnc: lng,
        latEnc: lat,
        pointIndex: pointIndex
      };
      linePointList.push(item);
      // pointIndex++;
    }
  } */
}
