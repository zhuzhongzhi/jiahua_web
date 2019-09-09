import { Component, OnInit } from '@angular/core';
import {alertStatusNodes} from '../../../../environments/type-search';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {SearchInfoService, SearchInfoServiceNs} from '../../../core/common-services/searchInfo.service';
import {NoticeService} from '../../../core/biz-services/notice/notice.service';
import {TerminalServiceNs} from '../../../core/biz-services/resource/terminal.service';
import {PeoManageServiceNs} from '../../../core/biz-services/resource/peo-manage.service';
import {NoticeChange} from '../../../core/common-services/notice.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  // 搜索类
  alertStatus: string;
  alertStatusNode = alertStatusNodes;
  // 保养状态
  maintenanceNodes = [
    { alarmTypeName: '保养提醒', alarmTypeCode: 999 },
    // { alarmTypeName: '已保养', alarmTypeCode: 1 },
  ];
  typeNodes = [];
  searchName: string;
  searchVehicleList = [];

  // 表格类
  tabIndex = 0;
  // 全部数据
  isAllChecked1 = false;
  checkedId1: {[key: string]: boolean} = {};
  listOfAllData = [];
  infoLoading = false;
  pageNum = 1;
  pageSize = 20;
  pageTotal = 0;
  sortVal1 = '';
  // 保养数据
  isAllChecked2 = false;
  checkedId2: {[key: string]: boolean} = {};
  listOfKeepData = [];
  infoLoading2 = false;
  pageNum2 = 1;
  pageSize2 = 20;
  pageTotal2 = 0;
  sortVal2 = '';
  // 报警数据
  isAllChecked3 = false;
  checkedId3: {[key: string]: boolean} = {};
  listOfAlarmData = [];
  infoLoading3 = false;
  pageNum3 = 1;
  pageSize3 = 20;
  pageTotal3 = 0;
  sortVal3 = '';

  // 弹框
  detailModal = {
    show1: false,
    show2: false,
    show3: false,
    loading: false,
    title: '',
    errTxt: '',
    id: null
  };
  saveNode;
  handleVal = '1';
  handleNodes = [
    {label: '已处理', val: '1'},
    {label: '未处理', val: '0'}
  ];
  handleContent: string;
  alarmDetailInfo = {
    id: 0,
    num: '',
    section: '',
    team: '',
    driver: '',
    alertStatus: 1,
    posContent: '',
    posNum: [0, 0],
    posEncNum: [0, 0],
    time: '',
    content: '',
    vehicleType: '',
    vehicleModel: ''
  };
  keepDetailInfo = {
    id: 0,
    num: '',
    section: '',
    type: '',
    val: 0,
    curVal: '',
    state: ''
  };

  constructor(private modal: NzModalService, public noticeChange: NoticeChange,
              private noticeService: NoticeService,
              private searchInfoService: SearchInfoService,
              private messageService: ShowMessageService,
              private message: NzMessageService) { }

  ngOnInit() {
    this.noticeChange.changeMessage('change');
    this.getData();
    this.getSearchInfo();
  }

  getData() {
    this.getAllData();
    this.getKeepData();
    this.getAlarmData();
  }
  // 获取全部数据
  getAllData() {
    const param = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      sort: this.sortVal1 === '' ? 'aa.deal_flag,aa.start_time desc' : this.sortVal1,
      filters: {
        informTypeCode: this.alertStatus,
        vehicleLicense: this.searchName
      }
    };
    this.infoLoading = true;
    this.noticeService.getNoticeList(param).subscribe((resData: SearchInfoServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.infoLoading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.pageNum = resData.value.pageNum;
      this.pageSize = resData.value.pageSize;
      this.pageTotal = resData.value.total;
      this.listOfAllData = resData.value.list;
      this.infoLoading = false;
    }, (error: any) => {
      this.infoLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 获取保养数据
  getKeepData() {
    const param = {
      pageNum: this.pageNum2,
      pageSize: this.pageSize2,
      sort: this.sortVal2 === '' ? 'rema.deal_flag,rema.create_date desc' : this.sortVal2,
      filters: {
        informTypeCode: this.alertStatus,
        vehicleLicense: this.searchName
      }
    };
    this.infoLoading2 = true;
    this.noticeService.getMaintenanceList(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.infoLoading2 = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.pageNum2 = resData.value.pageNum;
      this.pageSize2 = resData.value.pageSize;
      this.pageTotal2 = resData.value.total;
      this.listOfKeepData = resData.value.list;
    }, (error: any) => {
      this.infoLoading2 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 获取报警数据
  getAlarmData() {
    const param = {
      pageNum: this.pageNum3,
      pageSize: this.pageSize3,
      sort: this.sortVal3 === '' ? 'alarm.deal_flag,alarm.start_time desc' : this.sortVal3,
      filters: {
        informTypeCode: this.alertStatus,
        vehicleLicense: this.searchName
      }
    };
    this.infoLoading3 = true;
    this.noticeService.getAlarmList(param).subscribe((resData: TerminalServiceNs.UfastHttpAnyResModel) => {
      this.infoLoading3 = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.pageNum3 = resData.value.pageNum;
      this.pageSize3 = resData.value.pageSize;
      this.pageTotal3 = resData.value.total;
      this.listOfAlarmData = resData.value.list;
    }, (error: any) => {
      this.infoLoading3 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 获取搜索数据
  getSearchInfo() {
    this.searchInfoService.getAlarmList()
      .subscribe((resData) => {
        this.alertStatusNode = resData.value;
        this.tabChange([this.tabIndex]);
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
  }
  // 自动填充功能
  onInput(val: string) {
    const param = {vehicleLicense: val};
    this.searchInfoService.getVehicleList(param).subscribe((res) => {
      this.searchVehicleList = res.value;
    });
  }
  // 搜索
  SearchInfo() {
    this.pageNum = 1;
    this.pageNum2 = 1;
    this.pageNum3 = 1;
    this.isAllChecked1 = false;
    this.checkAll1(false);
    this.isAllChecked2 = false;
    this.checkAll2(false);
    this.isAllChecked3 = false;
    this.checkAll3(false);
    this.getData();
  }
  // 重置
  resetSearchInfo() {
    this.alertStatus = null;
    this.searchName = null;
    this.pageNum = 1;
    this.pageNum2 = 1;
    this.pageNum3 = 1;
    this.isAllChecked1 = false;
    this.checkAll1(false);
    this.isAllChecked2 = false;
    this.checkAll2(false);
    this.isAllChecked3 = false;
    this.checkAll3(false);
    this.getData();
  }
  // 翻页
  searchData1(reset: boolean = false): void {
    if (reset) {
      this.pageNum = 1;
    }
    this.isAllChecked1 = false;
    this.checkAll1(false);
    this.getAllData();
  }
  searchData2(reset: boolean = false): void {
    if (reset) {
      this.pageNum2 = 1;
    }
    this.isAllChecked2 = false;
    this.checkAll2(false);
    this.getKeepData();
  }
  searchData3(reset: boolean = false): void {
    if (reset) {
      this.pageNum3 = 1;
    }
    this.isAllChecked3 = false;
    this.checkAll3(false);
    this.getAlarmData();
  }
  // 排序
  sort(sort: {key: string; value: string}): void {
    const sortName = sort.key;
    const sortValue = sort.value;
    let param = '';
    if (sortName && sortValue) {
      param = `${sortName} ${sortValue.replace('end', '')}`;
    }

    switch (this.tabIndex) {
      case 0: this.sortVal1 = param;
        this.pageNum = 1;
        this.isAllChecked1 = false;
        this.checkAll1(false);
        this.getAllData(); break;
      case 1: this.sortVal2 = param;
        this.pageNum2 = 1;
        this.isAllChecked2 = false;
        this.checkAll2(false);
        this.getKeepData(); break;
      case 2: this.sortVal3 = param;
        this.pageNum3 = 1;
        this.isAllChecked3 = false;
        this.checkAll3(false);
        this.getAlarmData(); break;
    }
  }

  // 全选与选择
  checkAll1(value: boolean): void {
    this.listOfAllData.forEach(item => (this.checkedId1[item.id] = value));
  }
  refreshStatus1(): void {
    this.isAllChecked1 = this.listOfAllData.every(item => this.checkedId1[item.id]);
  }
  checkAll2(value: boolean): void {
    this.listOfKeepData.forEach(item => (this.checkedId2[item.id] = value));
  }
  refreshStatus2(): void {
    this.isAllChecked1 = this.listOfAllData.every(item => this.checkedId2[item.id]);
  }
  checkAll3(value: boolean): void {
    this.listOfAlarmData.forEach(item => (this.checkedId3[item.id] = value));
  }
  refreshStatus3(): void {
    this.isAllChecked3 = this.listOfAllData.every(item => this.checkedId3[item.id]);
  }

  // 面板切换事件
  tabChange(index) {
    index = index[0];
    this.alertStatus = null;
    if (index === 0) {
      this.typeNodes = [
        ...this.alertStatusNode,
        ...this.maintenanceNodes
      ];
      this.getAllData();
    }
    if (index === 1) {
      this.getKeepData();
    }
    if (index === 2) {
      this.typeNodes = [
        ...this.alertStatusNode,
      ];
      this.getAlarmData();
    }
  }

  // 弹框操作
  // 显示处理弹框
  showDetailModal(node): void {
    this.handleVal = '1';
    this.handleContent = '';
    this.detailModal.title = Number(node.informTypeCode) < 999 ? '报警处理' : '保养处理';
    this.detailModal.show1 = true;
    this.saveNode = node;
  }
  showDetailModal2(): void {
    const selNodes = this.getSelNodes();
    if (selNodes.length === 0) {
      this.message.create('warning', `您还没有选择要批量处理的通知！`);
      return;
    }
    this.handleVal = '1';
    this.handleContent = '';
    this.detailModal.title = '处理';
    this.detailModal.show1 = true;
    this.saveNode = {};
  }
  // 取消处理弹框
  handleDetailCancel() {
    this.detailModal.show1 = false;
  }
  // 保存处理弹框
  handleDetailSave() {
    // 判断是否是批量处理
    if (JSON.stringify(this.saveNode) === '{}') {
      this.updateForMoreService();
    } else {
      this.updateService();
    }
  }
  // 单个处理提交
  updateService() {
    const params = {
      id: this.saveNode.id,
      vehicleId: this.saveNode.vehicleId,
      informTypeName: this.saveNode.informTypeName,
      dealFlag: this.handleVal,
      dealContent: this.handleContent
    };
    this.detailModal.loading = true;
    this.noticeService.update(params).subscribe((resData: PeoManageServiceNs.UfastHttpAnyResModel) => {
      this.detailModal.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.detailModal.show1 = false;
      this.noticeChange.changeMessage('change');
      this.getData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 批量处理提交
  updateForMoreService() {
    const params = [];
    const nodes = this.getSelNodes();
    nodes.forEach(item => {
      params.push({
        id: item.id,
        vehicleId: item.vehicleId,
        informTypeName: item.informTypeName,
        dealFlag: this.handleVal,
        dealContent: this.handleContent
      });
    });
    this.detailModal.loading = true;
    this.noticeService.updateForMore(params).subscribe((resData: PeoManageServiceNs.UfastHttpAnyResModel) => {
      this.detailModal.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.detailModal.show1 = false;
      this.checkedId1 = {};
      this.checkedId2 = {};
      this.checkedId3 = {};
      this.getData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  getSelNodes(): any[] {
    if (this.tabIndex === 0) {
      return this.listOfAllData.filter(item => this.checkedId1[item.id]);
    }
    if (this.tabIndex === 1) {
      return this.listOfKeepData.filter(item => this.checkedId2[item.id]);
    }
    if (this.tabIndex === 2) {
      return this.listOfAlarmData.filter(item => this.checkedId3[item.id]);
    }
  }
  showModal2(node) {
    this.alarmDetailInfo = node;
    if (node.informTypeCode >= 999) {
      this.showMaintenance(node);
    } else {
      this.showAlarmModel(node);
    }
  }
  showMaintenance(node) {
    this.detailModal.title = '保养信息' + `（${node.vehicleLicense}）`;
    const params = {
      id: node.id,
      informTypeName: node.informTypeName
    };
    this.noticeService.searchItem(params).subscribe((resData: SearchInfoServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.keepDetailInfo.type = this.getType(resData.value.vehicleMaintenanceRemaindVO.maintenanceType);
      this.keepDetailInfo.val = resData.value.vehicleMaintenanceRemaindVO.maintenanceValue;
      this.keepDetailInfo.curVal = this.getCurVal(resData.value.vehicleMaintenanceRemaindVO);
      this.keepDetailInfo.state = resData.value.vehicleMaintenanceRemaindVO.maintenanceState === 1 ? '已保养' : '未保养';
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
    this.keepDetailInfo.id = node.id;
    this.keepDetailInfo.num = node.vehicleLicense;
    this.keepDetailInfo.section = node.orgName;
    this.detailModal.show3 = true;
  }
  getType(type: number): string {
    let name = '';
    switch (type) {
      case 1: name = '按里程'; break;
      case 2: name = '按工作时长'; break;
      case 3: name = '按时间周期'; break;
      case 4: name = '按指定日期'; break;
      default: name = '';
    }
    return name;
  }
  getCurVal(info): string {
    let curVal = '';
    switch (info.maintenanceType) {
      case 1: curVal = info.vehicleStatusDO.mileage + '千米'; break;
      case 2: curVal = info.vehicleStatusDO.worktime + '小时'; break;
      default: curVal = '';
    }
    return curVal;
  }
  showAlarmModel(node) {
    this.detailModal.title = '报警信息' + `（${node.vehicleLicense}）`;
    this.alarmDetailInfo = {
      id: node.id,
      num: node.vehicleLicense,
      section: node.orgName,
      team: node.workGroupName,
      driver: node.workPersonnelName,
      alertStatus: Number(node.informTypeCode),
      posContent: node.provinceName + node.cityName + node.areaName + node.roadName,
      posNum: [node.lat, node.lon],
      posEncNum: [node.latEnc, node.lonEnc],
      time: node.startTime,
      content: node.informContent,
      vehicleType: node.vehicleTypeName,
      vehicleModel: node.vehicleModelName
    };
    this.detailModal.show2 = true;
  }
  cancelModal2() {
    this.detailModal.show2 = false;
  }
  cancelModal3() {
    this.detailModal.show3 = false;
  }
}
