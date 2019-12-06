import { Component, OnInit } from '@angular/core';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { IngotAlarmService } from '../../../core/biz-services/produceManage/IngotAlarmService';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { format } from "date-fns";
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-manage',
  templateUrl: './check-manage.component.html',
  styleUrls: ['./check-manage.component.scss']
})
export class CheckManageComponent implements OnInit {
  isCollapse = true;
  // table控件配置
  tableConfig: any;
  filters: any;
  listOfAllData = [];
  // 表格类
  isAllChecked = false;
  checkedId: { [key: string]: boolean } = {};
  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };
  // 落丝列表
  doffList: any = [];
  dataList = [];

  // 弹窗表单
  validateForm: FormGroup;
  updateData: any;
  // 是否新增
  isAdd = false;
  doffingWeight = 0;
  src: SafeResourceUrl = '';

  showiFrame = false;
  // 异常数组
  exceptions: any[] = [];
  submitModel: any = {};
  // 检验详情
  checkInfo: any = {};

  constructor(private fb: FormBuilder,
    private modal: NzModalService,
    private modalService: NzModalService,
    private sanitizer: DomSanitizer,
    public router: Router,
    private messageService: ShowMessageService,
    private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      code: '',
      lineType: '',
      batchNum: '',
      standard: '',
      createTime: '',
      checkOperator: '',
      checkTime: '',
      doffingStartTime: '',
      craftState: '5'
    };
    this.tableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      loading: false
    };
  }

  trans(state) {
    switch (state) {
      case 0:
        return '空闲';
      case 1:
        return '落丝';
      case 2:
        return '测丹尼';
      case 3:
        return '摇袜';
      case 4:
        return '判色';
      case 5:
        return '检验';
      case 6:
        return '包装';
    }
  }

  transReelType(val) {
    if (val === 0) {
      return '满卷';
    } else if (val === 1) {
      return '小卷';
    }
    return '';
  }

  saveProcess() {
    this.messageService.showLoading('');
    if (this.submitModel.checkEmid === undefined || this.submitModel.checkEmid === null || this.submitModel.checkEmid === '') {
      this.messageService.showToastMessage('请输入记录检查员工工号', 'warning');
      this.messageService.closeLoading();
      return false;
    }

    //保存主表
    const craftData = {
      pmId: this.submitModel.pmId,
      checkEmid: this.submitModel.checkEmid === null ? '' : this.submitModel.checkEmid,
    };
    this.ingotAlarmService.newCraftUpdate(craftData).subscribe((resData) => {//保存  
      const exceptions = [];
      this.doffList.map(item => exceptions.push(...item.exception));
      this.ingotAlarmService.modifyExceptions(exceptions).subscribe((res1) => {
        this.messageService.closeLoading();
      });         
    });

    return true;
  }


  saveCheck() {
    if (!this.saveProcess()) return;
    this.modalService.confirm({
      nzContent: '<i>保存成功是否要回到列表页</i>',
      nzTitle: '<b>保存成功</b>',
      nzOnOk: () => {
        this.detailModal.show = false;
        this.initList();
      },
      nzOnCancel: () => {
        this.messageService.closeLoading();
        this.ingotAlarmService.getCheckInfo(this.submitModel.pmId).subscribe((res) => {//获取 
          this.checkInfo = res.value;
        });
      }
    });

  }

  endCheck() {
    if (!this.saveProcess()) return;
    this.messageService.showLoading('');

    if (this.checkInfo.checkTime === '' || this.checkInfo.checkTime === undefined || this.checkInfo.checkTime === null) {
      this.messageService.showToastMessage('请配置检验时间', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.checkInfo.checkNum === '' || this.checkInfo.checkNum === undefined || this.checkInfo.checkNum === null) {
      this.messageService.showToastMessage('请配置检验个数', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.checkInfo.aaWeight === '' || this.checkInfo.aaWeight === undefined || this.checkInfo.aaWeight === null) {
      this.messageService.showToastMessage('请配置AA级重量', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.checkInfo.aawWeight === '' || this.checkInfo.aawWeight === undefined || this.checkInfo.aawWeight === null) {
      this.messageService.showToastMessage('请配置AA纬重量', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.checkInfo.a1Weight === '' || this.checkInfo.a1Weight === undefined || this.checkInfo.a1Weight === null) {
      this.messageService.showToastMessage('请配置A1级重量', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.checkInfo.aweight === '' || this.checkInfo.aweight === undefined || this.checkInfo.aweight === null) {
      this.messageService.showToastMessage('请配置A级重量', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.checkInfo.bweight === '' || this.checkInfo.bweight === undefined || this.checkInfo.bweight === null) {
      this.messageService.showToastMessage('请配置B级重量', 'warning');
      this.messageService.closeLoading();
      return;
    }
    // update
    if (this.checkInfo.pmId !== undefined && this.checkInfo.pmId !== '' && this.checkInfo.pmId !== null) {
      this.ingotAlarmService.modifyCheck(this.checkInfo).subscribe((res) => {
      });
    } else {
      this.ingotAlarmService.addCheck(this.checkInfo).subscribe((res) => {
      });
    }
    const data = {
      pmId: this.submitModel.pmId,
      endTime: format(new Date(), 'yyyy-MM-dd HH:mm')
    };
    this.ingotAlarmService.endCheck(data).subscribe((res) => {
      if (res.code !== 0) {
        this.messageService.closeLoading();
        return;
      }
      this.initList();
      this.messageService.closeLoading();
      this.checkedId = {};
      this.detailModal.show = false;
      this.modalService.success({
        nzTitle: '<b>保存成功</b>',
        nzContent: '<i>检验完成提交成功</i>',
        nzOnOk: () => {
          this.messageService.closeLoading();
          this.detailModal.show = false;
          this.initList();
        }
      });
    });
  }

  ngOnInit() {
    this.initList();
    this.validateForm = this.fb.group({
      opId: [null],
      ingotNum: [null, [Validators.required]],
      lineType: [null, [Validators.required]],
      spinPos: [null, [Validators.required]]
    });
    this.getProduce();
    this.messageService.closeLoading();
  }

  showPos(data) {
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.showiFrame = true;
    this.detailModal.title = `纺车位置查看`;
    this.ingotAlarmService.getWagonByCode({ code: data.code }).subscribe((res) => {
      if (res.code !== 0) {
        this.messageService.showToastMessage('接口请求异常！', 'error');
        return;
      }
      if (res.value === undefined || res.value === '' || res.value === null) {
        this.messageService.showToastMessage('没有检查到丝车信息！', 'error');
        return;
      }
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl('/track/map/map2d/svg/follow/?tag=' + res.value.tagId);
      this.detailModal.show = true;
    });
  }

  resetDataList() {
    this.dataList = [];

  }

  initList() {
    // 初始化丝车列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.newCraftPage(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      this.tableConfig.pageTotal = res.value.total;
      this.tableConfig.loading = false;
    });
  }

  getProduce() {
    this.ingotAlarmService.boardOutputToday().subscribe((res) => {
      // 获取看板数据
      this.doffingWeight =0;
      res.value.forEach(item => {
        this.doffingWeight += item.checkWeight ? item.checkWeight : 0;
      });

    });
  }

  pageChange() {
    this.checkedId = {};
    this.isAllChecked = false;
    this.initList();
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
    this.showiFrame = false;
    this.doffList = null;
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  add() {
    this.isAdd = true;
    this.detailModal.title = `新增线别纺位信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    this.validateForm.reset();
    this.detailModal.show = true;
  }


  edit() {
    this.messageService.showLoading('');
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.pmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('请选择一条主记录', 'warning');
      this.messageService.closeLoading();
      return;
    }
    let data;
    let i = 0;
    for (const key in this.checkedId) {
      if (this.checkedId[key]) {
        console.log(key);
        this.listOfAllData.forEach(item => {
          if (item.pmId == key) {
            data = item;
          }
        });
        i++;
      }
    }
    console.log(data);
    if (i > 1) {
      if (this.listOfAllData.length !== 1) {
        this.messageService.closeLoading();
        this.messageService.showToastMessage('一次仅能修改一条记录', 'warning');
        return;
      }
    }

    this.ingotAlarmService.getCheckInfo(data.pmId).subscribe((res) => {
        this.checkInfo = res.value;
    });
    this.ingotAlarmService.getDoffings({ pmId: data.pmId }).subscribe((res) => {
      this.doffList = res.value;
      for (let idx = 0; idx < this.doffList.length; idx++) {
        const item = this.doffList[idx];
        if (item.doffingTime !== undefined && item.doffingTime !== '' && item.doffingTime !== null) {
          item.doffingTime = new Date(item.doffingTime);
        }
        // 设置 exception
        this.ingotAlarmService.getDoffingExceptions({ pdId: item.pdId }).subscribe((res1) => {
          item.showtable = true;
          item.exception = res1.value;
          if (idx === this.doffList.length - 1) {
            this.isAdd = false;
            this.detailModal.title = `操作检验记录`;
            this.detailModal.showContinue = true;
            this.detailModal.showSaveBtn = true;
            this.detailModal.show = true;
            this.submitModel = data;
            this.messageService.closeLoading();
          }
        });
      }
    });
  }

  editInfo(data) {
    this.isAdd = false;
    this.detailModal.title = `修改线别纺位信息`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    this.updateData = data;
    this.validateForm.controls['opId'].setValue(data.opId);
    this.validateForm.controls['ingotNum'].setValue(data.ingotNum);
    this.validateForm.controls['lineType'].setValue(data.lineType);
    this.validateForm.controls['spinPos'].setValue(data.spinPos);
    this.detailModal.show = true;
  }

  delete() {
    // TODO
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.opId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要删除的信息', 'warning');
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要删除选中的信息吗？`,
      nzOnOk: () => {
        const ids = [];
        this.tableConfig.loading = true;

        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            ids.push(key);
          }
        }
      }
    });

  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => {
      if (item.pmId !== '-1') {
        this.checkedId[item.pmId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.pmId !== '-1').every(item => this.checkedId[item.pmId]);
  }

  parseTime(time) {
    if (time) {
      if (time instanceof Date) {
        return format(time, 'yyyy-MM-dd HH:mm');
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  submitForm() {
    if (this.showiFrame) {
      this.detailModal.show = false;
    } else {
      const wagonExceptions = [];
      // this.dataList1.forEach(el => {
      //   el.exSpinPos = this.submitModel.doffingSpinPos1;
      //   wagonExceptions.push(el);
      // });
      // this.dataList2.forEach(el => {
      //   el.exSpinPos = this.submitModel.doffingSpinPos2;
      //   wagonExceptions.push(el);
      // });
      // this.dataList3.forEach(el => {
      //   el.exSpinPos = this.submitModel.doffingSpinPos3;
      //   wagonExceptions.push(el);
      // });

      this.submitModel.produceTime = this.parseTime(this.submitModel.produceTime);
      this.submitModel.craftTime = this.parseTime(this.submitModel.craftTime);
      this.submitModel.craftState = 5;
      const dataInfo = { wagonOperate: {}, wagonExceptions: [] };
      dataInfo.wagonOperate = this.submitModel;
      let idx = 1;
      this.dataList.forEach(item => {
        item.exSpinPos = String(idx);
        idx++;
      });
      dataInfo.wagonExceptions = this.dataList;
      // this.submitModel.wagonExceptions = wagonExceptions;
      if (this.isAdd) {
        this.ingotAlarmService.craftAdd(dataInfo).subscribe((res) => {
          this.messageService.showToastMessage('测丹尼记录添加成功', 'success');
          this.detailModal.show = false;
          this.initList();
        });
      } else {
        this.ingotAlarmService.craftModify(dataInfo).subscribe((res) => {
          this.messageService.showToastMessage('测丹尼记录修改成功', 'success');
          this.detailModal.show = false;
          this.initList();
        });
      }

      console.log(this.submitModel);
    }

  }

  resetCond() {
    this.filters = {
      code: '',
      lineType: '',
      batchNum: '',
      standard: '',
      createTime: '',
      checkOperator: '',
      checkTime: '',
      doffingStartTime: '',
      craftState: '5'
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.newCraftPage({ 'pageNum': 1, 'pageSize': 10000, 'filters': { craftState: '5' } }).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        console.log(wagon);
        const item: any = [];
        item.记录id = wagon.pmId;
        item.批号 = wagon.batchNum;
        item.要因记录 = wagon.cause;
        item.班别 = wagon.classType;
        item.丝车编码 = wagon.code;
        item.工艺状态 = wagon.craftState;
        item.规格 = wagon.standard;
        item.锭数合股次数 = wagon.jointNum;
        item.线别 = wagon.lineType;
        item.净重 = wagon.weight;
        item.检验操作员 = wagon.checkOperator;
        item.检验时间 = wagon.checkTime;
        item.判色操作员 = wagon.colourOperator;
        item.判色时间 = wagon.colourTime;
        item.创建时间 = wagon.createTime;
        item.创建人 = wagon.creator;
        item.落丝结束时间 = wagon.doffingEndTime;
        item.落丝操作员 = wagon.doffingOperator;
        item.落丝开始时间 = wagon.doffingStartTime;
        item.包装操作员 = wagon.packageOperator;
        item.包装时间 = wagon.packageTime;
        item.卷别 = wagon.reelType;
        item.摇袜操作员 = wagon.rockOperator;
        item.摇袜时间 = wagon.rockTime;
        item.测丹尼操作员 = wagon.testDannyOperator;
        item.测丹尼时间 = wagon.testDannyTime;

        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, '测丹尼管理');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }
}
