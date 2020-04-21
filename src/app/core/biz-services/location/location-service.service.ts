import { Injectable, Injector } from '@angular/core';
import { HttpUtilNs, HttpUtilService } from '../../infra/http/http-util.service';
import { Observable } from 'rxjs';

export namespace LocationServiceNs {
  export interface UfastHttpAnyResModel extends HttpUtilNs.UfastHttpResT<any> {
  }
  /**多屏监控数据model 数据对接查看*/
  export interface UfastHttpVehiclesMapResModel extends HttpUtilNs.UfastHttpResT<any> {
    vehicleMonitorId: string;//id，可选
    screenSeq?: number;//屏幕排序序号，数据按此字段升序排序。从0开始的自然数。20190505序号完全由后台维护，前台不使用
    vehicleId: string;//车辆id
    deviceId: string;//终端id
    lng: number;//偏移经度
    lat: number;//偏移纬度
    lngEnc: number;//偏移经度
    latEnc: number;//偏移纬度
    license: string;//车牌号
    onlineState: string;//取值范围：在线、离线
    workState: string;//取值范围：工作、闲置
    repairState: string;//取值范围：维修、正常
    alarmState: string;//取值范围：报警、正常
    onlineStateKey: string;//取值范围：在线、离线
    workStateKey: string;//取值范围：工作、闲置
    repairStateKey: string;//取值范围：维修、正常
    alarmStateKey: string;//取值范围：报警、正常
    orgName: string;//机构名称
    vehicleModelName: string;//车辆型号
    vehicleTypeName: string;//车型名称
    teamGroupName: string;//班组名称
    driverName: string;//司机名
    gpsTime: string;//sps时间
  }
  /**位置分布数据model */
  export interface UfastHttpVehiclesMapResModel extends HttpUtilNs.UfastHttpResT<any> {
    id?: number;//id，可选
    screenSeq?: number;//屏幕排序序号，数据按此字段升序排序。从0开始的自然数
    vehicleId: string;//车辆id
    deviceId: string;//终端id
    lng: number;//偏移经度
    lat: number;//偏移纬度
    license: string;//车牌号
    onlineState: string;//取值范围：在线、离线
    workState: string;//取值范围：工作、闲置
    repairState: string;//取值范围：维修、正常
    alarmState: string;//取值范围：报警、正常
    onlineStateKey: string;//取值范围：在线、离线
    workStateKey: string;//取值范围：工作、闲置
    repairStateKey: string;//取值范围：维修、正常
    alarmStateKey: string;//取值范围：报警、正常
    orgName: string;//机构名称
    vehicleModelName: string;//车辆型号
    vehicleTypeName: string;//车型名称
    teamGroupName: string;//班组名称
    driverName: string;//司机名
    gpsTime: string;//sps时间
  }
  /** 机构车辆树*/
  export interface OrgVehTreeModel {
    isVeh: boolean;//是否是车辆；取值范围true,false
    title: string;//如果是车辆，返回车辆车牌号；如果不是，返回机构名称
    key: string;//如果是车辆，返回车辆车牌号；如果不是，返回机构code
    icon?: string;//如果是车辆，返回anticon anticon-car-o；如果不是，返回空
    isLeaf: boolean;//是否是叶子节点(无子节点)；取值范围true,false
    selectable: boolean;//是否能被选中；如果是车辆，可被，否则不可被选；取值范围true,false
    expanded: boolean;//是否展开；取值范围true,false
    children?: OrgVehTreeModel[];
  }
  /** 历史轨迹model*/
  export interface HisLocModel {
    deviceId: number;
    lng: number;
    lat: number;
    lngs: number;
    lats: number;
    license: string;
    loc?: string;
    state: string;
    speed: number;
    alarmState: string;
    teamGroupName: string;
    driverName: string;
    gpsTime: string;
  }
  //首页地图获取数据后台url
  const URL_GETVEHICLESMAPDATA = "/placeDisposition/searchList";
  //可返回已经删除的车辆
  const URL_GETVEHICLESMAPDATA_HASNOTEXIST = "/placeDisposition/getItemByVehicleId";
  const URL_GETLICENSELIST = "/vehicleManage/searchList";
  const URL_GETSTATISTICSNUM = "/placeDisposition/statisticsVehNum";
  const URL_GETSPECREPAIRNUM = "/systemScreen/repairInfos";
  const URL_GETSPECREPAIRNUM_BYORG = "/systemScreen/repairInfosByOrgId";
  const URL_GETCITYSTATISTICSDATA = "/systemScreen/getPlaceNums";
  //多屏监控
  const URL_GETSCREENDATA = "/screensMonitor/list";
  const URL_ADDSCREENVEHDATA = "/screensMonitor/add";
  const URL_MODSCREENVEHDATA = "/screensMonitor/update";
  const URL_DELSCREENVEHDATA = "/screensMonitor/remove";
  const URL_GETORGVEHSTREE = "/vehicleManage/orgVehsTree";
  const URL_MODLOCVEHS = "/modLocVehs";
  export const LNG = 117.24135;
  export const LAT = 28.325019;
  export const LNG_SCREEN = 117.23156647354133;
  export const LAT_SCREEN = 28.329413352259394;

  //历史轨迹
  const URL_GETHISLOCDATA = "/cehicleList/historyInfo";
  export const ZOOM_LOC_PALY = 16;
  export const ZOOM_LOC_DRAW = 16;
  export const ZOOM_LOC_DRAW_SHOW = 15;
  export const COLOR_DRAW_BEFORE = '#3366FF';
  export const WEIGHT_DRAW = 2;
  export const COLOR_DRAW_BEFORE_STROKE = '#3366FF';
  export const COLOR_DRAW_BEFORE_FILL = '#3366FF';
  export const COLOR_DRAW_BEFORE_FILL_OPACITY = 0.4;
  export const COLOR_DRAW_AFTER_STROKE = '#ff0000';
  export const COLOR_DRAW_AFTER_FILL = '#ff0000';
  export const COLOR_DRAW_AFTER_FILL_OPACITY = 0.4;
  export const ZOOMFORONE = 18;
  export const HISLOC_LINE_COLOR = '#ff0000';
  export const HISLOC_LINE_WIDTH = 6;
  export const HISLOC_PASSED_LINE_COLOR = '#000000';
  export const HISLOC_PASSED_LINE_WIDTH = 3;
  export const OFFSET_GAODE_MAKER_X = -36;
  export const OFFSET_GAODE_MAKER_Y = -67;
  export const OFFSET_GOOGLE_MAKER_X = 36;
  export const OFFSET_GOOGLE_MAKER_Y = 76;
  export const ZOOM_LOCS_GOO = 7;
  export const ZOOM_LOCS_GOO_FOR_SCREEN = 16;
  export class LocationServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;

    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
     * 获取地图上车辆及车辆位置数据
     * @param filter
     * 参数1: state (string, optional): 车辆状态，工作=0，闲置=1，维修=2，报警=3，离线=4
     * 参数2：license (string, optional): 车牌号
     * 当只传参数1时，查询各状态下的车辆位置数据
     * 当只传参数2时，查询单车车辆位置数据
     * 当不传时，查询全局数据
     */
    public getVehiclesMapData(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get(URL_GETVEHICLESMAPDATA, filter, this.defaultConfig);
    }
    /**
     * 
     * @param filter vehicleId
     */
    public getVehiclesMapDataNotExist(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get(URL_GETVEHICLESMAPDATA_HASNOTEXIST, filter, this.defaultConfig);
    }
    /**
    * 历史轨迹车辆及车辆位置数据
    * @param filter
    */
    public getHisLocData(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_GETHISLOCDATA, filter, this.defaultConfig);
    }
    /**
     * 根据指定字符查询符合条件的车牌号
     * @param filter 传入大于4位的车牌号
     */
    public getLicenseList(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_GETLICENSELIST, filter, this.defaultConfig);
    }
    /**
     * 获取全局各车辆状态统计数据
     * @param filter
     */
    public getStatisticsNum(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get(URL_GETSTATISTICSNUM, filter, this.defaultConfig);

    }
    /**
     * 获取全局维修情况数据
     * @param filter
     */
    public getSpecRepairNum(filter): Observable<any> {
      return this.http.Get(URL_GETSPECREPAIRNUM_BYORG, filter, this.defaultConfig);

    }
    /**
    * 获取全局城市数据情况
    * @param filter
    */
    public getCityStatisticsData(filter): Observable<any> {
      return this.http.Get(URL_GETCITYSTATISTICSDATA, filter, this.defaultConfig);

    }
  }
  export class LocationUtilServiceClass {
    //定义IconLable的默认样式
    defaultLabel = {
      //设置样式
      style: {
        color: '#f55707',
        fontSize: '120%',
        marginTop: '15px'
      }
    }
    defaultStyle = {
      src: '../../../static/common/images/poi-green.png',
      style: {
        width: '30px',
        height: '30px'
      }
    };
    geocoder: any;
    constructor(private injector: Injector) {
    }
    /**
     * 网络中心计算法
     * 与使用计算中点作为中心点基本一致
     * @param lngLatArr 
     */
    getCenterPoint(lngLatArr) {
      const total = lngLatArr.length;
      let X = 0, Y = 0, Z = 0;
      lngLatArr.map((lnglat) => {
        const lng = lnglat[0] * Math.PI / 180;
        const lat = lnglat[1] * Math.PI / 180;
        let x, y, z;
        x = Math.cos(lat) * Math.cos(lng);
        y = Math.cos(lat) * Math.sin(lng);
        z = Math.sin(lat);
        X += x;
        Y += y;
        Z += z;
      });

      X = X / total;
      Y = Y / total;
      Z = Z / total;

      const Lng = Math.atan2(Y, X);
      const Hyp = Math.sqrt(X * X + Y * Y);
      const Lat = Math.atan2(Z, Hyp);

      return [Lng * 180 / Math.PI, Lat * 180 / Math.PI];
    };
    gaodeZoomChangeEvent(map, gaodeZoomOutEvent) {
      map.on('zoomchange', (e) => {
        let center = map.getCenter();
        gaodeZoomOutEvent.emit({
          zoom: map.getZoom(),
          lng: center.getLng(),
          lat: center.getLat(),
          map: 'gaode'
        });
      });
      map.on('dragend', (e) => {
        // this.i++;
        // console.log("GaoDe_dragend；第" + this.i + "次；zoom:" + map.getZoom());
        let center = map.getCenter();
        // console.log("GaoDe_dragend；第" + this.i + "次；center:" + center.lng + "," + center.lat);
        gaodeZoomOutEvent.emit({
          type: 'drag',
          zoom: map.getZoom(),
          lng: center.getLng(),
          lat: center.getLat(),
          map: 'gaode'
        });
      });
    }
    gaodeOffZoomChangeEvent(map, gaodeZoomOutEvent) {
      map.off('zoomchange', (e) => {
        let center = map.getCenter();
        gaodeZoomOutEvent.emit({
          zoom: map.getZoom(),
          lng: center.getLng(),
          lat: center.getLat(),
          map: 'gaode'
        });
      });
      map.off('dragend', (e) => {
        // this.i++;
        // console.log("GaoDe_dragend；第" + this.i + "次；zoom:" + map.getZoom());
        let center = map.getCenter();
        // console.log("GaoDe_dragend；第" + this.i + "次；center:" + center.lng + "," + center.lat);
        gaodeZoomOutEvent.emit({
          type: 'drag',
          zoom: map.getZoom(),
          lng: center.getLng(),
          lat: center.getLat(),
          map: 'gaode'
        });
      });
    }
    googleZoomAndDragendChange(map, googleZoomOutEvent) {
      map.addListener('zoom_changed', () => {
        let center = map.getCenter();
        googleZoomOutEvent.emit({
          zoom: map.getZoom(),
          lng: center.lng(),
          lat: center.lat(),
          map: 'google'
        });
      });
      map.addListener('dragend', () => {
        let center = map.getCenter();
        googleZoomOutEvent.emit({
          zoom: map.getZoom(),
          lng: center.lng(),
          lat: center.lat(),
          map: 'google'
        });
      });
    }
    googleZoomChange(map, googleZoomOutEvent) {
      const event = map.addListener('zoom_changed', () => {
        let center = map.getCenter();
        googleZoomOutEvent.emit({
          zoom: map.getZoom(),
          lng: center.lng(),
          lat: center.lat(),
          map: 'google'
        });
      });
      return event;
    }
    googleDragendChange(map, googleZoomOutEvent) {
      const event = map.addListener('dragend', () => {
        let center = map.getCenter();
        googleZoomOutEvent.emit({
          zoom: map.getZoom(),
          lng: center.lng(),
          lat: center.lat(),
          map: 'google'
        });
      });
      return event;
    }
    googleOffZoomChange(event) {
      google.maps.event.removeListener(event);
    }
    procNodes(procNodes) {
      let nodes = [];
      if (!procNodes || procNodes.length < 1) {
        return [];
      }
      for (let i = 0; i < procNodes.length; i++) {
        let item = procNodes[i];
        let itemR: any = {};
        if (this.isNotNull(item.key)) {
          itemR.key = item.key;
        }
        if (this.isNotNull(item.orgId)) {
          itemR.orgId = item.orgId;
        }
        if (this.isNotNull(item.title)) {
          itemR.title = item.title;
        }
        if (this.isNotNull(item.icon)) {
          itemR.icon = item.icon;
        }
        if (this.isNotNull(item.leaf)) {
          itemR.isLeaf = item.leaf;
        }
        if (this.isNotNull(item.pid)) {
          itemR.pid = item.pid;
        }
        if (this.isNotNull(item.selectable)) {
          itemR.selectable = item.selectable;
        }
        if (this.isNotNull(item.veh)) {
          itemR.veh = item.veh;
        }
        if (item.children && item.children.length > 0) {
          itemR.children = this.procNodes(item.children);
        }
        nodes[i] = itemR;
      }
      return nodes;
    }
    initDateTime(data): string {
      let month = data.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = data.getDate();
      day = day < 10 ? '0' + day : day;
      let hour = data.getHours();
      hour = hour < 10 ? '0' + hour : hour;
      let minute = data.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      let second = data.getSeconds();
      second = second < 10 ? '0' + second : second;
      return `${data.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    changeGoogleMapModel(status, googleMap) {
      const result = status === 1 ? 'hybrid' : 'roadmap';
      googleMap.setMapTypeId(result);
    }
    changeGaodeMapModel(status, gaodeMap, satelliteLayerIn) {
      if (status === 1) {
        satelliteLayerIn = new AMap.TileLayer.Satellite();
        gaodeMap.add(satelliteLayerIn);
        return satelliteLayerIn;
      } else {
        if (satelliteLayerIn) {
          gaodeMap.remove(satelliteLayerIn);
          return null;
        }
      }
    }
    getGoogleMap(mapElement, googleMap, lng, lat, zoom, status) {
      if (googleMap) {
        return googleMap;
      }
      if (null == lng || null == lat) {
        lng = LNG;
        lat = LAT;
      }
      const mapProp = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoom,
        mapTypeControl: false,
        mapTypeId: status === 1 ? 'hybrid' : 'roadmap',
        disableDefaultUI: true
      };
      googleMap = new google.maps.Map(mapElement.nativeElement, mapProp);
      return googleMap;
    }
    getGaodeMap(mapElement, gaodeMap, lng, lat, zoom) {
      if (gaodeMap) {
        return gaodeMap;
      }
      if (null == lng || null == lat) {
        lng = LNG;
        lat = LAT;
      }
      const map = new AMap.Map(mapElement.nativeElement, {
        resizeEnable: true,
        center: [lng, lat],
        zoom: zoom
      });
      // AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],
      //   function () {
      //     var toolbar = new AMap.ToolBar();
      //     map.addControl(toolbar);
      //   });
      // this.map = map;
      return map;
    }
    initGaodeMap(mapElement, lng, lat, zoom) {
      if (null == lng || null == lat) {
        lng = LNG;
        lat = LAT;
      }
      const map = new AMap.Map(mapElement.nativeElement, {
        resizeEnable: true,
        center: [lng, lat],
        zoom: zoom
      });
      // AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],
      //   function () {
      //     var toolbar = new AMap.ToolBar();
      //     map.addControl(toolbar);
      //   });
      // this.map = map;
      return map;
    }
    // locToLngLat(loc) {
    //   if (!this.geocoder) {
    //     this.loadGeocoder();
    //   }
    //   this.geocoder.getLocation(loc, (status, result) => {
    //     if (status === 'complete' && result.geocodes.length) {
    //       return result.geocodes[0].location;
    //     } else {
    //       return JSON.stringify(result);
    //     }
    //   });
    // }
    lngLatToLoc(lnglat, posInfo) {
      if (!this.geocoder) {
        this.loadGeocoder(lnglat, posInfo);
        if (this.geocoder) {
          this.geocoder.getAddress(lnglat, (status, result) => {
            if (status === 'complete' && result.regeocode) {
              var address = result.regeocode.formattedAddress;
              posInfo.address = address;
            }
          });
        }
      }
      if (this.geocoder) {
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            var address = result.regeocode.formattedAddress;
            posInfo.address = address;
          }
        });
      }
    }
    loadGeocoder(lnglat, posInfo) {
      AMap.plugin('AMap.Geocoder',
        () => {
          this.geocoder = new AMap.Geocoder();
          if (this.geocoder) {
            this.geocoder.getAddress(lnglat, (status, result) => {
              if (status === 'complete' && result.regeocode) {
                var address = result.regeocode.formattedAddress;
                posInfo.address = address;
              }
            });
          }
        });
      return this.geocoder;
    }
    getMakerOptions(icon, type) {
      let options = {
        icon: icon,
        title: '',
        iconLabel: this.defaultLabel,
        iconStyle: this.defaultStyle,
        drawDrivingType: type
      };
      return options;
    }
    getMakerOptionsWay(icon) {
      let options = {
        icon: icon,
        offset: new AMap.Pixel(-13, -30)
      };
      return options;
    }
    makeMaker(lng, lat, icon, type) {
      let position = AMap.LngLat(lng, lat);
      let maker = new AMap.Marker({
        position: position,
        icon: icon,
        title: '',
        iconLabel: this.defaultLabel,
        iconStyle: this.defaultStyle,
        drawDrivingType: type
      });
      return maker;
    }
    addMakerForShow(mapInfo, infoWin) {
      let maker;
      if (mapInfo.pic) {
        maker = new AMap.Marker({
          position: mapInfo.point,
          content: mapInfo.pic,
          offset: new AMap.Pixel(OFFSET_GAODE_MAKER_X, OFFSET_GAODE_MAKER_Y),
          title: '',
          iconLabel: this.defaultLabel,
          iconStyle: this.defaultStyle,
          map: mapInfo.map,
          zIndex: 10000,
          cursor: ''
        });
        mapInfo.map.add(maker);
      }
      if (mapInfo.icon) {
        maker = new AMap.Marker({
          position: mapInfo.point,
          icon: mapInfo.icon,
          title: '',
          iconLabel: this.defaultLabel,
          iconStyle: this.defaultStyle,
          map: mapInfo.map,
        });
        mapInfo.map.add(maker);
      }
      if (null != mapInfo.icons) {
        maker = new AMap.Marker({
          position: mapInfo.point,
          map: mapInfo.map,
        });
        mapInfo.map.add(maker);
      }
      if (infoWin) {
        maker.infww = this.createInfoWindow(infoWin);

        //给Marker绑定单击事件
        maker.on('click', this.markerClick);
      }
      return maker;
    }
    /**
     * 增加地图标注
     * mapInfo结构
     *map 
     * pic 不传时取默认图片
     * icon
     *point 点
     * @param infoWin 是否点击弹窗
     */
    addMaker(mapInfo, infoWin) {
      let maker;
      if (mapInfo.pic) {
        maker = new AMap.Marker({
          position: mapInfo.point,
          content: mapInfo.pic,
          offset: new AMap.Pixel(-30, -70),
          title: '',
          iconLabel: this.defaultLabel,
          iconStyle: this.defaultStyle,
          map: mapInfo.map,
          zIndex: 10000
        });
        mapInfo.map.add(maker);
      }
      if (mapInfo.icon) {
        maker = new AMap.Marker({
          position: mapInfo.point,
          icon: mapInfo.icon,
          title: '',
          iconLabel: this.defaultLabel,
          iconStyle: this.defaultStyle,
          map: mapInfo.map,
        });
        mapInfo.map.add(maker);
      }
      if (null != mapInfo.icons) {
        maker = new AMap.Marker({
          position: mapInfo.point,
          map: mapInfo.map,
        });
        mapInfo.map.add(maker);
      }
      if (infoWin) {
        maker.infww = this.createInfoWindow(infoWin);

        //给Marker绑定单击事件
        maker.on('click', this.markerClick);
      }
      return maker;
    }
    markerClick(e) {
      var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: e.target.infww,
        offset: new AMap.Pixel(16, -45)
      });
      infoWindow.open(e.target.getMap(), e.target.getPosition());
    }
    /** 
     * infoWin结构
     * map
     * title
     * content
     * footcontent
     * detailModal
     * detailInfo
     * detailModal detailInfo同时出现时，展示弹框
    */
    createInfoWindow(infoWin) {
      //关闭信息窗体
      function closeInfoWindow() {
        infoWin.map.clearInfoWindow();
      }
      const show = infoWin.detailModal;
      const detInfo = infoWin.detailInfo;
      function showDetails_ifram(e) {
        show.show = true;
        const id = parseInt(e.target.firstChild.value);
        detInfo.deviceId = id;
      }
      const info = document.createElement("div");
      info.className = "info";

      //可以通过下面的方式修改自定义窗体的宽高
      //info.style.width = "400px";
      // 定义顶部标题
      const top = document.createElement("div");
      const titleD = document.createElement("div");
      // const closeX = document.createElement("img");
      const closeX = document.createElement("span");
      top.className = "info-top";
      titleD.innerHTML = infoWin.title;
      if (infoWin.detailModal && infoWin.detailInfo) {
        titleD.onclick = showDetails_ifram;
      }
      // closeX.src = "http://webapi.amap.com/images/close2.gif";
      closeX.textContent = "×";
      closeX.onclick = closeInfoWindow;

      top.appendChild(titleD);
      top.appendChild(closeX);
      info.appendChild(top);

      // 定义中部内容
      const middle = document.createElement("div");
      middle.className = "info-middle";
      middle.style.backgroundColor = 'white';
      middle.innerHTML = infoWin.content;
      info.appendChild(middle);

      // 定义箭头指向
      const bottom = document.createElement("div");
      bottom.className = "info-bottom";
      bottom.style.position = 'relative';
      bottom.style.top = '0px';
      bottom.style.left = '15px';
      bottom.style.margin = '0 auto';
      const sharp = document.createElement("img");
      sharp.src = "http://webapi.amap.com/images/sharp.png";
      bottom.appendChild(sharp);
      info.appendChild(bottom);
      return info;
    }
    public procHisLocResItem(listItem) {
      let hisLocData = [];
      if (listItem) {
        let name = listItem.name;
        let path = listItem.path;
        hisLocData.push({ name: name, path: path, workGroup: listItem.workGroupByVehicleVOList });
      }
      return hisLocData;
    }
    public procHisLocResItemForGoogle(listItem) {
      let hisLocData = [];
      if (listItem) {
        let path = listItem.path;
        if (path && path.length > 0) {
          for (let i = 0; i < path.length; i++) {
            let p = path[i];
            let pi = { lat: parseFloat(p[1]), lng: parseFloat(p[0]), time: p[2], devid: p[3], accstate: p[4], daisu: p[5], speed: p[6] };
            hisLocData.push(pi);
          }
        }
      }
      return hisLocData;
    }
    public procHisLocWorkGroup(listItem) {
      let workGroup = [];
      if (listItem) {
        workGroup = listItem.workGroupByVehicleVOList;
      }
      return workGroup;
    }
    public procHisLocActivityList(listItem) {
      let activityList = [];
      if (listItem) {
        activityList = listItem.activityList;
      }
      return activityList;
    }
    /**
     * 
     * @param activityList  {
                "activityId": "413f0543-6270-4b21-a4cf-5f8a2bdea031",
                "vehicleId": "12383479384",
                "activityType": 0,
                "startTime": "2019-05-13 20:22:47",
                "endTime": "2019-05-14 08:31:54",
                "lon": 117.233265,
                "lat": 28.334936,
                "lonEnc": 117.238441,
                "latEnc": 28.331648,
                "mileage": 0,
                "createDate": 1557750172000
            }
     */
    public procHisLocActivityBusiness(activityList, workGroup) {
      let activityPointInfo = [];
      let j = 0;
      if (activityList) {
        for (let i = 0; i < activityList.length; i++) {
          let active = activityList[i];
          let point = [];
          let lng = active.lonEnc;
          let lat = active.latEnc;
          //经纬度
          point[0] = [lng, lat];
          let startTime = active.startTime;
          let endTime = active.endTime;
          //时间
          point[1] = startTime;
          //时长
          let procDura = this.procDura(startTime, endTime);
          if (!procDura) {
            continue;
          }
          point[2] = procDura;
          //班组、司机
          point[3] = this.procWorkGroupInfo(workGroup, startTime);
          activityPointInfo[j] = point;
          j++;
        }
      }
      return activityPointInfo;
    }
    // procDura(startTime, endTime) {

    //   return '';
    // }
    procDura(startTime, endTime) {
      let startDate = this.convertMsgtimeToDate(startTime);
      let endDate = this.convertMsgtimeToDate(endTime);
      let diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数  
      //如果停留时间少于1分钟，不显示此停留点
      if (diff < 30 * 1000) {
        return null;
      }
      //计算出相差天数  
      let days = Math.floor(diff / (24 * 3600 * 1000));

      //计算出小时数  
      let leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
      let hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数  
      let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
      let minutes = Math.floor(leave2 / (60 * 1000));

      //计算相差秒数  
      let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
      let seconds = Math.round(leave3 / 1000);

      let returnStr = seconds + "秒";
      if (minutes > 0) {
        returnStr = minutes + "分" + returnStr;
      }
      if (hours > 0) {
        returnStr = hours + "小时" + returnStr;
      }
      if (days > 0) {
        returnStr = days + "天" + returnStr;
      }
      return returnStr;
    }
    convertMsgtimeToDate(date: string) {
      //date = "2018.11.01 10:00:00";
      //  date.replace(".","-");
      return new Date(date)
    }
    /**
     * 
     * @param workGroup "workGroupByVehicleVOList": [
            {
                "workGroupId": "301020305969643520",
                "arrangeId": "312891562184933376",
                "workGroupName": "班组222",
                "personnelId": "311455569061871616",
                "workPersonnelName": "张三",
                "arrangeDate": "2019-05-14",
                "startTime": "9:46",
                "endTime": "23:47"
            }
        ],
     * @param startTime 
     */
    public procWorkGroupInfo(workGroup, time) {
      let ti = this.convertMsgtimeToDate(time);
      if (workGroup) {
        for (let i = 0; i < workGroup.length; i++) {
          let item = workGroup[i];
          let startTime = item.startTime;
          if (startTime.length < 5) {
            startTime = '0' + startTime;
          }
          let endTime = item.endTime;
          let startDate = this.convertMsgtimeToDate(item.arrangeDate + " " + startTime);
          let endDate = this.convertMsgtimeToDate(item.arrangeDate + " " + endTime);
          let isBetween = this.isBetweenStimeAndEndTime(startDate, endDate, ti);
          if (isBetween) {
            return [item.workGroupName, item.workPersonnelName];
          }
        }
      }
      return ['', ''];
    }
    isBetweenStimeAndEndTime(startTime, endTime, compTime) {
      if (compTime.getTime() >= startTime.getTime() && compTime.getTime <= endTime.getTime) {
        return true;
      }
      return false;
    }
    public procResItem(listItem) {
      if (null != listItem && listItem.length > 0) {
        listItem.forEach((item) => {
          if (this.isNull(item.onlineState)) {
            item.onlineState = "";
          }
          if (this.isNull(item.workState)) {
            item.workState = "";
          }
          if (this.isNull(item.repairState)) {
            item.repairState = "";
          }
          if (this.isNull(item.alarmState)) {
            item.alarmState = "";
          }
          if (this.isNull(item.orgName)) {
            item.orgName = "";
          }
          if (this.isNull(item.vehicleModelName)) {
            item.vehicleModelName = "";
          }
          if (this.isNull(item.vehicleTypeName)) {
            item.vehicleTypeName = "";
          }
          if (this.isNull(item.teamGroupName)) {
            item.teamGroupName = "";
          }
          if (this.isNull(item.driverName)) {
            item.driverName = "";
          }
          if (this.isNull(item.gpsTime)) {
            item.gpsTime = "";
          }
        });
      }
    }
    public isNull(item): boolean {
      if (null == item || "null" == item || "undefined" == item) {
        return true;
      }
      return false;
    }
    public isNotNull(item): boolean {
      if (null == item || "null" == item || "undefined" == item) {
        return false;
      }
      return true;
    }
    public getGoogleIconUrl(fn: any, onlineState, workState, repairState, alarmState, vehicleTypeName) {
      let outPic = this.getOutPic(onlineState, workState, repairState, alarmState);
      let inPic = this.getInPic(vehicleTypeName, true);
      // 图片地址, 第一个为背景图， 第二个为填充图
      const data = [outPic, inPic];
      // 定义画布
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      // 设置画布大小
      c.width = 72;
      c.height = 85;
      // 创建图片
      const img = new Image;
      img.src = data[0];
      // 解决跨域
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        // 在画布上定位图像，并规定图像的宽度和高度
        ctx.drawImage(img, 0, 0, 72, 85);
        // ctx.drawImage(img, 0, 0);
        // 创建第二张图片
        const img2 = new Image;
        img2.src = data[1];
        img2.crossOrigin = 'Anonymous';
        img2.onload = function () {
          // 第二张图片相对于第一张的位置和宽高
          ctx.drawImage(img2, 18, 18, 36, 36);
          // 创建base64 图片地址
          fn(c.toDataURL('image/png'));
        };
      };
      // return "../../../assets/image/vehiclestatusimage/work.png";
    }
    public getGoogleIconUrlForScreen(fn: any, onlineState, workState, repairState, alarmState, vehicleTypeName) {
      let outPic = this.getOutPicForScreen(onlineState, workState, repairState, alarmState);
      let inPic = this.getInPic(vehicleTypeName, true);
      // 图片地址, 第一个为背景图， 第二个为填充图
      const data = [outPic, inPic];
      // 定义画布
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      // 设置画布大小
      c.width = 48;
      c.height = 68;
      // 创建图片
      const img = new Image;
      img.src = data[0];
      // 解决跨域
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        // 在画布上定位图像，并规定图像的宽度和高度
        ctx.drawImage(img, 0, 0);
        // ctx.drawImage(img, 0, 0);
        // 创建第二张图片
        const img2 = new Image;
        img2.src = data[1];
        img2.crossOrigin = 'Anonymous';
        img2.onload = function () {
          // 第二张图片相对于第一张的位置和宽高
          ctx.drawImage(img2, 6, 6, 36, 36);
          // 创建base64 图片地址
          fn(c.toDataURL('image/png'));
        };
      };
      // return "../../../assets/image/vehiclestatusimage/work.png";
    }
    public getGoogleIconUrlForCluster() {
      return "../../../assets/image/mapgoogle/maker.png";
    }
    public getGoogleIcon() {
      let url = this.getGoogleIconUrlForCluster();
      let image = {
        url: url,
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(36, 42),
        // The origin for this image is (0, 0).
        //origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        //anchor: new google.maps.Point(0, 32)
      };
      return image;
    }
    /**maker图标 */
    public getPicContainer(vehicleTypeName, onlineState, workState, repairState, alarmState) {
      const containerPic = document.createElement("div");
      containerPic.style.position = 'relative';
      containerPic.style.width = '72px';
      containerPic.style.height = '85px';

      const inDiv = document.createElement("div");
      inDiv.style.position = 'absolute';
      inDiv.style.width = '50%';
      inDiv.style.margin = '18px 18px 0px 18px';

      const inPic = document.createElement("img");
      inPic.src = this.getInPic(vehicleTypeName, false);
      inPic.style.width = '100%';
      inPic.style.borderRadius = '50%';
      inDiv.appendChild(inPic);
      containerPic.appendChild(inDiv);

      const outPic = document.createElement("img");
      outPic.src = this.getOutPic(onlineState, workState, repairState, alarmState);
      outPic.style.width = '100%';
      containerPic.appendChild(outPic);

      return containerPic;
    }
    getInPic(vehicleTypeName, isGoogle) {
      if ("叉车" == vehicleTypeName) {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/chache.png";
        }
        return "../../../assets/image/vehicleimage/chache.png";
      } else if ("油罐车" == vehicleTypeName) {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/youguanche.png";
        }
        return "../../../assets/image/vehicleimage/youguanche.png";
      } else if ("渣包车" == vehicleTypeName) {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/zhabaoche.png";
        }
        return "../../../assets/image/vehicleimage/zhabaoche.png";
      } else if ("重型汽车" == vehicleTypeName) {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/zhongxingche.png";
        }
        return "../../../assets/image/vehicleimage/zhongxingche.png";
      } else if ("装载机" == vehicleTypeName) {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/zhuangzaiche.png";
        }
        return "../../../assets/image/vehicleimage/zhuangzaiche.png";
      } else if ("挖掘机" == vehicleTypeName) {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/wajueji.png";
        }
        return "../../../assets/image/vehicleimage/wajueji.png";
      } else {
        if (isGoogle) {
          return "../../../assets/image/vehicleimage/google/chache.png";
        }
        return "../../../assets/image/vehicleimage/chache.png";
      }
    }
    getOutPic(onlineState, workState, repairState, alarmState) {
      if ("离线" == onlineState) {
        return "../../../assets/image/vehiclestatusimage/offline.png";
      }
      if ("报警" == alarmState) {
        return "../../../assets/image/vehiclestatusimage/alarm.png";
      }
      if ("维修" == repairState) {
        return "../../../assets/image/vehiclestatusimage/repair.png";
      }
      if ("闲置" == workState) {
        return "../../../assets/image/vehiclestatusimage/idle.png";
      }
      if ("工作" == workState) {
        return "../../../assets/image/vehiclestatusimage/work.png";
      }
      return "../../../assets/image/vehiclestatusimage/work.png";
    }
    getOutPicForScreen(onlineState, workState, repairState, alarmState) {
      // if ("离线" == onlineState) {
      //   return "../../../assets/image/daping/offline.png";
      // }
      if ("报警" == alarmState) {
        return "../../../assets/image/daping/alarm.png";
      }
      if ("维修" == repairState) {
        return "../../../assets/image/daping/repair.png";
      }
      if ("闲置" == workState) {
        return "../../../assets/image/daping/idle.png";
      }
      if ("工作" == workState) {
        return "../../../assets/image/daping/work.png";
      }
      return "../../../assets/image/daping/location.png";
    }
    public mocHisData() {
      return [{
        name: "轨迹",
        path: [
          [116.3174406575251, 39.780839890984595, "2019-04-22 16:57:23", 1, 79.60000000000001, 42174.5, 367.40000000000003, 158.20000000000005, 1, 4], [116.31993596583845, 39.780554411417675, "2019-04-22 16:57:33", 1, 80.4, 42174.700000000004, 371.8, 23.100000000000023, 1, 4], [116.32246844663386, 39.780220064216444, "2019-04-22 16:57:43", 1, 85.10000000000001, 42175, 373, -10.099999999999909, 1, 4], [116.32503409817932, 39.77998684645781, "2019-04-22 16:57:53", 1, 85.5, 42175.100000000006, 370.3, 63.299999999999955, 1, 4], [116.32764189983746, 39.77963374419179, "2019-04-22 16:58:03", 1, 82.30000000000001, 42175.5, 370.20000000000005, 70.90000000000009, 1, 4], [116.33013851717729, 39.77938647410473, "2019-04-22 16:58:13", 1, 80.9, 42175.600000000006, 368.20000000000005, 116.60000000000014, 1, 4], [116.3327614688009, 39.77922847388881, "2019-04-22 16:58:23", 1, 81.5, 42175.8, 375.1, -67.89999999999998, 1, 4], [116.33529523114761, 39.77902330643565, "2019-04-22 16:58:33", 1, 64.5, 42176, 374.5, -37.39999999999998, 1, 4], [116.33698106598933, 39.778873518373615, "2019-04-22 16:58:43", 1, 46.800000000000004, 42176.200000000004, 372.20000000000005, 34.799999999999955, 1, 4], [116.33847546205519, 39.778737360283024, "2019-04-22 16:58:53", 1, 49.800000000000004, 42176.3, 371.8, 37.600000000000136, 1, 4], [116.33993374089424, 39.77837110466819, "2019-04-22 16:59:03", 1, 41.5, 42176.5, 374.8, -35.39999999999998, 1, 4], [116.34083873482683, 39.777851775892586, "2019-04-22 16:59:13", 1, 20.900000000000002, 42176.600000000006, 372.1, 44.40000000000009, 1, 0], [116.34135987627141, 39.77751373266623, "2019-04-22 16:59:23", 1, 23.3, 42176.600000000006, 374.3, true, 1, 2], [116.34148814791384, 39.7773579611223, "2019-04-22 16:59:33", 1, 4.5, 42176.700000000004, 373.70000000000005, 0, 1, 1], [116.34150418317847, 39.77734899065896, "2019-04-22 16:59:43", 1, 1.4000000000000001, 42176.700000000004, 373.8, 0, 1, 1], [116.34154126281844, 39.7773130575286, "2019-04-22 16:59:53", 1, 6.800000000000001, 42176.700000000004, 373.8, 2, 1, 1], [116.34156030239359, 39.777284090874936, "2019-04-22 17:00:03", 1, 1.3, 42176.700000000004, 373.70000000000005, 8.300000000000068, 1, 1], [116.3418679412346, 39.77681362909299, "2019-04-22 17:00:13", 1, 37.5, 42176.700000000004, 373.20000000000005, 3.800000000000068, 1, 0], [116.34169541318131, 39.775719199218315, "2019-04-22 17:00:23", 1, 61.6, 42176.8, 368.90000000000003, 106.60000000000014, 1, 3], [116.34150779244854, 39.77415869536433, "2019-04-22 17:00:33", 1, 65.3, 42177, 369.90000000000003, 71.10000000000014, 1, 4], [116.34150655920202, 39.772315515732366, "2019-04-22 17:00:43", 1, 79.4, 42177.200000000004, 372.6, 0, 1, true], [116.34168072813841, 39.77050666961956, "2019-04-22 17:00:53", 1, 72.2, 42177.5, 370.90000000000003, 52.799999999999955, 1, 4], [116.34195012473695, 39.76879401104665, "2019-04-22 17:01:03", 1, 70.60000000000001, 42177.600000000006, 370, 76.20000000000005, 1, 4], [116.34219245982841, 39.767083299298456, "2019-04-22 17:01:13", 1, 79.9, 42177.8, 364.3, 215.5, 1, 4], [116.34432626932869, 39.751041634265434, "2019-04-22 17:02:32", 1, 83.60000000000001, 42179.600000000006, 369.20000000000005, 61.700000000000045, 1, 4], [116.34445931780274, 39.74903766183884, "2019-04-22 17:02:42", 1, 82.60000000000001, 42180, 369.20000000000005, 61.5, 1, 4], [116.34458034275059, 39.74706266737037, "2019-04-22 17:02:52", 1, 81.60000000000001, 42180.100000000006, 368.6, 71.79999999999995, 1, 4], [116.34471540156846, 39.74510769875132, "2019-04-22 17:03:02", 1, 81.9, 42180.3, 365.5, 157.60000000000014, 1, 4], [116.34483342137948, 39.74314769496794, "2019-04-22 17:03:12", 1, 81.5, 42180.5, 366.8, 108.10000000000014, 1, 4], [116.34496948113532, 39.741184721871846, "2019-04-22 17:03:22", 1, 81.7, 42180.8, 367.90000000000003, 67.10000000000014, 1, 4], [116.34514362629135, 39.73922381741898, "2019-04-22 17:03:32", 1, 81.80000000000001, 42181, 366.70000000000005, 97.90000000000009, 1, 4], [116.34536788493887, 39.737276005192285, "2019-04-22 17:03:42", 1, 81.7, 42181.200000000004, 367.6, 82, 1, 4], [116.34559414493678, 39.7353071911165, "2019-04-22 17:03:52", 1, 82, 42181.5, 367.5, 79.20000000000005, 1, 4], [116.34575726326236, 39.73333725614491, "2019-04-22 17:04:02", 1, 82.4, 42181.700000000004, 368.1, 58.100000000000136, 1, 4], [116.345885303889, 39.73137425377718, "2019-04-22 17:04:12", 1, 81.60000000000001, 42182, 366.20000000000005, 111.40000000000009, 1, 4], [116.34600632907386, 39.729414235873726, "2019-04-22 17:04:22", 1, 82.10000000000001, 42182.100000000006, 367.70000000000005, 69.20000000000005, 1, 4], [116.34612534939092, 39.7274522111396, "2019-04-22 17:04:32", 1, 82.4, 42182.3, 366.5, 92.10000000000014, 1, 4], [116.3460258825375, 39.72549077731308, "2019-04-22 17:04:42", 1, 81.5, 42182.5, 366.6, 89.60000000000014, 1, 4], [116.34555559069516, 39.72355565311946, "2019-04-22 17:04:52", 1, 82.2, 42182.8, 366.90000000000003, 84.40000000000009, 1, 4], [116.34505522963096, 39.72162246833305, "2019-04-22 17:05:02", 1, 83, 42183, 367.5, 61.200000000000045, 1, 4], [116.34454183015824, 39.71963424705327, "2019-04-22 17:05:12", 1, 86.5, 42183.200000000004, 367.3, 65.5, 1, 4], [116.34397329741577, 39.71758990977911, "2019-04-22 17:05:22", 1, 86.30000000000001, 42183.5, 367.3, 64.60000000000014, 1, 4], [116.3430800458977, 39.7156749729156, "2019-04-22 17:05:32", 1, 82.30000000000001, 42183.700000000004, 365.1, 117.79999999999995, 1, 4], [116.34172577596725, 39.714010189808356, "2019-04-22 17:05:42", 1, 81.7, 42184, 364.6, 121, 1, 4], [116.34011292434855, 39.71248292126625, "2019-04-22 17:05:52", 1, 82.2, 42184.100000000006, 366.40000000000003, 76.40000000000009, 1, 4], [116.3384840256404, 39.71096260939523, "2019-04-22 17:06:02", 1, 83.10000000000001, 42184.5, 366.90000000000003, 63.5, 1, 4], [116.33681502539291, 39.70942020723542, "2019-04-22 17:06:12", 1, 86, 42184.600000000006, 366.8, 65.29999999999995, 1, 4], [116.33510893006013, 39.70781771822038, "2019-04-22 17:06:22", 1, 85.60000000000001, 42184.8, 366.8, 68.40000000000009, 1, 4], [116.33346097268634, 39.70624234043965, "2019-04-22 17:06:32", 1, 82, 42185.100000000006, 366.90000000000003, 61, 1, 4], [116.33199543145238, 39.70462330509106, "2019-04-22 17:06:42", 1, 82, 42185.3, 365.5, 96.40000000000009, 1, 4], [116.33080851499169, 39.70287478496245, "2019-04-22 17:06:52", 1, 82, 42185.5, 366.5, 59.299999999999955, 1, 4], [116.32995134038428, 39.7010268806428, "2019-04-22 17:07:02", 1, 82, 42185.700000000004, 366.20000000000005, 66.20000000000005, 1, 4], [116.32945397373425, 39.69909464927447, "2019-04-22 17:07:12", 1, 81.9, 42186, 366.20000000000005, 67.90000000000009, 1, 4], [116.32925728686388, 39.69714798648114, "2019-04-22 17:07:22", 1, 81.60000000000001, 42186.200000000004, 365.3, 93.5, 1, 4], [116.3292279771159, 39.695187637654314, "2019-04-22 17:07:32", 1, 82.2, 42186.5, 363.5, 132.60000000000014, 1, 4], [116.32923174184502, 39.69322434838854, "2019-04-22 17:07:42", 1, 82.10000000000001, 42186.600000000006, 363.8, 124.70000000000005, 1, 4], [116.32921746590802, 39.69126202187045, "2019-04-22 17:07:52", 1, 81.60000000000001, 42186.8, 364.40000000000003, 98.60000000000014, 1, 4], [116.32902979751796, 39.689296361536115, "2019-04-22 17:08:02", 1, 82.80000000000001, 42187.100000000006, 366.1, 61.200000000000045, 1, 4], [116.32851639454128, 39.68733607928516, "2019-04-22 17:08:12", 1, 84.10000000000001, 42187.3, 366, 61.700000000000045, 1, true], [116.32772638323338, 39.685477285853146, "2019-04-22 17:08:22", 1, 75.5, 42187.5, 366.20000000000005, 66.20000000000005, 1, 4], [116.32692036093887, 39.683778487956985, "2019-04-22 17:08:32", 1, 73.8, 42187.700000000004, 368.1, 14.5, 1, 4], [116.32628072905189, 39.682179021812246, "2019-04-22 17:08:42", 1, 51.6, 42188, 370.40000000000003, -36.19999999999993, 1, 4], [116.32600197759511, 39.68114732902798, "2019-04-22 17:08:52", 1, 36.2, 42188.100000000006, 369, 12.300000000000068, 1, 4], [116.32580642512939, 39.6802158091272, "2019-04-22 17:09:02", 1, 46.900000000000006, 42188.200000000004, 366.6, 72.70000000000005, 1, 4], [116.32561685416933, 39.679024257662945, "2019-04-22 17:09:12", 1, 59.1, 42188.3, 365.70000000000005, 81.5, 1, 4], [116.32542225962116, 39.677729678902395, "2019-04-22 17:09:22", 1, 49.5, 42188.5, 369.3, -4.599999999999909, 1, 4], [116.32525774353236, 39.67652417040026, "2019-04-22 17:09:32", 1, 51.300000000000004, 42188.600000000006, 367.1, 53.799999999999955, 1, 4], [116.32508921360366, 39.675276646357325, "2019-04-22 17:09:42", 1, 51.5, 42188.700000000004, 368.40000000000003, 15.300000000000068, 1, 4], [116.32491968201684, 39.6740311196858, "2019-04-22 17:09:52", 1, 53.7, 42189, 366.40000000000003, 68.60000000000014, 1, 4], [116.32471004390779, 39.67264249246129, "2019-04-22 17:10:02", 1, 63.1, 42189, 365.5, 93.90000000000009, 1, 4], [116.3244923702566, 39.671106823940114, "2019-04-22 17:10:12", 1, 66.10000000000001, 42189.200000000004, 364.70000000000005, 98.29999999999995, 1, 4], [116.32430675151889, 39.669436190901955, "2019-04-22 17:10:22", 1, 72.8, 42189.5, 368.1, 0, 1, 4], [116.32420332114502, 39.66781271809283, "2019-04-22 17:10:32", 1, 62.300000000000004, 42189.600000000006, 366.20000000000005, 66.79999999999995, 1, 4], [116.32414099858408, 39.66632334354558, "2019-04-22 17:10:42", 1, 62, 42189.700000000004, 366.70000000000005, 50, 1, 4], [116.32406362988108, 39.66472992076069, "2019-04-22 17:10:52", 1, 75.4, 42190, 363.5, 125.29999999999995, 1, 4], [116.32397118839533, 39.662817411343546, "2019-04-22 17:11:02", 1, 86, 42190.100000000006, 365.3, 64.79999999999995, 1, 4], [116.32387171339971, 39.660758859699996, "2019-04-22 17:11:12", 1, 86.80000000000001, 42190.5, 365.3, 67.5, 1, 4], [116.32376719905913, 39.658471253844056, "2019-04-22 17:11:22", 1, 86.7, 42190.600000000006, 365.3, 66.20000000000005, 1, 4], [116.32368478597655, 39.65660576182099, "2019-04-22 17:11:32", 1, 86.2, 42190.8, 365.3, 65, 1, 4], [116.32355725503558, 39.654592155283595, "2019-04-22 17:11:42", 1, 79.7, 42191.100000000006, 364.90000000000003, 85.60000000000014, 1, 4], [116.32351892393716, 39.652600716326404, "2019-04-22 17:11:52", 1, 83.9, 42191.3, 365.20000000000005, 65.10000000000014, 1, 4], [116.32341845674635, 39.65061715924756, "2019-04-22 17:12:02", 1, 82.2, 42191.5, 364.70000000000005, 70.29999999999995, 1, 4], [116.32333903811156, 39.64864964121625, "2019-04-22 17:12:12", 1, 81.80000000000001, 42191.700000000004, 364.1, 85.20000000000005, 1, 4], [116.32327365064046, 39.64668314628972, "2019-04-22 17:12:22", 1, 80.60000000000001, 42192, 365.1, 55.90000000000009, 1, 4], [116.32322731464106, 39.644792698226944, "2019-04-22 17:12:32", 1, 76, 42192.200000000004, 365.20000000000005, 56.90000000000009, 1, 4], [116.32329323402526, 39.64296646920967, "2019-04-22 17:12:42", 1, 76.80000000000001, 42192.5, 365.3, 56.90000000000009, 1, 4], [116.32338822365439, 39.64118930122403, "2019-04-22 17:12:52", 1, 67.10000000000001, 42192.600000000006, 369.6, -43.5, 1, 4], [116.3233840610689, 39.63994905066177, "2019-04-22 17:13:02", 1, 27.1, 42192.700000000004, 369, -13, 1, 4], [116.32342512133862, 39.63970407931323, "2019-04-22 17:13:12", 1, 0, 42192.8, 368.5, 0, 1, 1], [116.32340106728357, 39.63969603275944, "2019-04-22 17:13:22", 1, 0, 42192.8, 368.6, 0, 1, 1], [116.32339304748974, 39.63967901442177, "2019-04-22 17:13:32", 1, 4.6000000000000005, 42192.8, 367.8, 22.5, 1, 1], [116.32345913949156, 39.639244052428396, "2019-04-22 17:13:42", 1, 32.5, 42192.8, 366, 60.200000000000045, 1, 2], [116.3235031295669, 39.63837896401583, "2019-04-22 17:13:52", 1, 43.300000000000004, 42193, 366, 53.200000000000045, 1, 3], [116.32379964723212, 39.637269299069, "2019-04-22 17:14:02", 1, 52.5, 42193, 365.8, 54.90000000000009, 1, 3], [116.3241191911754, 39.635951635367476, "2019-04-22 17:14:12", 1, 58.7, 42193.200000000004, 365.8, 47.299999999999955, 1, 3], [116.324416697174, 39.63471294540783, "2019-04-22 17:14:22", 1, 30.6, 42193.3, 369, -20.799999999999955, 1, 4], [116.32450885346933, 39.634324040258484, "2019-04-22 17:14:32", 1, 1.3, 42193.5, 368.3, 0, true, 4], [116.32449582034747, 39.634290008929085, "2019-04-22 17:14:42", 1, 0, 42193.5, 368.40000000000003, 1.3000000000000682, 1, 1], [116.32448379205462, 39.63427698371626, "2019-04-22 17:14:52", 1, 0, 42193.5, 368.5, 0, 1, 1], [116.32447477006116, 39.63426096354723, "2019-04-22 17:15:02", 1, 0, 42193.5, 368.6, 0, 1, 1], [116.32444269557539, 39.63423389786518, "2019-04-22 17:15:12", 1, 0, 42193.5, 368.6, 1.2000000000000455, 1, 1], [116.32442565580419, 39.634217862640504, "2019-04-22 17:15:22", 1, 2, 42193.5, 368.3, 10.600000000000023, 1, 1], [116.32448275263506, 39.63397692131487, "2019-04-22 17:15:32", 1, 15.3, 42193.5, 368.1, 14.800000000000068, 1, 1], [116.32456389358092, 39.6336610099991, "2019-04-22 17:15:42", 1, 15.3, 42193.5, 366.70000000000005, 50.700000000000045, 1, 1], [116.32464304949085, 39.633501126443356, "2019-04-22 17:15:52", 1, 0, 42193.5, 368.6, 1.6000000000000227, 1, 1], [116.32466810760147, 39.6335211775868, "2019-04-22 17:16:02", 1, 0, 42193.5, 368.6, 0, 1, 1], [116.32467412231779, 39.63353219111589, "2019-04-22 17:16:12", 1, 0.5, 42193.5, 368.70000000000005, 1.1000000000000227, 1, 1], [116.32468915644455, 39.63353822059104, "2019-04-22 17:16:22", 1, 0, 42193.5, 368.70000000000005, 0, 1, 1]
        ]
      }];
    }
    public mocHisData1() {
      return {
        name: "轨迹",
        path: [
          [116.3174406575251, 39.780839890984595, "2019-04-22 16:57:23", 1, 79.60000000000001, 42174.5, 367.40000000000003, 158.20000000000005, 1, 4], [116.31993596583845, 39.780554411417675, "2019-04-22 16:57:33", 1, 80.4, 42174.700000000004, 371.8, 23.100000000000023, 1, 4], [116.32246844663386, 39.780220064216444, "2019-04-22 16:57:43", 1, 85.10000000000001, 42175, 373, -10.099999999999909, 1, 4], [116.32503409817932, 39.77998684645781, "2019-04-22 16:57:53", 1, 85.5, 42175.100000000006, 370.3, 63.299999999999955, 1, 4], [116.32764189983746, 39.77963374419179, "2019-04-22 16:58:03", 1, 82.30000000000001, 42175.5, 370.20000000000005, 70.90000000000009, 1, 4], [116.33013851717729, 39.77938647410473, "2019-04-22 16:58:13", 1, 80.9, 42175.600000000006, 368.20000000000005, 116.60000000000014, 1, 4], [116.3327614688009, 39.77922847388881, "2019-04-22 16:58:23", 1, 81.5, 42175.8, 375.1, -67.89999999999998, 1, 4], [116.33529523114761, 39.77902330643565, "2019-04-22 16:58:33", 1, 64.5, 42176, 374.5, -37.39999999999998, 1, 4], [116.33698106598933, 39.778873518373615, "2019-04-22 16:58:43", 1, 46.800000000000004, 42176.200000000004, 372.20000000000005, 34.799999999999955, 1, 4], [116.33847546205519, 39.778737360283024, "2019-04-22 16:58:53", 1, 49.800000000000004, 42176.3, 371.8, 37.600000000000136, 1, 4], [116.33993374089424, 39.77837110466819, "2019-04-22 16:59:03", 1, 41.5, 42176.5, 374.8, -35.39999999999998, 1, 4], [116.34083873482683, 39.777851775892586, "2019-04-22 16:59:13", 1, 20.900000000000002, 42176.600000000006, 372.1, 44.40000000000009, 1, 0], [116.34135987627141, 39.77751373266623, "2019-04-22 16:59:23", 1, 23.3, 42176.600000000006, 374.3, true, 1, 2], [116.34148814791384, 39.7773579611223, "2019-04-22 16:59:33", 1, 4.5, 42176.700000000004, 373.70000000000005, 0, 1, 1], [116.34150418317847, 39.77734899065896, "2019-04-22 16:59:43", 1, 1.4000000000000001, 42176.700000000004, 373.8, 0, 1, 1], [116.34154126281844, 39.7773130575286, "2019-04-22 16:59:53", 1, 6.800000000000001, 42176.700000000004, 373.8, 2, 1, 1], [116.34156030239359, 39.777284090874936, "2019-04-22 17:00:03", 1, 1.3, 42176.700000000004, 373.70000000000005, 8.300000000000068, 1, 1], [116.3418679412346, 39.77681362909299, "2019-04-22 17:00:13", 1, 37.5, 42176.700000000004, 373.20000000000005, 3.800000000000068, 1, 0], [116.34169541318131, 39.775719199218315, "2019-04-22 17:00:23", 1, 61.6, 42176.8, 368.90000000000003, 106.60000000000014, 1, 3], [116.34150779244854, 39.77415869536433, "2019-04-22 17:00:33", 1, 65.3, 42177, 369.90000000000003, 71.10000000000014, 1, 4], [116.34150655920202, 39.772315515732366, "2019-04-22 17:00:43", 1, 79.4, 42177.200000000004, 372.6, 0, 1, true], [116.34168072813841, 39.77050666961956, "2019-04-22 17:00:53", 1, 72.2, 42177.5, 370.90000000000003, 52.799999999999955, 1, 4], [116.34195012473695, 39.76879401104665, "2019-04-22 17:01:03", 1, 70.60000000000001, 42177.600000000006, 370, 76.20000000000005, 1, 4], [116.34219245982841, 39.767083299298456, "2019-04-22 17:01:13", 1, 79.9, 42177.8, 364.3, 215.5, 1, 4], [116.34432626932869, 39.751041634265434, "2019-04-22 17:02:32", 1, 83.60000000000001, 42179.600000000006, 369.20000000000005, 61.700000000000045, 1, 4], [116.34445931780274, 39.74903766183884, "2019-04-22 17:02:42", 1, 82.60000000000001, 42180, 369.20000000000005, 61.5, 1, 4], [116.34458034275059, 39.74706266737037, "2019-04-22 17:02:52", 1, 81.60000000000001, 42180.100000000006, 368.6, 71.79999999999995, 1, 4], [116.34471540156846, 39.74510769875132, "2019-04-22 17:03:02", 1, 81.9, 42180.3, 365.5, 157.60000000000014, 1, 4], [116.34483342137948, 39.74314769496794, "2019-04-22 17:03:12", 1, 81.5, 42180.5, 366.8, 108.10000000000014, 1, 4], [116.34496948113532, 39.741184721871846, "2019-04-22 17:03:22", 1, 81.7, 42180.8, 367.90000000000003, 67.10000000000014, 1, 4], [116.34514362629135, 39.73922381741898, "2019-04-22 17:03:32", 1, 81.80000000000001, 42181, 366.70000000000005, 97.90000000000009, 1, 4], [116.34536788493887, 39.737276005192285, "2019-04-22 17:03:42", 1, 81.7, 42181.200000000004, 367.6, 82, 1, 4], [116.34559414493678, 39.7353071911165, "2019-04-22 17:03:52", 1, 82, 42181.5, 367.5, 79.20000000000005, 1, 4], [116.34575726326236, 39.73333725614491, "2019-04-22 17:04:02", 1, 82.4, 42181.700000000004, 368.1, 58.100000000000136, 1, 4], [116.345885303889, 39.73137425377718, "2019-04-22 17:04:12", 1, 81.60000000000001, 42182, 366.20000000000005, 111.40000000000009, 1, 4], [116.34600632907386, 39.729414235873726, "2019-04-22 17:04:22", 1, 82.10000000000001, 42182.100000000006, 367.70000000000005, 69.20000000000005, 1, 4], [116.34612534939092, 39.7274522111396, "2019-04-22 17:04:32", 1, 82.4, 42182.3, 366.5, 92.10000000000014, 1, 4], [116.3460258825375, 39.72549077731308, "2019-04-22 17:04:42", 1, 81.5, 42182.5, 366.6, 89.60000000000014, 1, 4], [116.34555559069516, 39.72355565311946, "2019-04-22 17:04:52", 1, 82.2, 42182.8, 366.90000000000003, 84.40000000000009, 1, 4], [116.34505522963096, 39.72162246833305, "2019-04-22 17:05:02", 1, 83, 42183, 367.5, 61.200000000000045, 1, 4], [116.34454183015824, 39.71963424705327, "2019-04-22 17:05:12", 1, 86.5, 42183.200000000004, 367.3, 65.5, 1, 4], [116.34397329741577, 39.71758990977911, "2019-04-22 17:05:22", 1, 86.30000000000001, 42183.5, 367.3, 64.60000000000014, 1, 4], [116.3430800458977, 39.7156749729156, "2019-04-22 17:05:32", 1, 82.30000000000001, 42183.700000000004, 365.1, 117.79999999999995, 1, 4], [116.34172577596725, 39.714010189808356, "2019-04-22 17:05:42", 1, 81.7, 42184, 364.6, 121, 1, 4], [116.34011292434855, 39.71248292126625, "2019-04-22 17:05:52", 1, 82.2, 42184.100000000006, 366.40000000000003, 76.40000000000009, 1, 4], [116.3384840256404, 39.71096260939523, "2019-04-22 17:06:02", 1, 83.10000000000001, 42184.5, 366.90000000000003, 63.5, 1, 4], [116.33681502539291, 39.70942020723542, "2019-04-22 17:06:12", 1, 86, 42184.600000000006, 366.8, 65.29999999999995, 1, 4], [116.33510893006013, 39.70781771822038, "2019-04-22 17:06:22", 1, 85.60000000000001, 42184.8, 366.8, 68.40000000000009, 1, 4], [116.33346097268634, 39.70624234043965, "2019-04-22 17:06:32", 1, 82, 42185.100000000006, 366.90000000000003, 61, 1, 4], [116.33199543145238, 39.70462330509106, "2019-04-22 17:06:42", 1, 82, 42185.3, 365.5, 96.40000000000009, 1, 4], [116.33080851499169, 39.70287478496245, "2019-04-22 17:06:52", 1, 82, 42185.5, 366.5, 59.299999999999955, 1, 4], [116.32995134038428, 39.7010268806428, "2019-04-22 17:07:02", 1, 82, 42185.700000000004, 366.20000000000005, 66.20000000000005, 1, 4], [116.32945397373425, 39.69909464927447, "2019-04-22 17:07:12", 1, 81.9, 42186, 366.20000000000005, 67.90000000000009, 1, 4], [116.32925728686388, 39.69714798648114, "2019-04-22 17:07:22", 1, 81.60000000000001, 42186.200000000004, 365.3, 93.5, 1, 4], [116.3292279771159, 39.695187637654314, "2019-04-22 17:07:32", 1, 82.2, 42186.5, 363.5, 132.60000000000014, 1, 4], [116.32923174184502, 39.69322434838854, "2019-04-22 17:07:42", 1, 82.10000000000001, 42186.600000000006, 363.8, 124.70000000000005, 1, 4], [116.32921746590802, 39.69126202187045, "2019-04-22 17:07:52", 1, 81.60000000000001, 42186.8, 364.40000000000003, 98.60000000000014, 1, 4], [116.32902979751796, 39.689296361536115, "2019-04-22 17:08:02", 1, 82.80000000000001, 42187.100000000006, 366.1, 61.200000000000045, 1, 4], [116.32851639454128, 39.68733607928516, "2019-04-22 17:08:12", 1, 84.10000000000001, 42187.3, 366, 61.700000000000045, 1, true], [116.32772638323338, 39.685477285853146, "2019-04-22 17:08:22", 1, 75.5, 42187.5, 366.20000000000005, 66.20000000000005, 1, 4], [116.32692036093887, 39.683778487956985, "2019-04-22 17:08:32", 1, 73.8, 42187.700000000004, 368.1, 14.5, 1, 4], [116.32628072905189, 39.682179021812246, "2019-04-22 17:08:42", 1, 51.6, 42188, 370.40000000000003, -36.19999999999993, 1, 4], [116.32600197759511, 39.68114732902798, "2019-04-22 17:08:52", 1, 36.2, 42188.100000000006, 369, 12.300000000000068, 1, 4], [116.32580642512939, 39.6802158091272, "2019-04-22 17:09:02", 1, 46.900000000000006, 42188.200000000004, 366.6, 72.70000000000005, 1, 4], [116.32561685416933, 39.679024257662945, "2019-04-22 17:09:12", 1, 59.1, 42188.3, 365.70000000000005, 81.5, 1, 4], [116.32542225962116, 39.677729678902395, "2019-04-22 17:09:22", 1, 49.5, 42188.5, 369.3, -4.599999999999909, 1, 4], [116.32525774353236, 39.67652417040026, "2019-04-22 17:09:32", 1, 51.300000000000004, 42188.600000000006, 367.1, 53.799999999999955, 1, 4], [116.32508921360366, 39.675276646357325, "2019-04-22 17:09:42", 1, 51.5, 42188.700000000004, 368.40000000000003, 15.300000000000068, 1, 4], [116.32491968201684, 39.6740311196858, "2019-04-22 17:09:52", 1, 53.7, 42189, 366.40000000000003, 68.60000000000014, 1, 4], [116.32471004390779, 39.67264249246129, "2019-04-22 17:10:02", 1, 63.1, 42189, 365.5, 93.90000000000009, 1, 4], [116.3244923702566, 39.671106823940114, "2019-04-22 17:10:12", 1, 66.10000000000001, 42189.200000000004, 364.70000000000005, 98.29999999999995, 1, 4], [116.32430675151889, 39.669436190901955, "2019-04-22 17:10:22", 1, 72.8, 42189.5, 368.1, 0, 1, 4], [116.32420332114502, 39.66781271809283, "2019-04-22 17:10:32", 1, 62.300000000000004, 42189.600000000006, 366.20000000000005, 66.79999999999995, 1, 4], [116.32414099858408, 39.66632334354558, "2019-04-22 17:10:42", 1, 62, 42189.700000000004, 366.70000000000005, 50, 1, 4], [116.32406362988108, 39.66472992076069, "2019-04-22 17:10:52", 1, 75.4, 42190, 363.5, 125.29999999999995, 1, 4], [116.32397118839533, 39.662817411343546, "2019-04-22 17:11:02", 1, 86, 42190.100000000006, 365.3, 64.79999999999995, 1, 4], [116.32387171339971, 39.660758859699996, "2019-04-22 17:11:12", 1, 86.80000000000001, 42190.5, 365.3, 67.5, 1, 4], [116.32376719905913, 39.658471253844056, "2019-04-22 17:11:22", 1, 86.7, 42190.600000000006, 365.3, 66.20000000000005, 1, 4], [116.32368478597655, 39.65660576182099, "2019-04-22 17:11:32", 1, 86.2, 42190.8, 365.3, 65, 1, 4], [116.32355725503558, 39.654592155283595, "2019-04-22 17:11:42", 1, 79.7, 42191.100000000006, 364.90000000000003, 85.60000000000014, 1, 4], [116.32351892393716, 39.652600716326404, "2019-04-22 17:11:52", 1, 83.9, 42191.3, 365.20000000000005, 65.10000000000014, 1, 4], [116.32341845674635, 39.65061715924756, "2019-04-22 17:12:02", 1, 82.2, 42191.5, 364.70000000000005, 70.29999999999995, 1, 4], [116.32333903811156, 39.64864964121625, "2019-04-22 17:12:12", 1, 81.80000000000001, 42191.700000000004, 364.1, 85.20000000000005, 1, 4], [116.32327365064046, 39.64668314628972, "2019-04-22 17:12:22", 1, 80.60000000000001, 42192, 365.1, 55.90000000000009, 1, 4], [116.32322731464106, 39.644792698226944, "2019-04-22 17:12:32", 1, 76, 42192.200000000004, 365.20000000000005, 56.90000000000009, 1, 4], [116.32329323402526, 39.64296646920967, "2019-04-22 17:12:42", 1, 76.80000000000001, 42192.5, 365.3, 56.90000000000009, 1, 4], [116.32338822365439, 39.64118930122403, "2019-04-22 17:12:52", 1, 67.10000000000001, 42192.600000000006, 369.6, -43.5, 1, 4], [116.3233840610689, 39.63994905066177, "2019-04-22 17:13:02", 1, 27.1, 42192.700000000004, 369, -13, 1, 4], [116.32342512133862, 39.63970407931323, "2019-04-22 17:13:12", 1, 0, 42192.8, 368.5, 0, 1, 1], [116.32340106728357, 39.63969603275944, "2019-04-22 17:13:22", 1, 0, 42192.8, 368.6, 0, 1, 1], [116.32339304748974, 39.63967901442177, "2019-04-22 17:13:32", 1, 4.6000000000000005, 42192.8, 367.8, 22.5, 1, 1], [116.32345913949156, 39.639244052428396, "2019-04-22 17:13:42", 1, 32.5, 42192.8, 366, 60.200000000000045, 1, 2], [116.3235031295669, 39.63837896401583, "2019-04-22 17:13:52", 1, 43.300000000000004, 42193, 366, 53.200000000000045, 1, 3], [116.32379964723212, 39.637269299069, "2019-04-22 17:14:02", 1, 52.5, 42193, 365.8, 54.90000000000009, 1, 3], [116.3241191911754, 39.635951635367476, "2019-04-22 17:14:12", 1, 58.7, 42193.200000000004, 365.8, 47.299999999999955, 1, 3], [116.324416697174, 39.63471294540783, "2019-04-22 17:14:22", 1, 30.6, 42193.3, 369, -20.799999999999955, 1, 4], [116.32450885346933, 39.634324040258484, "2019-04-22 17:14:32", 1, 1.3, 42193.5, 368.3, 0, true, 4], [116.32449582034747, 39.634290008929085, "2019-04-22 17:14:42", 1, 0, 42193.5, 368.40000000000003, 1.3000000000000682, 1, 1], [116.32448379205462, 39.63427698371626, "2019-04-22 17:14:52", 1, 0, 42193.5, 368.5, 0, 1, 1], [116.32447477006116, 39.63426096354723, "2019-04-22 17:15:02", 1, 0, 42193.5, 368.6, 0, 1, 1], [116.32444269557539, 39.63423389786518, "2019-04-22 17:15:12", 1, 0, 42193.5, 368.6, 1.2000000000000455, 1, 1], [116.32442565580419, 39.634217862640504, "2019-04-22 17:15:22", 1, 2, 42193.5, 368.3, 10.600000000000023, 1, 1], [116.32448275263506, 39.63397692131487, "2019-04-22 17:15:32", 1, 15.3, 42193.5, 368.1, 14.800000000000068, 1, 1], [116.32456389358092, 39.6336610099991, "2019-04-22 17:15:42", 1, 15.3, 42193.5, 366.70000000000005, 50.700000000000045, 1, 1], [116.32464304949085, 39.633501126443356, "2019-04-22 17:15:52", 1, 0, 42193.5, 368.6, 1.6000000000000227, 1, 1], [116.32466810760147, 39.6335211775868, "2019-04-22 17:16:02", 1, 0, 42193.5, 368.6, 0, 1, 1], [116.32467412231779, 39.63353219111589, "2019-04-22 17:16:12", 1, 0.5, 42193.5, 368.70000000000005, 1.1000000000000227, 1, 1], [116.32468915644455, 39.63353822059104, "2019-04-22 17:16:22", 1, 0, 42193.5, 368.70000000000005, 0, 1, 1]
        ], "workGroupByVehicleVOList": [], "activityList": []
      };
    }
  }
  export class VehicleScreenServiceClass {
    private http: HttpUtilService;
    private defaultConfig: HttpUtilNs.UfastHttpConfig;
    constructor(private injector: Injector) {
      this.http = this.injector.get(HttpUtilService);
    }
    /**
 * 多屏监控车辆数据
 * @param filter 传入查询单车数据，不传查询全局数据
 */
    public getScreenData(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_GETSCREENDATA, filter, this.defaultConfig);
    }
    /**
     * 多屏监控新增监控车辆
     * @param filter 车牌号;屏幕排序序号
     */
    public addScreenVehData(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_ADDSCREENVEHDATA, filter, this.defaultConfig);

    }
    /**
     * 多屏监控修改监控车辆
     * @param filter 车牌号;屏幕排序序号
     */
    public modScreenVehData(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_MODSCREENVEHDATA, filter, this.defaultConfig);

    }
    /**
     * 多屏监控删除监控车辆
     * @param filter 车牌号;屏幕排序序号
     */
    public delScreenVehData(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_DELSCREENVEHDATA, filter, this.defaultConfig);

    }
    /**
     * 获取机构车辆选择树
     * @param filter
     */
    public getOrgVehsTree(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Get(URL_GETORGVEHSTREE, filter, this.defaultConfig);

    }
    /**
     * 修改指定位置监控车辆
     * @param filter
     */
    public modLocVehs(filter): Observable<UfastHttpAnyResModel> {
      return this.http.Post(URL_MODLOCVEHS, filter, this.defaultConfig);

    }
  }
}
@Injectable()
export class LocationService extends LocationServiceNs.LocationServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
@Injectable()
export class VehicleScreenService extends LocationServiceNs.VehicleScreenServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
@Injectable()
export class LocationUtilService extends LocationServiceNs.LocationUtilServiceClass {
  constructor(injector: Injector) {
    super(injector);
  }
}
