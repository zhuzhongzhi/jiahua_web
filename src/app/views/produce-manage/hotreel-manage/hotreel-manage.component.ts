import {Component, OnInit, ViewChild} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {format} from 'date-fns';
import {LineSpinService} from '../../../core/biz-services/lineSpinService/LineSpinService';

@Component({
  selector: 'app-hotreel-manage',
  templateUrl: './hotreel-manage.component.html',
  styleUrls: ['./hotreel-manage.component.scss']
})
export class HotreelManageComponent implements OnInit {
  isCollapse = false;
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

  // 弹框类
  detailModal2 = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };

  dataList1 = [];
  dataList2 = [];
  dataList3 = [];

  editCache: { [key: string]: any } = {};
  listOfData: any[] = [];
  // 弹窗表单
  validateForm: FormGroup;
  updateData: any;
  // 是否新增
  isAdd = false;
  doffingWeight = 0;
  src: SafeResourceUrl = '';
  showiFrame = 0;

  submitModel: any = {};

  lineItems: any = []; // 线别列表
  batchList: any = []; // 批次列表
  hasBatchList: Boolean = true;

  dataList: any = [];

  listData: any[] = [];
  // 落丝异常
  doffExceptions: any = [];

  // 落丝列表
  doffList: any = [];
  // spinPos列表
  spinPosList: any = [];

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private modalService: NzModalService,
              private lineSpinService: LineSpinService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      code: '',
      lineType: '',
      batchNum: '',
      standard: '',
      createTime: '',
      doffingOperator: '',
      doffingStartTime: '',
      craftState: '1'
    };
    this.tableConfig = {
      showCheckBox: false,
      allChecked: false,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      loading: false
    };
    for (let i = 0; i < 100; i++) {
      this.listData.push({
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M'
      });
    }
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: {...this.listOfData[index]},
      edit: false
    };
  }

  resetDataList() {
    this.dataList1 = [];
    this.dataList2 = [];
    this.dataList3 = [];
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
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


  ngOnInit() {
    this.initList();
    this.validateForm = this.fb.group({
      bsId: [null],
      batchNum: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      threshold: [null, [Validators.required]]
    });
    this.getProduce();
  }

  showPos(data) {
    this.showiFrame = 1;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.detailModal.title = `纺车位置查看`;

    this.ingotAlarmService.getWagonByCode({code: data.code}).subscribe((res) => {
      if (res.code !== 0) {
        this.messageService.showToastMessage('接口请求异常！', 'error');
        return;
      }
      if (res.value !== undefined || res.value === '' || res.value === null) {
        this.messageService.showToastMessage('没有检查到丝车信息！', 'error');
        return;
      }
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl('/track/map/map2d/svg/follow/?tag=' + res.value.tagId);
      this.detailModal.show = true;
    });
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
      res.value.forEach(item => {
        this.doffingWeight += item.doffingWeight ? item.doffingWeight : 0;
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
    this.showiFrame = 0;
  }
  /**
   * 取消弹框
   */
  handleDetailCancel2() {
    this.detailModal2.show = false;
  }



  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  toAddBatch() {
    this.detailModal2.title = `新增批次规格信息`;
    this.detailModal2.showContinue = true;
    this.detailModal2.showSaveBtn = true;
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsPristine();
        controls[key].updateValueAndValidity();
      }
    }
    this.validateForm.reset();
    this.detailModal2.show = true;
  }

  add() {
    this.isAdd = true;
    this.detailModal.title = `新建`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.detailModal.show = true;
    this.submitModel = {
      reelType: '0',
      jointNum: '0'
    };

    this.showiFrame = 2;
    // init linetypes
    this.ingotAlarmService.getAllLineTypes().subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.lineItems = res.value;
    });
    this.ingotAlarmService.getAllBatchList().subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.batchList = res.value;
      if (this.batchList.length === 0) {
        this.hasBatchList = false;
      } else {
        this.hasBatchList = true;
      }
    });
    this.resetDataList();
  }

  refreshStandard(value) {
    const data = {
      'batchNum': value
    };
    this.ingotAlarmService.getStandardByBatch(data).subscribe((res) => {
      this.submitModel.standard = res.value[0];
    });
  }

  // 创建表格
  addTable(item, i) {
    if (item.pdId === undefined) {
      item.ingotNum =  6; // this.submitModel.ingotNum;
      if (item.ingotNum === undefined || item.ingotNum === null || item.ingotNum === '') {
        this.messageService.showToastMessage('请配置锭数次数', 'warning');
        return;
      }
      if (item.doffingTime === undefined || item.doffingTime === null || item.doffingTime === '') {
        this.messageService.showToastMessage('请配置落丝时间', 'warning');
        return;
      }
      if (item.weight === undefined || item.weight === null || item.weight === '') {
        this.messageService.showToastMessage('请配置净重', 'warning');
        return;
      }
      if (item.spinPos === undefined || item.spinPos === null || item.spinPos === '') {
        this.messageService.showToastMessage('请配置落丝纺位', 'warning');
        return;
      }
      const doffingTimeTemp = item.doffingTime;
      item.doffingTime = this.parseTime(item.doffingTime);
      this.ingotAlarmService.addDoffing(item).subscribe(res => {
        item.pdId = res.value;
        item.doffingTime = doffingTimeTemp;
        this.doffList[i] = item;
        // 进行表格创建
        this.ingotAlarmService.getDoffingExceptions({pdId: item.pdId}).subscribe((res) => {
          this.doffList[i].showtable = true;
          this.doffList[i].exception = res.value;
          console.log(this.doffList);
        });
      });
    } else {
      // 进行表格创建
      this.ingotAlarmService.getDoffingExceptions({pdId: item.pdId}).subscribe((res) => {
        this.doffList[i].showtable = true;
        this.doffList[i].exception = res.value;
        console.log(this.doffList);
      });
    }

  }

  submitForm2() {
    const controls = this.validateForm.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        controls[key].markAsDirty();
        controls[key].updateValueAndValidity();
      }
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.detailModal.loading = true;
    this.lineSpinService.addBatch(this.validateForm.value).subscribe((res) => {
      this.detailModal2.show = false;
      this.detailModal2.loading = false;
      this.ingotAlarmService.getAllBatchList().subscribe((res) => {
        if (res.code !== 0) {
          return;
        }
        this.batchList = res.value;
        if (this.batchList.length === 0) {
          this.hasBatchList = false;
        } else {
          this.hasBatchList = true;
        }
      });
      this.messageService.showToastMessage('新增成功', 'success');
    });
  }

  saveDoff() {
    this.doffList.forEach(item => {
      if (item.pdId !== undefined) {
        item.ingotNum = this.submitModel.ingotNum;
        const doffingTimeTemp = item.doffingTime;
        item.doffingTime = this.parseTime(item.doffingTime);
        this.ingotAlarmService.modifyDoffing(item).subscribe(res => {
          item.pdId = res.value;
          item.doffingTime = doffingTimeTemp;
          if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
            this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
            });
          }
        });
      } else {
        item.ingotNum = this.submitModel.ingotNum;
        const doffingTimeTemp = item.doffingTime;
        item.doffingTime = this.parseTime(item.doffingTime);
        this.ingotAlarmService.addDoffing(item).subscribe(res => {
          item.pdId = res.value;
          item.doffingTime = doffingTimeTemp;
          if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
            this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
            });
          }
        });
      }
    });
    this.modalService.confirm({
      nzTitle: '<i>保存成功是否要回到列表页</i>',
      nzContent: '<b>保存成功</b>',
      nzOnOk: () => {
        this.detailModal.show = false;
        this.initList();
      }
    });
  }

  addDoff() {
    // 获取线别下所有纺位
    const data = {lineType: this.submitModel.lineType};
    this.ingotAlarmService.getSpinPosByLineType(data).subscribe((res) => {
      this.spinPosList = res.value;
    });
    this.doffList.push({ingotNum: '', pmId: this.submitModel.pmId, doffingTime: '', spinPos: '', weight: ''});
  }

  endDoff() {
    if (this.doffList.length === 0) {
      this.messageService.showToastMessage('还没有落丝记录，请添加！', 'error');
      return;
    }
    const data = {
      pmId: this.submitModel.pmId,
      endTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    };
    this.ingotAlarmService.endDoff(data).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.messageService.showToastMessage('落丝完成提交成功', 'success');
      this.detailModal.show = false;
      this.initList();
    });
  }

  edit() {
    this.showiFrame = 0 ;
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.pmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('请选择一条主记录', 'warning');
      // this.isAdd = true;
      // this.detailModal.title = `新增落丝记录`;
      // this.detailModal.showContinue = true;
      // this.detailModal.showSaveBtn = true;
      // this.detailModal.show = true;
      // this.submitModel = {};
      // this.resetDataList();
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
        this.messageService.showToastMessage('一次仅能修改一条记录', 'warning');
        return;
      }

    }
    this.isAdd = false;
    this.detailModal.title = `操作落丝记录`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.detailModal.show = true;
    this.submitModel = data;

    // this.ingotAlarmService.craftExeptionList(data.pmId).subscribe(res => {
    //   const exceptions = res.value;
    //   if (exceptions === null || exceptions === undefined || exceptions === '' || exceptions.length === 0) {
    //     this.resetDataList();
    //   } else {
    //     this.dataList1 = exceptions.slice(0, 6);
    //     this.dataList2 = exceptions.slice(6, 12);
    //     this.dataList3 = exceptions.slice(12, 18);
    //   }
    // });
    const temp1 = {lineType: data.lineType};
    this.ingotAlarmService.getSpinPosByLineType(temp1).subscribe((res) => {
      this.spinPosList = res.value;
    });
    this.ingotAlarmService.getDoffings({pmId: data.pmId}).subscribe((res) => {
      this.doffList = res.value;
      this.doffList.forEach(item => {
        if (item.doffingTime !== undefined && item.doffingTime !== '' && item.doffingTime !== null) {
          item.doffingTime = new Date(item.doffingTime);
        }
        // 设置 exception
        this.ingotAlarmService.getDoffingExceptions({pdId: item.pdId}).subscribe((res1) => {
          item.showtable = true;
          item.exception = res1.value;
        });
      });
      if (this.doffList !== null && this.doffList.length > 0) {
        this.submitModel.ingotNum = this.doffList[0].ingotNum;
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
        return format(time, 'yyyy-MM-dd HH:mm:ss');
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  submitForm() {
    // const controls = this.validateForm.controls;
    // for (const key in controls) {
    //   if (controls.hasOwnProperty(key)) {
    //     controls[key].markAsDirty();
    //     controls[key].updateValueAndValidity();
    //   }
    // }
    // if (this.validateForm.invalid) {
    //   return;
    // }
    // this.detailModal.loading = true;
    if (this.showiFrame === 1) {
      this.detailModal.show = false;
    } else if (this.showiFrame === 2) {
      this.submitModel.createTime = this.parseTime(this.submitModel.createTime);
      this.submitModel.craftState = 1;
      this.submitModel.creator = localStorage.getItem('userId');
      console.log(this.submitModel);
      this.ingotAlarmService.newCraftAdd(this.submitModel).subscribe((res) => {
        if (res.code !== 0) {
          return;
        }
        this.messageService.showToastMessage('主记录新建成功', 'success');
        this.detailModal.show = false;
        this.initList();
      });
    } else if (this.showiFrame === 0) {
      const wagonExceptions = [];
      let idx = 1;
      this.dataList1.forEach(el => {
        el.exSpinPos = String(idx);
        idx++;
        wagonExceptions.push(el);
      });
      this.dataList2.forEach(el => {
        el.exSpinPos = String(idx);
        idx++;
        wagonExceptions.push(el);
      });
      this.dataList3.forEach(el => {
        el.exSpinPos = String(idx);
        idx++;
        wagonExceptions.push(el);
      });
      this.submitModel.produceTime = this.parseTime(this.submitModel.produceTime);
      this.submitModel.doffingTime1 = this.parseTime(this.submitModel.doffingTime1);
      this.submitModel.doffingTime2 = this.parseTime(this.submitModel.doffingTime2);
      this.submitModel.doffingTime3 = this.parseTime(this.submitModel.doffingTime3);
      this.submitModel.craftTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.submitModel.craftState = 1;
      const dataInfo = {wagonOperate: {}, wagonExceptions: []};
      dataInfo.wagonOperate = this.submitModel;
      dataInfo.wagonExceptions = wagonExceptions;
      // this.submitModel.wagonExceptions = wagonExceptions;

      if (this.isAdd) {
        this.ingotAlarmService.craftAdd(dataInfo).subscribe((res) => {
          this.messageService.showToastMessage('落丝记录添加成功', 'success');
          this.detailModal.show = false;
          this.initList();
        });
      } else {
        this.ingotAlarmService.craftModify(dataInfo).subscribe((res) => {
          this.messageService.showToastMessage('落丝记录修改成功', 'success');
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
      doffingOperator: '',
      doffingStartTime: '',
      craftState: '1'
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.newCraftPage({'pageNum': 1, 'pageSize': 10000, 'filters': {craftState: '1'}}).subscribe((res) => {
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
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, '落丝管理列表');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

}
