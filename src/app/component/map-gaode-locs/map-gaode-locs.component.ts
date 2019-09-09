import { AfterViewInit, Component, ElementRef, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LocationUtilService, LocationServiceNs } from '../../core/biz-services/location/location-service.service';

declare var window: any;
declare var $: any;
declare var AMapUI: any;
@Component({
  selector: 'app-map-gaode-locs',
  templateUrl: './map-gaode-locs.component.html',
  styleUrls: ['./map-gaode-locs.component.scss']
})
export class MapGaodeLocsComponent implements OnInit, AfterViewInit, OnChanges {

  // 地图
  @ViewChild('gaodeMapContainer') mapElement: ElementRef;
  @Input() status = 0;
  @Input() vehicles = [];
  @Output() gaodeZoomOutEvent = new EventEmitter<any>();
  public map: any;
  // 是否第一次加载map
  fristMap = true;

  public zoomForOne = '12';
  public satelliteLayer: any;
  public makers: any = [];
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
  infoWinsForSearch: any;
  constructor(private locationUtilService: LocationUtilService) { }

  ngOnInit() {
    const map = this.getMap();
  }
  ngAfterViewInit() {
    const map = this.getMap();
    if (!map) {
      return;
    }
    this.loadMapDistrictClusterAndMakers();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.vehicles && !this.fristMap) {
      this.refreshMapData();
    }
    if (changes.status && !this.fristMap) {
      this.changeMapModel();
    }
  }

  // 展示地图
  public getMap() {
    if (this.map) {
      return this.map;
    }
    if (!this.mapElement) {
      return null;
    }
    const lng = LocationServiceNs.LNG;
    const lat = LocationServiceNs.LAT;
    const map = new AMap.Map(this.mapElement.nativeElement, {
      resizeEnable: true,
      center: [lng, lat],
      zoom: LocationServiceNs.ZOOM_LOCS_GOO
    });
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],
      () => {
        const toolbar = new AMap.ToolBar();
        // 隐藏工具条方向盘
        toolbar.hide();
        map.addControl(toolbar);
      });
    this.map = map;
    this.map.on('zoomchange', (e) => {
      // if(this.infoWinsForSearch){
      //   this.getMap().clearInfoWindow();
      // }
      let center = this.map.getCenter();
      this.gaodeZoomOutEvent.emit({
        zoom: this.map.getZoom(),
        lng: center.getLng(),
        lat: center.getLat(),
        map: 'gaode'
      });
      if (null != this.makers && this.makers.length > 0) {
        this.map.remove(this.makers);
      }
      if (this.map.getZoom() <= 11) {
        // console.log('(zoom小于11)现在的层级：' + this.map.getZoom());
        window.distCluster.show();
      } else {
        // console.log('(zoom大于11)现在的层级：' + this.map.getZoom());
        window.distCluster.hide();
        this.makers = [];
        this.addMakers();
      }
    });
    this.map.on('dragend', (e) => {
      // if(this.infoWinsForSearch){
      //   this.map.clearInfoWindow();
      // }
      // this.i++;
      // console.log("GaoDe_dragend；第" + this.i + "次；zoom:" + this.map.getZoom());
      let center = this.map.getCenter();
      // console.log("GaoDe_dragend；第" + this.i + "次；center:" + center.lng + "," + center.lat);
      this.gaodeZoomOutEvent.emit({
        type: 'drag',
        zoom: this.map.getZoom(),
        lng: center.getLng(),
        lat: center.getLat(),
        map: 'gaode'
      });
    });
    return this.map;
  }

  // 加载相关组件
  loadMapDistrictClusterAndMakers() {
    AMapUI.load(['ui/geo/DistrictCluster', 'lib/$'], (DistrictCluster, $) => {
      window.DistrictCluster = DistrictCluster;
      // 启动页面
      this.initPage(DistrictCluster, $);
      // this.zoomChangeEvent();
    });
  }

  initPage(DistrictCluster, $) {
    window.distCluster = new DistrictCluster({
      map: this.getMap(), // 所属的地图实例
      zIndex: 11,
      autoSetFitView: false,
      getPosition: (item) => {
        if (!item) {
          return null;
        }
        // 返回经纬度
        return [item.lng, item.lat];
      },
      renderOptions: {
        // 基础样式
        featureStyle: {
          fillStyle: 'rgba(102,170,0,0.5)', // 填充色
          lineWidth: 0, // 描边线宽
          strokeStyle: 'rgb(31, 119, 180)', // 描边色
          // 鼠标Hover后的样式
          hoverOptions: {
            fillStyle: 'rgba(255,255,255,0.2)'
          }
        },
        // 特定区划级别的默认样式
        featureStyleByLevel: {
          // 全国
          country: {
            fillStyle: 'transparent'
          },
          // 省
          province: {
            fillStyle: 'transparent'
          },
          // 市
          city: {
            fillStyle: 'transparent'
          },
          // 区县
          district: {
            fillStyle: 'transparent'
          }
        },
        // 显示在所辖数据点的平均位置
        getClusterMarkerPosition: DistrictCluster.ClusterMarkerPositionStrategy.AVERAGE_POINTS_POSITION,
        featureEventSupport: true,
        clusterMarkerEventSupport: true,
        // 标注信息Marker上需要监听的事件
        clusterMarkerEventNames: ['click'],
        getClusterMarker: function (feature, dataItems, recycledMarker) {
          let container, title, body;
          const nodeClassNames = {
            title: 'amap-ui-district-cluster-marker-title',
            body: 'amap-ui-district-cluster-marker-body',
            container: 'amap-ui-district-cluster-marker'
          };

          if (recycledMarker) {

            container = recycledMarker.getContent();

            title = $(container).find('.' + nodeClassNames.title)[0];

            body = $(container).find('.' + nodeClassNames.body)[0];

          } else {

            container = document.createElement('div');

            title = document.createElement('span');

            title.className = nodeClassNames.title;

            body = document.createElement('span');

            body.className = nodeClassNames.body;

            container.appendChild(title);
            body.style.boxSizing = 'content-box';
            title.style.boxSizing = 'content-box';
            container.style.boxSizing = 'content-box';
            container.appendChild(body);
          }

          const props = feature.properties,
            routeNames = [];

          const classNameList = [nodeClassNames.container, 'level_' + props.level, 'adcode_' + props.adcode];

          container.className = classNameList.join(' ');

          if (routeNames.length > 0) {

            routeNames.push(props.name);

            container.setAttribute('title', routeNames.join('>'));

          } else {
            container.removeAttribute('title');
          }

          $(title).html(props.name);
          $(body).html(dataItems.length);

          const resultMarker = recycledMarker || new AMap.Marker({
            topWhenClick: true,
            offset: new AMap.Pixel(-20, -30),
            content: container
          });
          if (dataItems.length > 0) {
            return resultMarker;
          }
        }
      }
    });
    window.distCluster.setData(this.vehicles);
    this.fristMap = false;
  }
  clearGaodeInfoWinForOne() {
    // console.log("gaode");
    if (this.infoWinsForSearch) {
      this.getMap().clearInfoWindow();
    }
  }

  zoomChangeEvent() {
    this.getMap().on('zoomchange', (e) => {
      // if(this.infoWinsForSearch){
      //   this.getMap().clearInfoWindow();
      // }
      let center = this.getMap().getCenter();
      this.gaodeZoomOutEvent.emit({
        zoom: this.getMap().getZoom(),
        lng: center.getLng(),
        lat: center.getLat(),
        map: 'gaode'
      });
      if (null != this.makers && this.makers.length > 0) {
        this.getMap().remove(this.makers);
      }
      if (this.getMap().getZoom() <= 11) {
        // console.log('(zoom小于11)现在的层级：' + this.getMap().getZoom());
        window.distCluster.show();
      } else {
        // console.log('(zoom大于11)现在的层级：' + this.getMap().getZoom());
        window.distCluster.hide();
        this.makers = [];
        this.addMakers();
      }
    });
    this.getMap().on('dragend', (e) => {
      // if(this.infoWinsForSearch){
      //   this.getMap().clearInfoWindow();
      // }
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

  // 添加Maker
  addMakers() {
    if (this.makers.length > 0) {
      this.getMap().remove(this.makers);
      this.makers = [];
    }
    for (let i = 0; i < this.vehicles.length; i++) {
      const data = this.vehicles[i];
      const vehicleId = data.vehicleId; // 车辆id
      const lng = data.lng; // 偏移经度
      const lat = data.lat; // 偏移纬度
      const license = data.license; // 车牌号
      const onlineState = data.onlineState; // 在线状态
      const workState = data.workState; // 工作状态
      const repairState = data.repairState; // 维修状态
      const alarmState = data.alarmState; // 报警状态
      const orgName = data.orgName; // 机构名称
      const vehicleTypeName = data.vehicleTypeName; // 车型名称
      const teamGroupName = data.teamGroupName; // 班组名称
      const driverName = data.driverName; // 司机名
      let gpsTime = data.gpsTime; // sps时间
      const deviceId = data.deviceId;
      if (null == gpsTime) {
        gpsTime = '';
      }
      const pic = this.locationUtilService.getPicContainer(vehicleTypeName, onlineState, workState, repairState, alarmState);
      // var icon = new AMap.Icon({
      //   image: url,
      //   size: new AMap.Size(40, 40),
      // });
      const marker = new AMap.Marker({
        position: [lng, lat],
        // icon: icon,
        content: pic,
        offset: new AMap.Pixel(LocationServiceNs.OFFSET_GAODE_MAKER_X, LocationServiceNs.OFFSET_GAODE_MAKER_Y),
        title: '',
        map: this.getMap(),
        iconLabel: this.defaultLabel,
        iconStyle: this.defaultStyle,
        containerClassNames: 'my-marker',
      });
      const title = `<input type='hidden' value='${vehicleId}'/>${license}<input type='hidden' value='${deviceId}'/>`;
      // var title = license;
      const content = [];
      content.push(`<span style='text-align:right' class='col-sm-4'>机构：</span><span class='col-sm-8'>${orgName}</span>`);
      content.push(`<span style='text-align:right' class='col-sm-4'>类型：</span><span class='col-sm-8'>${vehicleTypeName}</span>`);
      content.push(`<span style='text-align:right' class='col-sm-4'>班组：</span><span class='col-sm-8'>${teamGroupName}</span>`);
      content.push(`<span style='text-align:right' class='col-sm-4'>司机：</span><span class='col-sm-8'>${driverName}</span>`);
      content.push(`<span style='text-align:right' class='col-sm-4'>报警：</span><span class='col-sm-8'>${alarmState}</span>`);
      content.push(`<span style='text-align:right' class='col-sm-4'>时间：</span><span class='col-sm-8'>${gpsTime}</span>`);
      const footContent = '<div style="text-align: right;padding: 5px">' +
        '<img src="../../../static/common/images/weibode.png" alt="">' +
        '<a href="javascript:void(0)" onclick="alertdata(\'' + vehicleId + '\')">详细信息</a></div>';
      // marker.content = this.createInfoWindow(title, content.join("<br>"), footContent);
      marker.icon = this.createInfoWindow(title, content.join('<br>'), footContent);
      // 给Marker绑定单击事件
      marker.on('click', this.markerClick);
      this.makers.push(marker);
    }
    this.getMap().add(this.makers);
  }
  openMakerInfoWindowIm(data) {
    const vehicleId = data.vehicleId; // 车辆id
    const lng = data.lng; // 偏移经度
    const lat = data.lat; // 偏移纬度
    const license = data.license; // 车牌号
    const onlineState = data.onlineState; // 在线状态
    const workState = data.workState; // 工作状态
    const repairState = data.repairState; // 维修状态
    const alarmState = data.alarmState; // 报警状态
    const orgName = data.orgName; // 机构名称
    const vehicleTypeName = data.vehicleTypeName; // 车型名称
    const teamGroupName = data.teamGroupName; // 班组名称
    const driverName = data.driverName; // 司机名
    let gpsTime = data.gpsTime; // sps时间
    const deviceId = data.deviceId;
    if (null == gpsTime) {
      gpsTime = '';
    }
    const title = `<input type='hidden' value='${vehicleId}'/>${license}<input type='hidden' value='${deviceId}'/>`;
    // var title = license;
    const content = [];
    content.push(`<span style='text-align:right' class='col-sm-4'>机构：</span><span class='col-sm-8'>${orgName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>类型：</span><span class='col-sm-8'>${vehicleTypeName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>班组：</span><span class='col-sm-8'>${teamGroupName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>司机：</span><span class='col-sm-8'>${driverName}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>报警：</span><span class='col-sm-8'>${alarmState}</span>`);
    content.push(`<span style='text-align:right' class='col-sm-4'>时间：</span><span class='col-sm-8'>${gpsTime}</span>`);
    const footContent = '<div style="text-align: right;padding: 5px">' +
      '<img src="../../../static/common/images/weibode.png" alt="">' +
      '<a href="javascript:void(0)" onclick="alertdata(\'' + vehicleId + '\')">详细信息</a></div>';
    // marker.content = this.createInfoWindow(title, content.join("<br>"), footContent);
    let win = this.createInfoWindow(title, content.join('<br>'), footContent);
    const p = [lng, lat];
    this.markerClickIm(win, p);
  }
  // 创建信息弹框
  createInfoWindow(title, content, footContent) {
    const map = this.getMap();
    // 关闭信息窗体
    function closeInfoWindow() {
      map.clearInfoWindow();
    }
    const show = this.detailModal;
    const detInfo = this.detailInfo;
    function showDetails_ifram(e) {
      show.show = true;
      const id = e.target.firstChild.value;
      const devId = e.target.lastChild.value;
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
    // var closeX = document.createElement("img");
    const closeX = document.createElement('span');
    top.className = 'info-top';
    titleD.innerHTML = title;
    titleD.onclick = showDetails_ifram;
    // closeX.src = "http:// webapi.amap.com/images/close2.gif";
    closeX.textContent = '×';
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    const middle = document.createElement('div');
    middle.className = 'info-middle';
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    /*maycustom
    var foot = document.createElement("div");
    foot.className = "info-foot ";
    foot.style.backgroundColor = 'white';
    foot.innerHTML = footContent;
    info.appendChild(foot);
    */

    // 定义箭头指向
    const bottom = document.createElement('div');
    bottom.className = 'info-bottom';
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.left = '15px';
    bottom.style.margin = '0 auto';
    const sharp = document.createElement('img');
    sharp.src = 'http://webapi.amap.com/images/sharp.png';
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
  }
  // 点击marker事件
  markerClick(e) {
    const infoWindow = new AMap.InfoWindow({
      isCustom: true,  // 使用自定义窗体
      content: e.target.icon,
      offset: new AMap.Pixel(16, -45)
    });
    infoWindow.open(this.getMap(), e.target.getPosition());
  }
  markerClickIm(infoW, position) {
    this.infoWinsForSearch = new AMap.InfoWindow({
      isCustom: true,  // 使用自定义窗体
      content: infoW,
      offset: new AMap.Pixel(16, -45)
    });
    this.infoWinsForSearch.open(this.getMap(), position);
  }
  // 数据变化，重新加载marker
  refreshMapData() {
    console.log(this.vehicles);
    if (!this.fristMap) {
      window.distCluster.setData(this.vehicles);
      this.zoomShow();
    }
  }
  zoomShow() {
    if (null != this.makers && this.makers.length > 0) {
      this.getMap().remove(this.makers);
    }
    if (this.getMap().getZoom() <= 11) {
      // console.log('refresh(zoom小于11)现在的层级：' + this.getMap().getZoom());
      window.distCluster.show();
    } else {
      // console.log('refresh(zoom大于11)现在的层级：' + this.getMap().getZoom());
      window.distCluster.hide();
      this.makers = [];
      this.addMakers();
    }

  }
  // 切换卫星状态
  changeMapModel(): void {
    if (this.status === 1) {
      this.satelliteLayer = new AMap.TileLayer.Satellite();
      this.getMap().add(this.satelliteLayer);
    } else {
      if (this.satelliteLayer) {
        this.getMap().remove(this.satelliteLayer);
      }
    }
  }
  // 取消弹框
  handleDetailCancel() {
    this.detailModal.show = false;
  }

  clearInfoWindow() {
    this.getMap().clearInfoWindow();
  }
}
