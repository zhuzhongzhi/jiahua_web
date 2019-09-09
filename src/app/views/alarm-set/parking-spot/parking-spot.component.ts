import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LocationServiceNs } from '../../../core/biz-services/location/location-service.service';
import { forkJoin } from 'rxjs';
import { SearchInfoService } from '../../../core/common-services/searchInfo.service';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { ParkingSpotService, ParkingSpotServiceNs } from '../../../core/biz-services/alarmSet/parking-spot.service';
import { parkingSpotTypeNodes } from '../../../../environments/type-search';
import { StorageProvider } from '../../../core/common-services/storage';
import { ActionCode } from '../../../../environments/actionCode';
import { MapDrawingModelComponent } from '../../../component/map-drawing-model/map-drawing-model.component';
import { MapGoogleDrawingModelComponent } from '../../../component/map-google-drawing-model/map-google-drawing-model.component';
@Component({
  selector: 'app-parking-spot',
  templateUrl: './parking-spot.component.html',
  styleUrls: ['./parking-spot.component.scss']
})
export class ParkingSpotComponent implements OnInit {
  // 切换地图，高德地图——1，谷歌地图——2
  showGaoDe = 1;
  // 单选按钮值，标准或卫星地图——标准是‘0’，卫星是‘1’
  radioMapValue = 0;
  // 标志 添加0、编辑1、详情2
  // handleFlag = 0;
  @ViewChild('googleMapDrawSpot')
  private googleMapDrawSpot: MapGoogleDrawingModelComponent;
  ActionCode = ActionCode;
  @ViewChild('gaodeMapDrawSpot')
  private gaodeMapDrawSpot: MapDrawingModelComponent;
  // 停车点数据
  parkingSpot: LocationServiceNs.UfastHttpVehiclesMapResModel[] = [];
  // 搜索类
  section: string;
  // 机构名称
  sectionNode = [];
  defaultExpanded = [];
  // 根据名称搜索
  searchName: string;
  // 表格类
  isAllChecked = false;
  listOfAllData = [];
  checkedId: { [key: string]: boolean } = {};
  infoLoading = false;
  pageNum = 1;
  pageSize = 20;
  pageTotal = 0;
  sortVal = '';
  // 弹框类
  detailModal = {
    show1: false,
    show2: false,
    loading: false,
    title: '',
    errTxt: '',
    showAdd: false
  };
  // 弹框数据
  parkingInfo = {
    stopId: null,
    stopName: '',
    orgId: null,
    orgName: null,
    provinceCode: null,
    cityCode: null,
    areaCode: null,
    stopAddress: '',
    address: '',
    stopType: null,
    stopTypeName: '',
    remark: '',
    // 地图围栏数据
    stopPointList: [],
    handleFlag: 0
  };
  // 重置数据
  resetInfo = {
    stopId: null,
    stopName: '',
    orgId: '',
    orgName: null,
    provinceCode: null,
    cityCode: null,
    areaCode: null,
    stopAddress: '',
    address: '',
    stopType: null,
    stopTypeName: '',
    remark: ''
  };
  // 选择省下拉菜单数据
  provinceNode = [
    { name: null, code: null },
  ];
  // 选择市下拉菜单数据
  cityNode = [
    { name: null, code: null },
  ];
  // 选择区下拉菜单数据
  districtNode = [
    { name: null, code: null },
  ];
  // 停车点类型
  typeNode = parkingSpotTypeNodes;
  addOrEditNum = 0;
  constructor(private message: NzMessageService, private modal: NzModalService, private searchInfoService: SearchInfoService,
    private messageService: ShowMessageService, private parkingSpotService: ParkingSpotService,
    private storage: StorageProvider) {
  }

  ngOnInit() {
    this.getSearchInfo();
    this.getData();
    // this.getParkingData();
  }
  // 卫星地图与道路地图切换
  changeSelectedMap() {
    this.radioMapValue = this.radioMapValue === 0 ? 1 : 0;
  }
  mapDrawingOutFromChild(e) {
    // console.log('from child');
    this.parkingInfo.stopPointList = e;
  }
  startDraw() {
    if (1 === this.showGaoDe) {
      this.gaodeMapDrawSpot.startDrawPolygon();
    }
    if (2 === this.showGaoDe) {
      this.googleMapDrawSpot.startAddOrEditPloygon('start');
    }

  }
  reDraw() {
    if (1 === this.showGaoDe) {
      this.gaodeMapDrawSpot.redrawDrawPolygon();
    }
    if (2 === this.showGaoDe) {
      this.googleMapDrawSpot.redrawDrawPolygon();
    }
  }
  getData() {
    this.infoLoading = true;
    const filter = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      sort: this.sortVal,
      filters: {
        orgId: this.section,
        stopName: this.searchName
      }
    };
    this.parkingSpotService.getParkingSpotList(filter).subscribe((resData: ParkingSpotServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.infoLoading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.listOfAllData = this.initSpotList(resData.value.list);
      this.pageNum = this.pageNum > resData.value.pages ? resData.value.pages : this.pageNum;
      this.pageNum = resData.value.pages === 1 ? 1 : this.pageNum;
      this.pageTotal = resData.value.total;
      if (this.pageNum !== resData.value.pageNum) {
        this.getData();
      } else {
        this.infoLoading = false;
      }
    }, (error: any) => {
      this.infoLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  initSpotList(info) {
    return info.map((item) => {
      return {
        ...item,
        stopTypeName: this.typeNode.filter(node => node.val === item.stopType)[0].label,
      };
    });
  }
  // 获取搜索信息——机构列表
  getSearchInfo() {
    this.searchInfoService.getOrgList()
      .subscribe((resData) => {
        this.sectionNode = this.initSectionNode(resData.value);
        this.defaultExpanded = this.sectionNode ? [this.sectionNode[0].key] : [];
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
  }
  initSectionNode(info) {
    return info.map((item) => {
      if (item.children && item.children.length > 0) {
        this.initSectionNode(item.children);
      } else {
        item.isLeaf = true;
      }
      item.key = item.id;
      return item;
    });
  }
  // 省改变事件
  changeProvinceData(value) {
    this.parkingInfo.cityCode = null;
    this.parkingInfo.areaCode = null;
    if (value == null) {
      this.getAreasDataNode(1, 0);
    } else {
      this.getAreasDataNode(2, value);
    }
  }

  // 市改变事件
  changeCityData(value) {
    this.parkingInfo.areaCode = null;
    if (value == null) {
      this.getAreasDataNode(2, this.parkingInfo.provinceCode);
    } else {
      this.getAreasDataNode(3, value);
    }
  }

  // 获取省(num==1)、市(num==2)、区(num==3)数据
  getAreasDataNode(num, node) {
    const filter = {
      pcode: node
    };
    forkJoin([this.searchInfoService.getAreasList(filter)])
      .subscribe((resData: any[]) => {
        if (num === 1) {
          this.provinceNode = resData[0].value;
        } else if (num === 2) {
          this.cityNode = resData[0].value;
        } else if (num === 3) {
          this.districtNode = resData[0].value;
        }
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
  }
  // 条件查询信息
  searchInfo() {
    this.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.getData();
  }
  // 重置搜索信息
  resetSearchInfo() {
    this.section = null;
    this.searchName = null;
    this.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.getData();
  }
  // 新增弹框
  addInfo(): void {
    this.detailModal.title = '新增停车点信息';
    this.detailModal.showAdd = true;
    this.showDetailModal(0);
    this.changeProvinceData(null);
    this.gaodeMapDrawSpot.clearOverLay();
    this.addOrEditNum++;
  }

  // 编辑弹框
  editInfo(node): void {
    this.detailModal.show1 = true;
    this.detailModal.title = '编辑停车点信息' + '(' + node.stopName + ')';
    this.detailModal.showAdd = false;
    this.showDetailModal(1);
    this.changeProvinceData(null);
    this.changeProvinceData(node.provinceCode);
    this.changeCityData(node.cityCode);
    this.parkingInfo.stopId = node.stopId;
    this.parkingInfo.stopName = node.stopName;
    this.parkingInfo.orgId = node.orgId;
    this.parkingInfo.provinceCode = node.provinceCode;
    this.parkingInfo.cityCode = node.cityCode;
    this.parkingInfo.areaCode = node.areaCode;
    this.parkingInfo.stopAddress = node.stopAddress;
    this.parkingInfo.stopType = node.stopType;
    this.parkingInfo.remark = node.remark;
    this.parkingInfo.stopPointList = node.stopPointList;
    this.addOrEditNum++;
  }

  // 删除弹框
  delModal() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.stopId]);
    if (!hasChecked) {
      this.message.create('error', `您还没有选择要删除的信息`);
      return;
    }
    this.modal.confirm({
      nzTitle: '您确定要删除选中的停车点信息吗？',
      nzOnOk: () => {
        this.deleteParkingSpot();
      }
    });
  }

  showDetailModal(handleFlag): void {
    this.parkingInfo = JSON.parse(JSON.stringify(this.resetInfo));
    this.parkingInfo.handleFlag = handleFlag;
    this.detailModal.show1 = true;
    this.detailModal.errTxt = '';
  }

  // 查看停车点
  lookParkingSpot(node): void {
    this.detailModal.title = '查看停车点信息' + '(' + node.stopName + ')';
    this.detailModal.show2 = true;
    const filter = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      filters: {
        stopId: node.stopId
      }
    };
    this.parkingSpotService.getParkingSpotList(filter).subscribe((resData: ParkingSpotServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.parkingInfo = node;
      this.parkingInfo.stopTypeName = this.typeNode.filter(d => d.val === node.stopType)[0].label;
      // this.initCircuitList(resData.value.list)[0];
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 关闭查看详情弹框
  handleLookCancel() {
    this.detailModal.show2 = false;
  }
  // 表格按序号升序降序
  sort(sort: { key: string; value: string }): void {
    const sortName = sort.key;
    const sortValue = sort.value;
    let param = '';
    if (sortName && sortValue) {
      param = `${sortName} ${sortValue.replace('end', '')}`;
    }
    this.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.sortVal = param;
    this.getData();
  }

  // 表格全选
  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => (this.checkedId[item.stopId] = value));
  }

  // 表格单选选择
  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.every(item => this.checkedId[item.stopId]);
  }
  // 表格页码、页数改变时
  pageChange(reset: boolean = false): void {
    if (reset) {
      this.pageNum = 1;
    }
    this.checkedId = {};
    this.isAllChecked = false;
    this.getData();
  }
  // 取消弹框
  handleDetailCancel() {
    this.detailModal.show1 = false;
  }

  // 保存弹框
  handleDetailSave() {
    if (!this.parkingInfo.provinceCode || !this.parkingInfo.cityCode || !this.parkingInfo.areaCode || !this.parkingInfo.stopName
      || !this.parkingInfo.orgId || this.parkingInfo.stopType === null) {
      this.detailModal.errTxt = '您还有必填项没有完成！';
      return;
    }
    if (this.parkingInfo.stopName.length > 20) {
      this.detailModal.errTxt = '停车点名称已超出最大长度！';
      return;
    }
    this.detailModal.show1 = false;
    this.detailModal.loading = false;
    const filter = this.parkingInfo;
    if (1 === this.showGaoDe) {
      this.gaodeMapDrawSpot.savePolygonPoints();
    }
    if (2 === this.showGaoDe) {
      this.googleMapDrawSpot.savePolygonPoints();
    }
    if (this.detailModal.showAdd) {
      this.addParkingSpot(filter);
    } else {
      this.editParkingSpot(filter);
    }
  }

  // 获取停车点数据
  getParkingData() {
    const data = [{
      'id': 'ac9d382086134eea927f21611aadfd55', 'vehicleId': 'ac9d382086134eea927f21611aadfd55',
      'lng': '116.614934', 'lat': '40.027795', 'license': '京ADF5712'
    }];
    this.parkingSpot = JSON.parse(JSON.stringify(data))[0];
  }

  // 新增停车点数据
  addParkingSpot(filter) {
    filter.createUserId = this.storage.getItem('userId');
    filter.createUserName = this.storage.getItem('userName');
    this.parkingSpotService.add(filter).subscribe((resData: ParkingSpotServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.getData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  // 编辑停车点数据
  editParkingSpot(filter) {
    filter.modifyUserId = this.storage.getItem('userId');
    filter.modifyUserName = this.storage.getItem('userName');
    this.parkingSpotService.edit(filter).subscribe((resData: ParkingSpotServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.getData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }

  // 删除停车点数据
  deleteParkingSpot() {
    const filter = [];
    Object.keys(this.checkedId).forEach((i) => {
      if (this.checkedId[i]) {
        filter.push(i);
      }
    });
    this.parkingSpotService.delete(filter).subscribe((resData: ParkingSpotServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.checkedId = {};
      this.isAllChecked = false;
      this.getData();
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
}
