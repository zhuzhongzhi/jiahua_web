import { Component, OnInit, ViewChild} from '@angular/core';
import {NzFormatEmitEvent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActionCode} from '../../../../environments/actionCode';
import {SearchInfoService} from '../../../core/common-services/searchInfo.service';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {AlarmStrategyService, AlarmStrategyServiceNs} from '../../../core/biz-services/alarmSet/alarm-strategy.service';
import {forkJoin} from 'rxjs';
import {LocationServiceNs, VehicleScreenService} from '../../../core/biz-services/location/location-service.service';
import {StorageProvider} from '../../../core/common-services/storage';
import {alarmTypeNodes, cmdSendNodes} from '../../../../environments/type-search';

@Component({
  selector: 'app-alarm-strategy',
  templateUrl: './alarm-strategy.component.html',
  styleUrls: ['./alarm-strategy.component.scss']
})
export class AlarmStrategyComponent implements OnInit {
 // @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeSelectComponent;
  @ViewChild('treeCom') treeCom;
  @ViewChild('treeComLook') treeComLook;
  ActionCode = ActionCode;
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
  alarmInfo = {
    configName: '',
    vehicleIds: null,
    alarmTypeCode: null,
    fenceId: null,
    lineId: null,
    fenceAlarmType: null,
    speed: '',
    speedTime: '',
    alarmTypeName: '',
    fenceName: '',
    lineName: '',
    selectVehicles: 0,
  }
  // 重置弹框数据
  resetInfo = {
    configName: '',
    vehicleIds: null,
    alarmTypeCode: null,
    fenceId: null,
    lineId: null,
    fenceAlarmType: null,
    speed: '',
    speedTime: '',
    alarmTypeName: '',
    fenceName: '',
    lineName: '',
    selectVehicles: 0,
  }
  // 弹框中车辆数据
  vehicleNodes = [];
  newVehicleNodes = [];
  // 报警类型
  typeNode = alarmTypeNodes;
  // 电子围栏
  fenceNode = [];
  // 行车路线
  lineNode = [];
  // 报警内容
  contentOptions = [];
  // 弹框中展示报警条件
  showCondition = [false, false, false, false];
  // 弹框中是否展示车辆树
  showVehicle = false;
  // 弹框中车辆树搜索值
  searchVehValue = null;
  // 下发结果弹框类
  resultModal = {
    show: false,
    loading: false,
    title: '',
    pageNum : 1,
    pageSize : 20,
    pageTotal : 0,
  };
  // 弹框中下发结果表格数据
  resultTableData = [];
  // 选择的报警策略数据
  selAlarmStrategy: any;
  // 车辆类型
  vehicleType: string;
  vehicleTypeNode = [];
  // 搜索的车牌号码列表
  searchVehicleList = [];
  searchVehicleNO = null;
  // 指令下发状态结果
  cmdSendStateNodes = cmdSendNodes;
  cmdSendState = null;
  constructor(private message: NzMessageService, private modal: NzModalService,
              private searchInfoService: SearchInfoService, private messageService: ShowMessageService,
              private alarmStrategyService: AlarmStrategyService, private vehicleScreenService: VehicleScreenService,
              private storage: StorageProvider) { }

  ngOnInit() {
    this.getAlarmStrategyData();
    this.getSearchInfo();
  }
  getAlarmStrategyData() {
    this.infoLoading = true;
    const filter = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      filters: {
        configName: this.searchName
      }
    };
    this.alarmStrategyService.getAlarmStrategyList(filter).subscribe((resData: AlarmStrategyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.infoLoading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.listOfAllData = this.initData(resData.value.list);
      this.pageNum = this.pageNum > resData.value.pages ? resData.value.pages : this.pageNum;
      this.pageNum = resData.value.pages === 1 ? 1 : this.pageNum;
      this.pageTotal = resData.value.total;
      if (this.pageNum !== resData.value.pageNum) {
        this.getAlarmStrategyData();
      } else {
        this.infoLoading = false;
      }
    }, (error: any) => {
      this.infoLoading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  initData(info) {
    return info.map((item) => {
      if (item.alarmTypeCode === 1) {
        return {
          ...item,
          content: '超速速度' + item.speed + '千米/小时,' + '持续时长' + item.speedTime + '秒'
        };
      } else if (item.alarmTypeCode === 2) {
        return {
          ...item,
          content: '怠速速度' + item.speed + '千米/小时,' + '持续时长' + item.speedTime + '分钟'
        };
      } else if (item.alarmTypeCode === 3) {
        return {
          ...item,
          content: (item.fence ? ('电子围栏:' + (item.fence.fenceName ? item.fence.fenceName : '')) : '')
            + (item.fenceAlarmType ? (item.fenceAlarmType === 1 ? ',报警内容: 进围栏' : (item.fenceAlarmType === 2 ? ',报警内容: 出围栏' :
              (item.fenceAlarmType === 3 ? ',报警内容: 进出围栏' : '')
            )
            ) : '')
        };
      } else if (item.alarmTypeCode === 4) {
        return {
          ...item,
          content: (item.line ? ('行车路线：' + item.line.lineName ) : '')
        };
      } else {
        return {
          ...item
        };
      }
    });
  }
  // 获取搜索信息——机构列表、报警类型
  getSearchInfo() {
    forkJoin([
      this.searchInfoService.getOrgList(),
      this.searchInfoService.getTypeList()])
      .subscribe((resData: any[]) => {
        this.sectionNode = this.initSectionNode(resData[0].value);
        this.defaultExpanded = this.sectionNode ? [this.sectionNode[0].key] : [];
        this.vehicleTypeNode = resData[1].value;
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
    const filter = {};
    forkJoin([this.searchInfoService.getDriveCricuitList(filter),
      this.searchInfoService.getFenceList(filter)])
      .subscribe((resData: any[]) => {
        this.lineNode = resData[0].value;
        this.fenceNode = resData[1].value;
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
      });
    this.vehicleScreenService.getOrgVehsTree(null).subscribe((resData: LocationServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'error');
        return;
      }
      this.vehicleNodes = this.initVehicleNode(resData.value);
      this.newVehicleNodes = this.getNewVehicleNodes(JSON.parse(JSON.stringify(this.vehicleNodes)));
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
  initVehicleNode(info) {
    return info.filter(item => {
      if (item.children && item.children.length > 0) {
        item.children = this.initVehicleNode(item.children);
      } else {
        item.isLeaf = true;
      }
      return item.veh || item.children;
    });
  }
  getNewVehicleNodes(vehicleNodes) {
    return vehicleNodes.filter(item => {
      if (item.children && item.children.length > 0) {
        item.children = this.getNewVehicleNodes(item.children);
      }
      return !item.veh;
    });
  }
  // 条件查询信息
  searchInfo () {
    this.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.getAlarmStrategyData();
  }
  // 重置搜索信息
  resetSearchInfo() {
    this.section = null;
    this.searchName = null;
    this.pageNum = 1;
    this.checkedId = {};
    this.isAllChecked = false;
    this.getAlarmStrategyData();
  }
  // 弹框中报警类型改变事件
  changeAlarmType(value) {
    this.showCondition = [false, false, false, false];
    this.showCondition[value - 1] = true;
    this.alarmInfo.fenceId = null;
    this.alarmInfo.lineId = null;
    this.alarmInfo.fenceAlarmType = null;
    this.alarmInfo.speed = '';
    this.alarmInfo.speedTime = '';
    this.alarmInfo.alarmTypeName = '';
    if (this.alarmInfo.alarmTypeCode === 3) {
      this.contentOptions = [
        {label: '进围栏', value: 1, checked: false, disabled: false},
        {label: '出围栏', value: 2, checked: false, disabled: false}
      ];
    }
  }
  // 新增弹框
  addInfo(): void {
    this.detailModal.title = '增加报警策略';
    this.showDetailModal();
    this.detailModal.showAdd = true;
    this.alarmInfo.vehicleIds = [];
  }
  // 编辑弹框
  editInfo(node): void {
    this.detailModal.title = '编辑报警策略' + '(' + node.configName + ')';
    this.showDetailModal();
    this.detailModal.showAdd = false;
    this.getAlarmStrategy(node.alarmConfigId);
    this.changeAlarmType(node.alarmTypeCode);
  }
  // 删除弹框
  delModal() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.alarmConfigId ]);
    if (!hasChecked) {
      this.message.create('error', `您还没有选择要删除的信息`);
      return;
    }
    this.modal.confirm({
      nzTitle: '您确定要删除选中的报警策略吗？',
      nzOnOk: () => {
        this.deleteAlarm();
      }
    });
  }
  showDetailModal(): void {
    this.alarmInfo = JSON.parse(JSON.stringify(this.resetInfo));
    this.showCondition = [false, false, false, false];
    this.detailModal.show1 = true;
    this.detailModal.errTxt = '';
    this.showVehicle = false;
    this.searchVehValue = null;
  }
  // 树选择异步加载获取数据
  nzEvent(event): void {
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        const result = this.getVehicleChild(node.key, this.vehicleNodes);
        if (result && result.children) {
          node.addChildren(result.children);
        } else {
          node.addChildren([]);
        }
      }
    }
  }
  getVehicleChild(key, info) {
    // const result = info.find(item => {
    //   if (item.key === key) {
    //     return true;
    //   }
    //   if (item.key !== key && item.children && item.children.length > 0 && !item.veh) {
    //     this.getVehicleChild(key, item.children);
    //   }
    // });
    for (let i = 0; i < info.length; i++) {
      const item = info[i];
      if (item.key === key) {
        return item;
      }
      if (item.key !== key && item.children && item.children.length > 0 && !item.children[0].veh) {
        const result = this.getVehicleChild(key, item.children);
        if (result && result !== '') {
          return result;
        }
      }
    }
  }
  // 表格全选
  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => (this.checkedId[item.alarmConfigId] = value));
  }

  // 表格单选选择
  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.every(item => this.checkedId[item.alarmConfigId]);
  }
  // 表格页码、页数改变时
  pageChange(reset: boolean = false): void {
    if (reset) {
      this.pageNum = 1;
    }
    this.checkedId = {};
    this.isAllChecked = false;
    this.getAlarmStrategyData();
  }
  // 查看报警信息
  lookAlarm(node): void {
    this.detailModal.title = '查看报警策略' + '(' + node.configName + ')';
    this.alarmInfo = JSON.parse(JSON.stringify(this.resetInfo));
    this.detailModal.show2 = true;
    this.showVehicle = false;
    this.searchVehValue = null;
    this.getAlarmStrategy(node.alarmConfigId);
    this.changeAlarmType(node.alarmTypeCode);
  }
  // 取消新增编辑弹框
  handleDetailCancel() {
    this.detailModal.show1 = false;
  }
  // 取消查看详情弹框
  handleLookDetailCancel() {
    this.detailModal.show2 = false;
  }
  // 保存弹框
  handleDetailSave() {
    if (!this.alarmInfo.configName || !this.alarmInfo.vehicleIds || !this.alarmInfo.alarmTypeCode
    || this.alarmInfo.vehicleIds.length === 0) {
      this.detailModal.errTxt = '您还有必填项没有完成！';
      return;
    }
    if (this.showCondition[0] || this.showCondition[1]) {
      if ((Number(this.alarmInfo.speed) !== 0 && !this.alarmInfo.speed) ||
        (Number(this.alarmInfo.speedTime) !== 0 && !this.alarmInfo.speedTime)) {
        this.detailModal.errTxt = '您还有必填项没有完成！';
        return;
      } else if (this.alarmInfo.speedTime.length > 20) {
        this.detailModal.errTxt = '持续时长已超出最大长度！';
        return;
      }
    }
    if (this.showCondition[0]) {
      if (this.alarmInfo.speed.length > 20) {
        this.detailModal.errTxt = '超速速度已超出最大长度！';
        return;
      }
    }
    if (this.showCondition[1]) {
      if (this.alarmInfo.speed.length > 20) {
        this.detailModal.errTxt = '怠速速度已超出最大长度！';
        return;
      }
    }
      if (this.alarmInfo.configName.length > 20) {
      this.detailModal.errTxt = '报警设置名称已超出最大长度！';
      return;
    }
    this.detailModal.errTxt = '';
    this.detailModal.loading = true;
   // const selectedNodes = this.nzTreeComponent.selectedNodes;
  //  this.alarmInfo.vehicleIds = [];
   // this.initSelectedNodes(selectedNodes);
    const filter = this.alarmInfo;
    if (this.showCondition[2]) {
      // if (this.contentOptions[0].checked && this.contentOptions[1].checked) {
      //   this.alarmInfo.fenceAlarmType = 3;
      // } else if (this.contentOptions[0].checked && !this.contentOptions[1].checked) {
      //   this.alarmInfo.fenceAlarmType = 1;
      // } else if (!this.contentOptions[0].checked && this.contentOptions[1].checked) {
      //   this.alarmInfo.fenceAlarmType = 2;
      // } else {
      //   this.alarmInfo.fenceAlarmType = null;
      // }
    }
    if (this.detailModal.showAdd) {
      this.addAlarm(filter);
    } else {
      this.editAlarm(filter);
    }
  }
  // 获取选择的车辆数据
  initSelectedNodes(info) {
    return info.forEach((item) => {
      if (item.origin.veh) {
        this.alarmInfo.vehicleIds.push(item.key);
      } else if (item.children.length > 0) {
        this.initSelectedNodes(item.children);
      }
    });
  }
  // 新增报警策略信息
  addAlarm(filter) {
    filter.createUserId = this.storage.getItem('userId');
    filter.createUserName = this.storage.getItem('userName');
    this.alarmStrategyService.add(filter).subscribe((resData: AlarmStrategyServiceNs.UfastHttpAnyResModel) => {
      this.detailModal.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.detailModal.show1 = false;
      this.getAlarmStrategyData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 编辑报警策略信息
  editAlarm(filter) {
    filter.modifyUserId = this.storage.getItem('userId');
    filter.modifyUserName = this.storage.getItem('userName');
    this.alarmStrategyService.edit(filter).subscribe((resData: AlarmStrategyServiceNs.UfastHttpAnyResModel) => {
      this.detailModal.loading = false;
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.messageService.showToastMessage('操作成功', 'success');
      this.detailModal.show1 = false;
      this.getAlarmStrategyData();
    }, (error: any) => {
      this.detailModal.loading = false;
      this.detailModal.show1 = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 删除报警策略信息
  deleteAlarm() {
    const filter = [];
    Object.keys(this.checkedId).forEach((i) => {
      if (this.checkedId[i]) {
        filter.push(i);
      }
    });
      this.alarmStrategyService.delete(filter).subscribe((resData: AlarmStrategyServiceNs.UfastHttpAnyResModel) => {
        if (resData.code !== 0) {
          this.messageService.showAlertMessage('', resData.message, 'warning');
          return;
        }
        this.messageService.showToastMessage('操作成功', 'success');
        this.checkedId = {};
        this.isAllChecked = false;
        this.getAlarmStrategyData();
      }, (error: any) => {
        this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 获取单个报警策略信息
  getAlarmStrategy(filter) {
    this.alarmStrategyService.getAlarmStrategy(filter).subscribe((resData: AlarmStrategyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.alarmInfo = resData.value;
      this.alarmInfo.selectVehicles = this.alarmInfo.vehicleIds.length;
      if (this.alarmInfo.alarmTypeCode === 4) {
        this.alarmInfo.lineName = resData.value.line.lineName;
      }
      if (!this.detailModal.showAdd) {
        if (this.alarmInfo.alarmTypeCode === 3) {
          this.contentOptions = [
            {label: '进围栏', value: 1, checked: false, disabled: false},
            {label: '出围栏', value: 2, checked: false, disabled: false}
          ];
          if (this.detailModal.show2) {
            this.contentOptions[0].disabled = true;
            this.contentOptions[1].disabled = true;
          }
          if (this.alarmInfo.fenceAlarmType === 3) {
            this.contentOptions[0].checked = true;
            this.contentOptions[1].checked = true;
          } else if (this.alarmInfo.fenceAlarmType) {
            const indexItem = this.contentOptions.findIndex(item => item.value === this.alarmInfo.fenceAlarmType);
            this.contentOptions[indexItem].checked = true;
          }
          if (this.alarmInfo.fenceId) {
            this.alarmInfo.fenceName = this.fenceNode.filter(node  => node.fenceId === this.alarmInfo.fenceId)[0].fenceName;
          }
        }
      }
    }, (error: any) => {
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
  // 弹框中选择车辆确认事件
  confirmVeh() {
    const selectedNodes = this.treeCom.getCheckedNodeList();
    this.alarmInfo.vehicleIds = [];
    this.initSelectedNodes(selectedNodes);
    this.alarmInfo.selectVehicles = this.alarmInfo.vehicleIds.length;
    this.showVehicle = false;
  }
  // 下发结果按钮事件
  resultInfo(node) {
    this.selAlarmStrategy = node;
    this.resultModal.title = '下发结果' + '(' + node.configName + ')';
    this.resultModal.loading = true;
    this.resultModal.show = true;
    this.section = null;
    this.vehicleType = null;
    this.searchVehicleNO = null;
    this.cmdSendState = null;
    this.getAlarmResult(node);
  }
  // 自动填充功能
  onInput(val: string) {
    const param = {vehicleLicense: val};
    this.searchInfoService.getVehicleList(param).subscribe((res) => {
      this.searchVehicleList = res.value;
    });
  }
  // 重置下发结果搜索条件
  resetResultInfo() {
    this.section = null;
    this.vehicleType = null;
    this.searchVehicleNO = null;
    this.cmdSendState = null;
    this.getAlarmResult(this.selAlarmStrategy);
  }
  // 获取报警策略下发结果
  getAlarmResult(node) {
    const filter = {
      pageNum: this.resultModal.pageNum,
      pageSize: this.resultModal.pageSize,
      filters: {
        alarmConfigId: node.alarmConfigId,
        orgId: this.section,
        vehicleTypeCode: this.vehicleType,
        vehicleLicense: this.searchVehicleNO,
        cmdSendState: this.cmdSendState
      }
    };
    this.resultModal.loading = true;
    this.alarmStrategyService.getResultDetail(filter).subscribe((resData: AlarmStrategyServiceNs.UfastHttpAnyResModel) => {
      if (resData.code !== 0) {
        this.resultModal.loading = false;
        this.messageService.showAlertMessage('', resData.message, 'warning');
        return;
      }
      this.resultTableData = resData.value.list;
      this.resultModal.pageNum = resData.value.pageNum;
      this.resultModal.pageTotal = resData.value.total;
      this.resultModal.loading = false;
    }, (error: any) => {
      this.resultModal.loading = false;
      this.messageService.showAlertMessage('', error.message, 'error');
    });
  }
}
