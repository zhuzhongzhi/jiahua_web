import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LocationService, VehicleScreenService, LocationServiceNs } from '../../../core/biz-services/location/location-service.service';
import { forkJoin } from 'rxjs';
import { SearchInfoService } from '../../../core/common-services/searchInfo.service';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { DriveCircuitService, DriveCircuitServiceNs } from '../../../core/biz-services/alarmSet/drive-circuit.service';
import { StorageProvider } from '../../../core/common-services/storage';
import { ActionCode } from '../../../../environments/actionCode';
import { MapGaodeDrawDrivingComponent } from '../../../component/map-gaode-draw-driving/map-gaode-draw-driving.component';
import { MapGoogleDrawDrivingComponent } from '../../../component/map-google-draw-driving/map-google-draw-driving.component';
@Component({
  selector: 'app-drive-circuit',
  templateUrl: './drive-circuit.component.html',
  styleUrls: ['./drive-circuit.component.scss']
})
export class DriveCircuitComponent implements OnInit {
  // 切换地图，高德地图——1，谷歌地图——2
  showGaoDe = 1;
  // 单选按钮值，标准或卫星地图——标准是‘0’，卫星是‘1’
  radioMapValue = 0;
  // 标志 添加0、编辑1、详情2
  // handleFlag = 0;
  @ViewChild('gaodeDrawDriving')
  private gaodeDrawDriving: MapGaodeDrawDrivingComponent;
  @ViewChild('googleDrawDriving')
  private googleDrawDriving: MapGoogleDrawDrivingComponent;
  ActionCode = ActionCode;
  // 行车路线数据
  driveCircuit: LocationServiceNs.UfastHttpVehiclesMapResModel[] = [];
  // 搜索类
  section: string;
  // 机构名称
  sectionNode = [];
  defaultExpanded = [];
  // 根据路线名称搜索
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
  driveInfo = {
    lineId: null,
    lineName: null,
    orgId: null,
    provinceCode: null,
    cityCode: null,
    areaCode: null,
    lineOffset: null,
    remark: '',
    // 行车路线点
    linePointList: [],
    // 标志 添加0、编辑1、详情2
    handleFlag: 0
  };
  // 重置数据
  resetInfo = {
    lineId: null,
    lineName: null,
    orgId: null,
    provinceCode: null,
    cityCode: null,
    areaCode: null,
    lineOffset: null,
    remark: ''
  };
  // 查看详情弹框数据
  lookDetailInfo = {
    lineName: null,
    orgName: null,
    provinceCode: null,
    cityCode: null,
    areaCode: null,
    address: null,
    lineOffset: null,
    remark: '',
    linePointList: null,
    // 展示
    linePointListShow: []
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
  addOrEditNum = 0;
  constructor(private locationService: LocationService, private vehicleScreenService: VehicleScreenService,
    private message: NzMessageService, private modal: NzModalService,
    private searchInfoService: SearchInfoService, private messageService: ShowMessageService,
    private driveCircuitService: DriveCircuitService, private storage: StorageProvider) {
  }

  ngOnInit() {
    this.getData();
    this.getSearchInfo();
    this.getCircuitData();
  }
  // 卫星地图与道路地图切换
  changeSelectedMap() {
    this.radioMapValue = this.radioMapValue === 0 ? 1 : 0;
  }
  reDraw() {
    if (1 === this.showGaoDe) {
      this.gaodeDrawDriving.redrawDriving();
    }
    if (2 === this.showGaoDe) {
      this.googleDrawDriving.redrawDriving();
    }
  }
  startDraw() {
    if (1 === this.showGaoDe) {
      this.gaodeDrawDriving.startAddOrEditPloyLine();
    }
    if (2 === this.showGaoDe) {
      this.googleDrawDriving.startAddOrEditPloyLine('start');
    }
  }
  drawMakerWay(){
    if (1 === this.showGaoDe) {
      this.gaodeDrawDriving.drawMakerWay();
    }
    if (2 === this.showGaoDe) {
      this.googleDrawDriving.drawMakerWay();
    }
  }
  removeMakerWay(){
    if (1 === this.showGaoDe) {
      this.gaodeDrawDriving.removeMakerWay();
    }
    if (2 === this.showGaoDe) {
      this.googleDrawDriving.removeMakerWay();
    }
  }
  mapDrawDrivingFromChild(e) {
    // console.log("from child");
    // this.fenceInfo.fencePointList = e;
    this.driveInfo.linePointList = e;
  }
  // 获取行车路线表格数据
  getData() {
    this.infoLoading = true;
    const filter = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      sort: this.sortVal,
      filters: {
        orgId: this.section,
        lineName: this.searchName
      }
    };
    this.driveCircuitService.getDriveCircuitList(filter).subscribe((resData: DriveCircuitServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.infoLoading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.infoLoading = false;
      this.listOfAllData = resData.value.list;
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
    this.driveInfo.cityCode = null;
    this.driveInfo.areaCode = null;
    if (value == null) {
      this.getAreasDataNode(1, 0);
    } else {
      this.getAreasDataNode(2, value);
    }
  }

  // 市改变事件
  changeCityData(value) {
    this.driveInfo.areaCode = null;
    if (value == null) {
      this.getAreasDataNode(2, this.driveInfo.provinceCode);
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
    this.detailModal.title = '新增行车路线';
    this.showDetailModal(0);
    this.changeProvinceData(null);
    this.detailModal.showAdd = true;
    this.addOrEditNum++;
  }

  // 编辑弹框
  editInfo(node): void {
    this.detailModal.title = '编辑行车路线' + '(' + node.lineName + ')';
    this.detailModal.showAdd = false;
    this.showDetailModal(1);
    this.changeProvinceData(null);
    this.changeProvinceData(node.provinceCode);
    this.changeCityData(node.cityCode);
    this.driveInfo.lineId = node.lineId;
    this.driveInfo.lineName = node.lineName;
    this.driveInfo.orgId = node.orgId;
    this.driveInfo.provinceCode = node.provinceCode;
    this.driveInfo.cityCode = node.cityCode;
    this.driveInfo.areaCode = node.areaCode;
    this.driveInfo.lineOffset = node.lineOffset;
    this.driveInfo.remark = node.remark;
    this.driveInfo.linePointList = node.linePointList;
    this.driveInfo.handleFlag = 1;
    this.addOrEditNum++;
  }

  // 删除行车路线
  delModal() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.lineId]);
    if (!hasChecked) {
      this.message.create('error', `您还没有选择要删除的信息`);
      return;
    }
    this.modal.confirm({
      nzTitle: '您确定要删除选中的行车路线吗？',
      nzOnOk: () => {
        this.deleteCricuit();
      }
    });
  }

  // 查看详情弹框
  lookCircuit(node): void {
    this.detailModal.title = '查看行车路线' + '(' + node.lineName + ')';
    this.lookDetailInfo = node;
    this.lookDetailInfo.linePointListShow = node.linePointList;
    this.detailModal.show2 = true;
  }
  showDetailModal(handleFlag): void {
    this.driveInfo = JSON.parse(JSON.stringify(this.resetInfo));
    this.driveInfo.handleFlag = handleFlag;
    this.detailModal.show1 = true;
    this.detailModal.errTxt = '';
  }
  // 关闭查看详情弹框
  handleLookDetailCancel() {
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
    this.listOfAllData.forEach(item => (this.checkedId[item.lineId] = value));
  }

  // 表格单选选择
  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.every(item => this.checkedId[item.lineId]);
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
    if (!this.driveInfo.provinceCode || !this.driveInfo.cityCode || !this.driveInfo.areaCode
      || !this.driveInfo.lineName || !this.driveInfo.orgId) {
      this.detailModal.errTxt = '您还有必填项没有完成！';
      return;
    }
    if (this.driveInfo.lineName.length > 20) {
      this.detailModal.errTxt = '路线名称已超出最大长度！';
      return;
    }
    if (this.driveInfo.lineOffset && this.driveInfo.lineOffset.length > 20) {
      this.detailModal.errTxt = '偏离值已超出最大长度！';
      return;
    }
    this.detailModal.loading = true;
    const filter = this.driveInfo;
    if (1 === this.showGaoDe) {
      this.gaodeDrawDriving.saveDriving();
    }
    if (2 === this.showGaoDe) {
      this.googleDrawDriving.saveDriving();
    }
    if (this.detailModal.showAdd) {
      this.addCricuit(filter);
    } else {
      this.editCricuit(filter);
    }
  }

  // 获取行车路线数据
  getCircuitData() {
    const data = [{
      'id': 'ac9d382086134eea927f21611aadfd55', 'vehicleId': 'ac9d382086134eea927f21611aadfd55',
      'lng': '116.614934', 'lat': '40.027795', 'license': '京ADF5712'
    }];
    this.driveCircuit = JSON.parse(JSON.stringify(data))[0];
  }

  // 新增行车路线数据
  addCricuit(filter) {
    filter.createUserId = this.storage.getItem('userId');
    filter.createUserName = this.storage.getItem('userName');
    this.driveCircuitService.add(filter).subscribe((resData: DriveCircuitServiceNs.UfastHttpAnyResModel) => {
      this.detailModal.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.detailModal.show1 = false;
      this.getData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 编辑行车路线
  editCricuit(filter) {
    filter.modifyUserId = this.storage.getItem('userId');
    filter.modifyUserName = this.storage.getItem('userName');
    this.driveCircuitService.edit(filter).subscribe((resData: DriveCircuitServiceNs.UfastHttpAnyResModel) => {
      this.detailModal.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.detailModal.show1 = false;
      this.getData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 删除行车路线
  deleteCricuit() {
    const filter = [];
    Object.keys(this.checkedId).forEach((i) => {
      if (this.checkedId[i]) {
        filter.push(i);
      }
    });
    this.driveCircuitService.delete(filter).subscribe((resData: DriveCircuitServiceNs.UfastHttpAnyResModel) => {
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
