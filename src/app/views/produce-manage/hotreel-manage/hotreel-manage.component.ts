import { Component, OnInit, ViewChild } from '@angular/core';
import { ShowMessageService } from '../../../widget/show-message/show-message';
import { IngotAlarmService } from '../../../core/biz-services/produceManage/IngotAlarmService';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { format } from 'date-fns';
import { LineSpinService } from '../../../core/biz-services/lineSpinService/LineSpinService';
import { Router } from '@angular/router';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-hotreel-manage',
  templateUrl: './hotreel-manage.component.html',
  styleUrls: ['./hotreel-manage.component.scss']
})
export class HotreelManageComponent implements OnInit {
  showLoading = true;
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
  hasDoff = false;//是否落丝
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

  createTime: '';
  doffingStartTime: '';

  constructor(private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modal: NzModalService,
    public router: Router,
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
      doffingEmid: '',
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
      data: { ...this.listOfData[index] },
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
    this.initType();
    this.initList();
    this.validateForm = this.fb.group({
      bsId: [null],
      batchNum: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      threshold: [null, [Validators.required]]
    });
    this.messageService.closeLoading();
    setInterval(() => { this.initList(); }, 180000);
  }

  initType() {
    // init linetypes
    this.ingotAlarmService.getAllLineTypes().subscribe((res) => {
      if (res.code !== 0) {
        this.messageService.closeLoading();
        return;
      }
      this.lineItems = res.value.sort();
      this.ingotAlarmService.getAllBatchList().subscribe((res) => {
        if (res.code !== 0) {
          this.messageService.closeLoading();
          return;
        }
        this.batchList = res.value;
        if (this.batchList.length === 0) {
          this.hasBatchList = false;
        } else {
          this.hasBatchList = true;
        }
      });
    });

  }

  showPos(data) {
    this.showiFrame = 1;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.detailModal.title = '纺车位置查看';

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

  initList() {
    // 初始化丝车列表
    this.filters.createTime = this.parseTime(this.createTime);
    this.filters.doffingStartTime = this.parseTime(this.doffingStartTime);
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

    this.getProduce();
  }


  getProduce() {
    this.ingotAlarmService.boardOutputToday().subscribe((res) => {
      // 获取看板数据
      this.doffingWeight = 0;
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
    this.doffList = null;
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

  toggleTable(item) {
    item.showtable = !item.showtable;
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
    this.messageService.showLoading('');
    this.isAdd = true;
    this.detailModal.title = `新建`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.detailModal.show = true;
    this.submitModel = {
      createTime: new Date,
      reelType: '0',
      jointNum: '0'
    };

    this.showiFrame = 0;

    this.resetDataList();
    this.messageService.closeLoading();
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
    this.messageService.showLoading('表格创建中，请耐心等待！');
    if (item.pdId === undefined) {
      item.ingotNum = 6; // this.submitModel.ingotNum;
      if (item.ingotNum === undefined || item.ingotNum === null || item.ingotNum === '') {
        this.messageService.showToastMessage('请配置锭数次数', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (item.doffingTime === undefined || item.doffingTime === null || item.doffingTime === '') {
        this.messageService.showToastMessage('请配置落丝时间', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (item.weight === undefined || item.weight === null || item.weight === '') {
        this.messageService.showToastMessage('请配置净重', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (item.spinPos === undefined || item.spinPos === null || item.spinPos === '') {
        this.messageService.showToastMessage('请配置落丝纺位', 'warning');
        this.messageService.closeLoading();
        return;
      }
      const doffingTimeTemp = item.doffingTime;
      item.pmId = this.submitModel.pmId;
      item.doffingTime = this.parseTime(item.doffingTime);
      this.ingotAlarmService.addDoffing(item).subscribe(res => {
        item.pdId = res.value;
        item.doffingTime = doffingTimeTemp;
        this.doffList[i] = item;
        // 进行表格创建
        this.ingotAlarmService.getDoffingExceptions({ pdId: item.pdId }).subscribe((resData) => {
          this.doffList[i].showtable = true;
          this.doffList[i].hastable = true;
          this.doffList[i].exception = resData.value;
          this.messageService.closeLoading();
        });
      });
    }
  }

  deleteTable(pmId, pdId) {
    this.modal.confirm({
      nzTitle: `您确定要删除本次落丝吗？`,
      nzOnOk: () => {
        this.ingotAlarmService.delDoffing({ pmId: pmId, pdId: pdId }).subscribe((res) => {
          if (res.code === 0) {
            this.messageService.showToastMessage('记录已删除！', 'info');
            //重新加载
            this.ingotAlarmService.newCraftgetMain({ pmId: pmId }).subscribe((res) => {
              if (res.code === 0) {
                this.loadedit(res.value);
              }
              // this.listOfAllData.forEach(item => {
              //   if (item.pmId == pmId) {
              //     this.loadedit(item);
              //   }
            });
          }
        });
      }
    });
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

  saveProcess() {
    this.messageService.showLoading('');
    if (this.submitModel.lineType === undefined || this.submitModel.lineType === null || this.submitModel.lineType === '') {
      this.messageService.showToastMessage('请选择线别', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.code === undefined || this.submitModel.code === null || this.submitModel.code === '') {
      this.messageService.showToastMessage('请输入丝车编号', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.batchNum === undefined || this.submitModel.batchNum === null || this.submitModel.batchNum === '') {
      this.messageService.showToastMessage('请选择批次', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.standard === undefined || this.submitModel.standard === null || this.submitModel.standard === '') {
      this.messageService.showToastMessage('请输入规格', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.classType === undefined || this.submitModel.classType === null || this.submitModel.classType === '') {
      this.messageService.showToastMessage('请选择班别', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.classShift === undefined || this.submitModel.classShift === null || this.submitModel.classShift === '') {
      this.messageService.showToastMessage('请选择班次', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.createTime === undefined || this.submitModel.createTime === null || this.submitModel.createTime === '') {
      this.messageService.showToastMessage('请选择日期', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.reelType === undefined || this.submitModel.reelType === null || this.submitModel.reelType === '') {
      this.messageService.showToastMessage('请选择卷类别', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.jointNum === undefined || this.submitModel.jointNum === null || this.submitModel.jointNum === '') {
      this.messageService.showToastMessage('请选择合股次数', 'warning');
      this.messageService.closeLoading();
      return;
    }
    if (this.submitModel.cause === undefined || this.submitModel.cause === null || this.submitModel.cause === '') {
      // this.messageService.showToastMessage('请输入要因记录', 'warning');
      // this.messageService.closeLoading();
      // return;
      this.submitModel.cause = ' ';
      if (this.submitModel.doffingEmid === undefined || this.submitModel.doffingEmid === null || this.submitModel.doffingEmid === '') {
        this.messageService.showToastMessage('请输入记录落丝员工工号', 'warning');
        this.messageService.closeLoading();
        return false;
      }
    }
    if (this.isAdd) {
      this.ingotAlarmService.wagonisUsed({ code: this.submitModel.code }).subscribe((res) => {
        if (res.code === 1) {
          this.messageService.showToastMessage('丝车在使用中！', 'error');
          this.messageService.closeLoading();
          return;
        }
        else {
          this.submitModel.createTime = this.parseTime(this.submitModel.createTime);
          this.submitModel.craftState = 1;
          this.submitModel.isCopy = 0;
          this.submitModel.creator = localStorage.getItem('userId');
          this.ingotAlarmService.newCraftAdd(this.submitModel).subscribe((res) => {
            if (res.code !== 0) {
              this.messageService.showToastMessage(res.message + ':' + res.value, 'warning');
              this.messageService.closeLoading();
              return;
            }
            this.messageService.showToastMessage('主记录新建成功', 'success');
            this.messageService.closeLoading();
            this.submitModel.pmId = res.value;
            this.isAdd = false;
          });
        }
      });
    }
    else {
      this.messageService.showLoading('');
      const craftData = {
        pmId: this.submitModel.pmId,
        doffingEmid: this.submitModel.doffingEmid === null ? '' : this.submitModel.doffingEmid,
      };
      this.ingotAlarmService.newCraftUpdate(craftData).subscribe((resData) => {
        this.doffList.forEach(item => {
          if (item.pdId !== undefined) {
            // item.ingotNum = this.submitModel.ingotNum;
            item.ingotNum = 6;
            const doffingTimeTemp = item.doffingTime;
            item.doffingTime = this.parseTime(item.doffingTime);
            item.pmId = this.submitModel.pmId;
            this.ingotAlarmService.modifyDoffing(item).subscribe(res => {
              item.pdId = res.value;
              item.doffingTime = doffingTimeTemp;
              if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
                this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
                });
              }
            });
          }

        });
        this.messageService.showToastMessage('保存成功', 'success');
        this.messageService.closeLoading();
      });
    }
  }

  saveDoff() {
    this.saveProcess();
  }

  addDoff() {
    // 获取线别下所有纺位
    const data = { lineType: this.submitModel.lineType };
    this.ingotAlarmService.getSpinPosByLineType(data).subscribe((res) => {
      this.spinPosList = res.value.sort();
    });
    const craftData = {
      pmId: this.submitModel.pmId,
      doffingEmid: this.submitModel.doffingEmid === null ? '' : this.submitModel.doffingEmid,
    };
    this.ingotAlarmService.newCraftUpdate(craftData).subscribe((resData) => {
      this.doffList.forEach(item => {
        if (item.pdId !== undefined) {
          // item.ingotNum = this.submitModel.ingotNum;
          item.ingotNum = 6;
          const doffingTimeTemp = item.doffingTime;
          item.doffingTime = this.parseTime(item.doffingTime);
          item.pmId = this.submitModel.pmId;
          this.ingotAlarmService.modifyDoffing(item).subscribe(res => {
            item.pdId = res.value;
            item.doffingTime = doffingTimeTemp;
            if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
              this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
              });
            }
          });
        } else {
          // item.ingotNum = this.submitModel.ingotNum;
          if (item.doffingTime !== undefined && item.doffingTime !== null && item.doffingTime !== '' &&
            item.spinPos !== undefined && item.spinPos !== null && item.weight !== undefined && item.weight !== null &&
            item.spinPos !== '' && item.weight !== '') {
            item.ingotNum = 6;
            const doffingTimeTemp = item.doffingTime;
            item.doffingTime = this.parseTime(item.doffingTime);
            item.pmId = this.submitModel.pmId;
            this.ingotAlarmService.addDoffing(item).subscribe(res => {
              item.pdId = res.value;
              item.doffingTime = doffingTimeTemp;
              if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
                this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
                });
              }
            });
          }
        }
      });
    });
    this.doffList.push({ ingotNum: '', pmId: this.submitModel.pmId, doffingTime: new Date(), spinPos: '', weight: '' });
  }

  endDoff() {
    if (!this.saveProcess()) return;
    this.messageService.showLoading('');

    let canEnd = false;
    this.doffList.forEach(doff => {
      if (doff.pmId !== undefined) {
        canEnd = true;
      }
    })
    if (!canEnd) {
      this.messageService.showToastMessage('还没有落丝记录，请添加！', 'error');
      this.messageService.closeLoading();
      return;
    }
    for (let idx = 0; idx < this.doffList.length; idx++) {
      const item = this.doffList[idx];
      if (item.pdId !== undefined) {
        // item.ingotNum = this.submitModel.ingotNum;
        item.ingotNum = 6;
        const doffingTimeTemp = item.doffingTime;
        item.doffingTime = this.parseTime(item.doffingTime);
        item.pmId = this.submitModel.pmId;
        this.ingotAlarmService.modifyDoffing(item).subscribe(res => {
          item.pdId = res.value;
          item.doffingTime = doffingTimeTemp;
          if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
            this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
            });
          }
        });
      } else {
        if (item.doffingTime !== undefined && item.doffingTime !== null && item.doffingTime !== '' &&
          item.spinPos !== undefined && item.spinPos !== null && item.weight !== undefined && item.weight !== null &&
          item.spinPos !== '' && item.weight !== '') {
          // item.ingotNum = this.submitModel.ingotNum;
          item.ingotNum = 6;
          const doffingTimeTemp = item.doffingTime;
          item.doffingTime = this.parseTime(item.doffingTime);
          item.pmId = this.submitModel.pmId;
          this.ingotAlarmService.addDoffing(item).subscribe(res => {
            item.pdId = res.value;
            item.doffingTime = doffingTimeTemp;
            if (item.exception !== undefined && item.exception != null && item.exception.length > 0) {
              this.ingotAlarmService.modifyExceptions(item.exception).subscribe((res1) => {
              });
            } else {
              // 进行表格创建
              this.ingotAlarmService.getDoffingExceptions({ pdId: item.pdId }).subscribe((resData) => {
              });
            }
          });
        }
      }
      if (idx === this.doffList.length - 1) {
        this.enddoff();
      }
    }
  }
  enddoff() {
    const data = {
      pmId: this.submitModel.pmId,
      endTime: format(new Date(), 'yyyy-MM-dd HH:mm')
    };
    this.ingotAlarmService.endDoff(data).subscribe((res) => {
      if (res.code !== 0) {
        this.messageService.showToastMessage(res.message, 'error');
        this.messageService.closeLoading();
        return;
      }
      this.initList();
      this.checkedId = {};
      this.messageService.closeLoading();

      this.modalService.success({
        nzTitle: '<b>保存成功</b>',
        nzContent: '<i>落丝完成提交成功</i>',
        nzOnOk: () => {
          this.messageService.closeLoading();
          this.detailModal.show = false;
          this.initList();

        }
      });
    });
  }

  edit() {
    this.messageService.showLoading('');
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.pmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('请选择一条主记录', 'warning');
      this.messageService.closeLoading();
      return;
    }
    let data: any = {};
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
    if (i > 1) {
      if (this.listOfAllData.length !== 1) {
        this.messageService.showToastMessage('一次仅能修改一条记录', 'warning');
        this.messageService.closeLoading();
        return;
      }
    }
    this.loadedit(data);
  }

  loadedit(data) {
    this.showiFrame = 0;
    this.hasDoff = false;
    this.messageService.showLoading('加载中');
    const temp1 = { lineType: data.lineType };
    this.ingotAlarmService.getSpinPosByLineType(temp1).subscribe((res) => {
      this.spinPosList = res.value.sort();
      this.ingotAlarmService.getDoffings({ pmId: data.pmId }).subscribe((res) => {
        this.doffList = res.value;
        if (this.doffList !== null && this.doffList.length === 0) {
          this.hasDoff = true;
          this.doffList.push({ ingotNum: '', pmId: this.submitModel.pmId, doffingTime: new Date(), spinPos: '', weight: '' });
          this.isAdd = false;
          this.detailModal.title = `操作落丝记录`;
          this.detailModal.showContinue = true;
          this.detailModal.showSaveBtn = true;
          this.detailModal.show = true;
          this.submitModel = data;
          this.messageService.closeLoading();
        } else {
          for (let idx = 0; idx < this.doffList.length; idx++) {
            const item = this.doffList[idx];
            if (item.doffingTime !== undefined && item.doffingTime !== '' && item.doffingTime !== null) {
              item.doffingTime = new Date(item.doffingTime);
            }
            // 设置 exception
            this.ingotAlarmService.getDoffingExceptions({ pdId: item.pdId }).subscribe((res1) => {
              item.showtable = false;
              item.hastable = true;
              item.exception = res1.value;
              if (idx === 0) {
                this.isAdd = false;
                this.detailModal.title = `操作落丝记录`;
                this.detailModal.showContinue = true;
                this.detailModal.showSaveBtn = true;
                this.detailModal.show = true;
                this.submitModel = data;
                this.messageService.closeLoading();
              }
            });
          }
        }
      });
    });
  }

  transReelType(val) {
    if (val === 0) {
      return '满卷';
    } else if (val === 1) {
      return '小卷';
    }
    return '';
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
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.pmId]);
    if (!hasChecked) {
      this.messageService.showToastMessage('您还没有选择要删除的信息', 'warning');
      this.messageService.closeLoading();
      return;
    }
    this.modal.confirm({
      nzTitle: `您确定要删除选中的信息吗？`,
      nzOnOk: () => {
        const ids = [];
        this.tableConfig.loading = true;
        for (const key in this.checkedId) {
          if (this.checkedId[key]) {
            this.ingotAlarmService.getDoffings({ pmId: key }).subscribe((res) => {
              this.doffList = res.value;
              if (this.doffList !== null && this.doffList.length === 0) {
                this.messageService.showToastMessage('已有落丝记录不能删除！', 'error');
                this.messageService.closeLoading();
                return;
              }
              else {
                this.ingotAlarmService.newCraftDel({ pmId: key }).subscribe((res) => {
                  if (res.code === 0) {
                    this.messageService.showToastMessage('记录已删除！', 'info');
                    this.messageService.closeLoading();
                    this.initList();
                  }
                  else {
                    this.messageService.showToastMessage(res.value, 'error');
                    this.messageService.closeLoading();
                  }
                });
              }
            });
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
        return null;
      }
    } else {
      return null;
    }
  }

  submitForm() {
    if (this.showiFrame === 1) {
      this.detailModal.show = false;
    } else if (this.showiFrame === 0) {
      this.messageService.showLoading('');
      if (this.submitModel.lineType === undefined || this.submitModel.lineType === null || this.submitModel.lineType === '') {
        this.messageService.showToastMessage('请选择线别', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.code === undefined || this.submitModel.code === null || this.submitModel.code === '') {
        this.messageService.showToastMessage('请输入丝车编号', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.batchNum === undefined || this.submitModel.batchNum === null || this.submitModel.batchNum === '') {
        this.messageService.showToastMessage('请选择批次', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.standard === undefined || this.submitModel.standard === null || this.submitModel.standard === '') {
        this.messageService.showToastMessage('请输入规格', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.classType === undefined || this.submitModel.classType === null || this.submitModel.classType === '') {
        this.messageService.showToastMessage('请选择班别', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.classShift === undefined || this.submitModel.classShift === null || this.submitModel.classShift === '') {
        this.messageService.showToastMessage('请选择班次', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.createTime === undefined || this.submitModel.createTime === null || this.submitModel.createTime === '') {
        this.messageService.showToastMessage('请选择日期', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.reelType === undefined || this.submitModel.reelType === null || this.submitModel.reelType === '') {
        this.messageService.showToastMessage('请选择卷类别', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.jointNum === undefined || this.submitModel.jointNum === null || this.submitModel.jointNum === '') {
        this.messageService.showToastMessage('请选择合股次数', 'warning');
        this.messageService.closeLoading();
        return;
      }
      if (this.submitModel.cause === undefined || this.submitModel.cause === null || this.submitModel.cause === '') {
        // this.messageService.showToastMessage('请输入要因记录', 'warning');
        // this.messageService.closeLoading();
        // return;
        this.submitModel.cause = ' ';
      }
      if (this.isAdd) {
        if (this.submitModel.doffingEmid === undefined || this.submitModel.doffingEmid === null || this.submitModel.doffingEmid === '') {
          this.messageService.showToastMessage('请输入记录落丝员工工号', 'warning');
          this.messageService.closeLoading();
          return false;
        }
        this.ingotAlarmService.getWagonByCode({ code: this.submitModel.code }).subscribe((res) => {
          if (res.code === 0) {
            if (res.value.craftState !== 0) {
              this.messageService.showToastMessage('丝车在使用中！', 'error');
              this.messageService.closeLoading();
              this.submitModel.code = '';
              return;
            }
          }
        });
        this.submitModel.createTime = this.parseTime(this.submitModel.createTime);
        this.submitModel.craftState = 1;
        this.submitModel.isCopy = 0;
        this.submitModel.creator = localStorage.getItem('userId');
        this.ingotAlarmService.newCraftAdd(this.submitModel).subscribe((res) => {
          if (res.code !== 0) {
            this.messageService.showToastMessage(res.message + ':' + res.value, 'warning');
            this.messageService.closeLoading();
            return;
          }
          this.messageService.showToastMessage('主记录新建成功', 'success');
          this.detailModal.show = false;
          this.submitModel.pmId = res.value;
          this.isAdd = false;
        });
      }
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
    this.createTime = '';
    this.doffingStartTime = '';
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  transClassShift(classShift) {
    switch (classShift) {
      case 0:
        return '早';
      case 3:
        return '早+4';
      case 1:
        return '中';
      case 2:
        return '晚';
      case 4:
        return '晚+4';
    }
  }

  export() {
    this.ingotAlarmService.newCraftPage({ 'pageNum': 1, 'pageSize': 10000, 'filters': { craftState: '1' } }).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value.list) {
        const item: any = [];
        item.记录id = wagon.pmId;
        item.批号 = wagon.batchNum;
        item.要因记录 = wagon.cause;
        item.班别 = wagon.classType;
        item.班次 = this.transClassShift(wagon.classShift);
        item.丝车编码 = wagon.code;
        item.工艺状态 = this.trans(wagon.craftState);
        item.卷别 = this.transReelType(wagon.reelType);
        item.规格 = wagon.standard;
        item.锭数合股次数 = wagon.jointNum;
        item.线别 = wagon.lineType;
        item.净重 = wagon.weight;
        item.锭数 = wagon.ingotNum;
        item.生产时间 = wagon.createTime;
        item.创建人 = wagon.creator;
        item.落丝结束时间 = wagon.doffingEndTime;
        item.落丝操作员 = wagon.doffingOperator;
        item.落丝员工id = wagon.doffingEmid;
        item.落丝开始时间 = wagon.doffingStartTime;
        item.测丹尼操作员 = wagon.testDannyOperator;
        item.测丹尼员工id = wagon.testDannyEmid;
        item.测丹尼时间 = wagon.testDannyTime;
        item.摇袜操作员 = wagon.rockOperator;
        item.摇袜时间 = wagon.rockTime;
        item.摇袜员工id = wagon.rockEmid;
        item.判色员工id = wagon.colourEmid;
        item.判色操作员 = wagon.colourOperator;
        item.判色时间 = wagon.colourTime;
        item.检验操作员 = wagon.checkOperator;
        item.检验员工id = wagon.checkEmid;
        item.检验时间 = wagon.checkTime;
        item.包装操作员 = wagon.packageOperator;
        item.包装员工id = wagon.packageEmid;
        item.包装时间 = wagon.packageTime;
        arr.push(item);
      }
      this.exportList(arr);
    });
  }

  exportList(json) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, '落丝管理');
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xls');
  }

}
