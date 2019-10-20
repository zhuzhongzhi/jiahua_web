import {Component, OnInit, ViewChild} from '@angular/core';
import {ShowMessageService} from '../../../widget/show-message/show-message';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {LousTableComponent} from '../../../component/lous-table/lous-table.component';
import {format} from 'date-fns';

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

  dataList1 = [{
    exSpinPos: '',
    lousiness: '',
    lousinessLevel: '',
    bruise: '',
    bruiseLevel: '',
    outside: '',
    outsideLevel: '',
    badShape: '',
    badShapeLevel: '',
    crimp: '',
    crimpLevel: '',
    soiled: '',
    soiledLevel: '',
    yellow: '',
    yellowLevel: '',
    floatSilk: '',
    floatSilkLevel: '',
    wind: '',
    windLevel: '',
    dye: '',
    dyeLevel: '',
    property: '',
    propertyLevel: '',
    opu: '',
    opuLevel: '',
    other: '',
    otherLevel: ''
  },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },];
  dataList2 = [{
    exSpinPos: '',
    lousiness: '',
    lousinessLevel: '',
    bruise: '',
    bruiseLevel: '',
    outside: '',
    outsideLevel: '',
    badShape: '',
    badShapeLevel: '',
    crimp: '',
    crimpLevel: '',
    soiled: '',
    soiledLevel: '',
    yellow: '',
    yellowLevel: '',
    floatSilk: '',
    floatSilkLevel: '',
    wind: '',
    windLevel: '',
    dye: '',
    dyeLevel: '',
    property: '',
    propertyLevel: '',
    opu: '',
    opuLevel: '',
    other: '',
    otherLevel: ''
  },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },];
  dataList3 = [{
    exSpinPos: '',
    lousiness: '',
    lousinessLevel: '',
    bruise: '',
    bruiseLevel: '',
    outside: '',
    outsideLevel: '',
    badShape: '',
    badShapeLevel: '',
    crimp: '',
    crimpLevel: '',
    soiled: '',
    soiledLevel: '',
    yellow: '',
    yellowLevel: '',
    floatSilk: '',
    floatSilkLevel: '',
    wind: '',
    windLevel: '',
    dye: '',
    dyeLevel: '',
    property: '',
    propertyLevel: '',
    opu: '',
    opuLevel: '',
    other: '',
    otherLevel: ''
  },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
    {
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },];

  @ViewChild('lousTable')
  private lousTable: LousTableComponent;

  editCache: { [key: string]: any } = {};
  listOfData: any[] = [];
  // 弹窗表单
  validateForm: FormGroup;
  updateData: any;
  // 是否新增
  isAdd = false;
  doffingWeight = 0;
  src: SafeResourceUrl = '';
  showiFrame = false;

  submitModel: any = {};

  dataList: any = [];

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private modal: NzModalService,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
    this.filters = {
      code: '',
      lineType: '',
      batchNum: '',
      standard: '',
      spinPos: '',
      curCraftState: '',
      produceTime: '',
      operator: '',
      doffingTime1: '',
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
    this.dataList1 = [{
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },];
    this.dataList2 = [{
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },];
    this.dataList3 = [{
      exSpinPos: '',
      lousiness: '',
      lousinessLevel: '',
      bruise: '',
      bruiseLevel: '',
      outside: '',
      outsideLevel: '',
      badShape: '',
      badShapeLevel: '',
      crimp: '',
      crimpLevel: '',
      soiled: '',
      soiledLevel: '',
      yellow: '',
      yellowLevel: '',
      floatSilk: '',
      floatSilkLevel: '',
      wind: '',
      windLevel: '',
      dye: '',
      dyeLevel: '',
      property: '',
      propertyLevel: '',
      opu: '',
      opuLevel: '',
      other: '',
      otherLevel: ''
    },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },
      {
        exSpinPos: '',
        lousiness: '',
        lousinessLevel: '',
        bruise: '',
        bruiseLevel: '',
        outside: '',
        outsideLevel: '',
        badShape: '',
        badShapeLevel: '',
        crimp: '',
        crimpLevel: '',
        soiled: '',
        soiledLevel: '',
        yellow: '',
        yellowLevel: '',
        floatSilk: '',
        floatSilkLevel: '',
        wind: '',
        windLevel: '',
        dye: '',
        dyeLevel: '',
        property: '',
        propertyLevel: '',
        opu: '',
        opuLevel: '',
        other: '',
        otherLevel: ''
      },];
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {...item}
      };
    });
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
      opId: [null],
      ingotNum: [null, [Validators.required]],
      lineType: [null, [Validators.required]],
      spinPos: [null, [Validators.required]]
    });
    this.getProduce();
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        id: `${i}`,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
      });
    }
    this.updateEditCache();
  }

  showPos(data) {
    this.showiFrame = true;
    this.detailModal.showContinue = false;
    this.detailModal.showSaveBtn = false;
    this.detailModal.title = `纺车位置查看`;
    // his.src = this.sanitizer.bypassSecurityTrustResourceUrl('/track/map/map2d/svg/follow/?tag=' + data.tagId);
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl('/track/map/map2d/svg/follow/?tag=' + data.tagId);
    this.detailModal.show = true;
  }

  initList() {
    // 初始化丝车列表
    const filter = {
      'filters': this.filters,
      'pageNum': this.tableConfig.pageNum,
      'pageSize': this.tableConfig.pageSize
    };
    this.tableConfig.loading = true;
    this.ingotAlarmService.craftPage(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.listOfAllData = res.value.list;
      filter.pageNum = 0;
      filter.pageSize = 10000;

      this.ingotAlarmService.craftPage(filter).subscribe((result) => {
        this.tableConfig.pageTotal = result.value.total;
      });
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
    this.showiFrame = false;
  }


  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  add() {
    this.isAdd = true;
    this.detailModal.title = `新增落丝记录`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.detailModal.show = true;
    this.submitModel = {};
    this.resetDataList();
  }

  edit() {
    const hasChecked = this.listOfAllData.some(item => this.checkedId[item.opId]);
    if (!hasChecked) {
      this.isAdd = true;
      this.detailModal.title = `新增落丝记录`;
      this.detailModal.showContinue = true;
      this.detailModal.showSaveBtn = true;
      this.detailModal.show = true;
      this.submitModel = {};
      this.resetDataList();
      return;
    }
    let data;
    let i = 0;
    for (const key in this.checkedId) {
      if (this.checkedId[key]) {
        console.log(key);
        this.listOfAllData.forEach(item => {
          if (item.opId == key) {
            data = item;
          }
        });
        i++;
      }
    }
    console.log(data);
    if (i > 1) {
      this.messageService.showToastMessage('一次仅能修改一条记录', 'warning');
      return;
    }
    this.isAdd = false;
    this.detailModal.title = `修改落丝记录`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.detailModal.show = true;
    this.submitModel = data;

    this.ingotAlarmService.craftExeptionList(data.opId).subscribe(res => {
      const exceptions = res.value;
      if (exceptions === null || exceptions === undefined || exceptions === '') {
        this.resetDataList();
      } else {
        this.dataList1 = exceptions.slice(0, 6);
        this.dataList2 = exceptions.slice(6, 12);
        this.dataList3 = exceptions.slice(12, 18);
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
      if (item.opId !== '-1') {
        this.checkedId[item.opId] = value;
      }
    });
  }

  refreshStatus(): void {
    this.isAllChecked = this.listOfAllData.filter(item => item.opId !== '-1').every(item => this.checkedId[item.opId]);
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
    if (this.showiFrame) {
      this.detailModal.show = false;
    } else {
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
      spinPos: '',
      curCraftState: '',
      produceTime: '',
      operator: '',
      doffingTime1: '',
      craftState: '1'
    };
    this.initList();
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  export() {
    this.ingotAlarmService.craftPage({'pageNum': 1, 'pageSize': 10000, 'filters': {craftState: '1'}}).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      const arr = [];
      for (const wagon of res.value) {
        console.log(wagon);
        const item: any = [];
        item.id = wagon.opId;
        item.批号 = wagon.batchNum;
        item.要因记录 = wagon.cause;
        item.班别 = wagon.classType;
        item.丝车编码 = wagon.code;
        item.工艺状态 = wagon.craftState;
        item.丝车当前的工艺状态 = wagon.curCraftState;
        item.第一次落丝纺位 = wagon.doffingSpinPos1;
        item.第二次落丝纺位 = wagon.doffingSpinPos2;
        item.第三次落丝纺位 = wagon.doffingSpinPos3;
        item.落丝时间 = wagon.doffingTime;
        item.第一次落丝时间 = wagon.doffingTime1;
        item.第二次落丝时间 = wagon.doffingTime2;
        item.第三次落丝时间 = wagon.doffingTime3;
        item.锭数 = wagon.ingotNum;
        item.工号 = wagon.jobCode;
        item.锭数合股次数 = wagon.jointNum;
        item.线别 = wagon.lineType;
        item.操作员 = wagon.operator;
        item.生产日期 = wagon.produceTime;
        item.纺位 = wagon.spinPos;
        item.规格 = wagon.standard;
        item.丝车定位标签ID = wagon.tagId;
        item.净重 = wagon.weight;
        item.第一次落丝净重 = wagon.weight1;
        item.第二次落丝净重 = wagon.weight2;
        item.第三次落丝净重 = wagon.weight3;
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
