import {Component, Input, OnInit, ChangeDetectorRef, EventEmitter,Output, TemplateRef} from '@angular/core';
import { NzDropdownContextComponent, NzDropdownService } from 'ng-zorro-antd';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent implements OnInit {
 
  @Input() dataList = [];
  @Input() readonly = false;
  @Output() reloadStat = new EventEmitter();
  checkedAll: {
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
  };
  
  items1 = [
    {key: '', value: ''},
    {key: 'B', value: '断毛(B)'},
    {key: 'R', value: '圈毛(R)'},
    {key: 'Q', value: '严重毛羽(Q)'},
    {key: 'BR', value: '断圈共存(BR)'},
  ];
  items2 = [
    {key: '', value: ''},
    {key: '1', value: '机械碰伤'},
    {key: '2', value: '人为碰伤'},
  ];
  items3 = [
    {key: '', value: ''},
    {key: '1', value: '凸肚(F1)'},
    {key: '2', value: '带状(F2)'},
    {key: '3', value: '脱圈'},
    {key: '4', value: '直绕(O)'},
  ];
  items4 = [
    {key: '', value: ''},
    {key: '1', value: '第一落纱'},
    {key: '2', value: '红标签'},
    {key: '3', value: '黄标签'},
  ];
  items5 = [
    {key: '', value: ''},
    {key: '1', value: 'GR绕丝'},
    {key: '2', value: 'GR交叉'},
    {key: '3', value: 'GR少绕'},
    {key: '4', value: 'GR并丝'},
    {key: '5', value: 'GR多绕'},
  ];
  items6 = [
    {key: '', value: ''},
    {key: '1', value: '染色深(D)'},
    {key: '2', value: '染色浅(L)'},
    {key: '3', value: '条斑(S)'},
    {key: '4', value: '条纹(S)'},
  ];
  items7 = [
    {key: '', value: ''},
    {key: '1', value: '丹尼异常'},
    {key: '2', value: '强伸低'},
    {key: '3', value: '强伸高'},
    {key: '4', value: '条干异常'},
    {key: '5', value: '主网络并丝'},
    {key: '6', value: '网络少'},
    {key: '7', value: '无网络'},
    {key: '8', value: '网络不均'},
    {key: '9', value: '细丝1根'},
    {key: '10', value: '细丝2根'},
  ];
  items8 = [
    {key: '', value: ''},
    {key: '1', value: 'OPU低'},
    {key: '2', value: 'OPU高'},
    {key: '3', value: '单丝未进油咀'},
    {key: '4', value: '半束未进油咀'},
    {key: '5', value: '整束未进油咀'},
  ];
  items9 = [
    {key: '', value: ''},
    {key: '1', value: '破纸管'},
    {key: '2', value: '组件压力波动'},
    {key: '3', value: '侧吹风异常'},
    {key: '4', value: '热媒异常'},
    {key: '5', value: '挤压机异常'},
  ];
  items10 = [
    {key: '', value: ''},
    {key: '1', value: '是'},
    {key: '2', value: '否'},
  ];
  items11 = [
    {key: '', value: ''},
    {key: '1', value: '1根'},
    {key: '2', value: '2根'},
    {key: '3', value: '3根'},
    {key: '4', value: '4根'},
    {key: '5', value: '5根'},
    {key: '6', value: '6根'},
    {key: '7', value: '7根'},
    {key: '8', value: '8根'},
    {key: '9', value: '9根'},
    {key: '10', value: '10根'},
    {key: '11', value: '细丝1根'},
    {key: '12', value: '细丝2根'},
    {key: '13', value: '细丝3根'},
    {key: '14', value: '分错丝多1根'},
    {key: '15', value: '分错丝多2根'},
    {key: '16', value: '分错丝多3根'},
    {key: '17', value: '分错丝少1根'},
    {key: '18', value: '分错丝少2根'},
    {key: '19', value: '分错丝少3根'},
  ];
  items12 = [
    {key: '', value: ' '},
    {key: 'AA', value: 'AA级'},
    {key: 'AA纬', value: 'AA纬'},
    {key: 'A', value: 'A级'},
    {key: 'A1', value: 'A1级'},
    {key: 'B', value: 'B级'},
  ];
  items13 = [
    {key: '', value: ' '},
    {key: 'AA', value: 'AA级'},
    {key: 'AA纬', value: 'AA纬'},
    {key: 'A', value: 'A级'},
    {key: 'A1', value: 'A1级'},
    {key: 'B', value: 'B级'},
  ];



  widthConfig = ['60px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px',
    '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px', '50px',
    '50px', '50px', '50px', '50px', '50px', '50px', '50px', '1px'];
  scrollConfig = { x: '1280px' };

  // 修改的列
  editColumn = '';
  // 备注
  remark = '';
  // 数据
  data:any = {};
  // 弹框类
  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
  }

  ngAfterViewInit() { 
 //获取到nz-option组件中的li标签的DOM元素
      var deviceName = document.getElementsByClassName('ant-select-dropdown-menu-item ng-star-inserted');
      setTimeout(function () { 
        for (var i = 0; i < deviceName.length; i++) { 
        //拿到每个li元素之后添加title属性，将值展示
          deviceName[i].setAttribute('title',deviceName[i].textContent)
        }
      },3000)
   }

  selectchange()
  {
    this.reloadStat.emit();
  }

  constructor(public changeDetectorRef: ChangeDetectorRef, public dropdownService:NzDropdownService) {
    this.checkedAll = {
      lousiness: null,
      lousinessLevel: null,
      bruise: null,
      bruiseLevel: null,
      outside: null,
      outsideLevel: null,
      badShape: null,
      badShapeLevel: null,
      crimp: null,
      crimpLevel: null,
      soiled: null,
      soiledLevel: null,
      yellow: null,
      yellowLevel: null,
      floatSilk: null,
      floatSilkLevel: null,
      wind: null,
      windLevel: null,
      dye: null,
      dyeLevel: null,
      property: null,
      propertyLevel: null,
      opu: null,
      opuLevel: null,
      other: null,
      otherLevel: null
    };
  }
  menuitems:any;

  dropdown:NzDropdownContextComponent;

  contextMenu($event:MouseEvent,template:TemplateRef<void>,mitems,data,editColumn){   
    if(this.readonly) return;
    this.menuitems = mitems;
    this.data = data;
    this.editColumn = editColumn;
    this.dropdown=this.dropdownService.create($event,template);
    $event.preventDefault();
    return false;
  }

  transkey(key,showitems) {
      var name = '';
      showitems.forEach(function (v,i) {
          if (v.key==key) {
              name = v.value;
              console.log(i);
              return;
          }
      });
      return name;
  } 


  
  ngOnInit() {
  }

  submit() {
    switch(this.editColumn) {
      case 'lousiness':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.lousinessRemark = this.remark;
          }
        });
        break;
      case 'bruise':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.bruiseRemark = this.remark;
          }
        });
        break;
      case 'badShape':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.badShapeRemark = this.remark;
          }
        });
        break;
      case 'yellow':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.yellowRemark = this.remark;
          }
        });
        break;
      case 'outside':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.outsideRemark = this.remark;
          }
        });
        break;
      case 'crimp':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.crimpRemark = this.remark;
          }
        });
        break;
      case 'soiled':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.soiledRemark = this.remark;
          }
        });
        break;
      case 'floatSilk':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.floatSilkRemark = this.remark;
          }
        });
        break;
      case 'wind':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.windRemark = this.remark;
          }
        });
        break;
      case 'dye':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.dyeRemark = this.remark;
          }
        });
        break;
      case 'property':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.propertyRemark = this.remark;
          }
        });
        break;
      case 'opu':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.opuRemark = this.remark;
          }
        });
        break;
      case 'other':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.otherRemark = this.remark;
          }
        });
        break;
    }
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    this.detailModal.show = false;
  }

  doRemark(data, type) {
    this.detailModal.title = `异常备注`;
    this.detailModal.showContinue = true;
    this.detailModal.showSaveBtn = true;
    this.detailModal.show = true;
    switch (type) {
      case 'lousiness':
        this.remark = data.lousinessRemark;
        this.data = data;
        this.editColumn = 'lousiness';
        break;
      case 'bruise':
        this.remark = data.bruiseRemark;
        this.data = data;
        this.editColumn = 'bruise';
        break;
      case 'badShape':
        this.remark = data.badShapeRemark;
        this.data = data;
        this.editColumn = 'badShape';
        break;
      case 'yellow':
        this.remark = data.yellowRemark;
        this.data = data;
        this.editColumn = 'yellow';
        break;
      case 'outside':
        this.remark = data.outsideRemark;
        this.data = data;
        this.editColumn = 'outside';
        break;
      case 'crimp':
        this.remark = data.crimpRemark;
        this.data = data;
        this.editColumn = 'crimp';
        break;
      case 'soiled':
        this.remark = data.soiledRemark;
        this.data = data;
        this.editColumn = 'soiled';
        break;
      case 'floatSilk':
        this.remark = data.floatSilkRemark;
        this.data = data;
        this.editColumn = 'floatSilk';
        break;
      case 'wind':
        this.remark = data.windRemark;
        this.data = data;
        this.editColumn = 'wind';
        break;
      case 'dye':
        this.remark = data.dyeRemark;
        this.data = data;
        this.editColumn = 'dye';
        break;
      case 'property':
        this.remark = data.propertyRemark;
        this.data = data;
        this.editColumn = 'property';
        break;
      case 'opu':
        this.remark = data.opuRemark;
        this.data = data;
        this.editColumn = 'opu';
        break;
      case 'other':
        this.remark = data.otherRemark;
        this.data = data;
        this.editColumn = 'other';
        break;
    }
  }

  changeWithSelect(type) {
    console.log(this.dataList);
    switch (type) {
      case 'lousiness':
        this.dataList.forEach(ele => {
          ele.lousiness = this.checkedAll.lousiness;
        });
        break;
      case 'bruise':
        this.dataList.forEach(ele => {
          ele.bruise = this.checkedAll.bruise;
        });
        break;
      case 'badShape':
        this.dataList.forEach(ele => {
          ele.badShape = this.checkedAll.badShape;
        });
        break;
      case 'yellow':
        this.dataList.forEach(ele => {
          ele.yellow = this.checkedAll.yellow;
        });
        break;
      case 'lousinessLevel':
        this.dataList.forEach(ele => {
          ele.lousinessLevel = this.checkedAll.lousinessLevel;
        });
        break;
      case 'bruiseLevel':
        this.dataList.forEach(ele => {
          ele.bruiseLevel = this.checkedAll.bruiseLevel;
        });
        break;
      case 'outside':
        this.dataList.forEach(ele => {
          ele.outside = this.checkedAll.outside;
        });
        break;
      case 'outsideLevel':
        this.dataList.forEach(ele => {
          ele.outsideLevel = this.checkedAll.outsideLevel;
        });
        break;
      case 'badShapeLevel':
        this.dataList.forEach(ele => {
          ele.badShapeLevel = this.checkedAll.badShapeLevel;
        });
        break;
      case 'crimp':
        this.dataList.forEach(ele => {
          ele.crimp = this.checkedAll.crimp;
        });
        break;
      case 'crimpLevel':
        this.dataList.forEach(ele => {
          ele.crimpLevel = this.checkedAll.crimpLevel;
        });
        break;
      case 'soiled':
        this.dataList.forEach(ele => {
          ele.soiled = this.checkedAll.soiled;
        });
        break;
      case 'soiledLevel':
        this.dataList.forEach(ele => {
          ele.soiledLevel = this.checkedAll.soiledLevel;
        });
        break;
      case 'yellowLevel':
        this.dataList.forEach(ele => {
          ele.yellowLevel = this.checkedAll.yellowLevel;
        });
        break;
      case 'floatSilk':
        this.dataList.forEach(ele => {
          ele.floatSilk = this.checkedAll.floatSilk;
        });
        break;
      case 'floatSilkLevel':
        this.dataList.forEach(ele => {
          ele.floatSilkLevel = this.checkedAll.floatSilkLevel;
        });
        break;
      case 'wind':
        this.dataList.forEach(ele => {
          ele.wind = this.checkedAll.wind;
        });
        break;
      case 'windLevel':
        this.dataList.forEach(ele => {
          ele.windLevel = this.checkedAll.windLevel;
        });
        break;
      case 'dye':
        this.dataList.forEach(ele => {
          ele.dye = this.checkedAll.dye;
        });
        break;
      case 'dyeLevel':
        this.dataList.forEach(ele => {
          ele.dyeLevel = this.checkedAll.dyeLevel;
        });
        break;
      case 'property':
        this.dataList.forEach(ele => {
          ele.property = this.checkedAll.property;
        });
        break;
      case 'propertyLevel':
        this.dataList.forEach(ele => {
          ele.propertyLevel = this.checkedAll.propertyLevel;
        });
        break;
      case 'opu':
        this.dataList.forEach(ele => {
          ele.opu = this.checkedAll.opu;
        });
        break;
      case 'opuLevel':
        this.dataList.forEach(ele => {
          ele.opuLevel = this.checkedAll.opuLevel;
        });
        break;
      case 'other':
        this.dataList.forEach(ele => {
          ele.other = this.checkedAll.other;
        });
        break;
      case 'otherLevel':
        this.dataList.forEach(ele => {
          ele.otherLevel = this.checkedAll.otherLevel;
        });
        break;
      default:
        break;
    }
    this.reloadStat.emit();//提交数据
    console.log(this.dataList);
  }

  menuselect(key) {
    switch(this.editColumn) {
      case 'lousiness':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.lousiness =key;
          }
        });
        break;
        case 'lousinessLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.lousinessLevel =key;
            }
          });
          break;
      case 'bruise':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.bruise = key;
          }
        });
        break;
        case 'bruiseLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.bruiseLevel = key;
            }
          });
          break;
      case 'badShape':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.badShape = key;
          }
        });
        break;
        case 'badShapeLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.badShapeLevel = key;
            }
          });
          break;
      case 'yellow':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.yellow = key;
          }
        });
        break;
        case 'yellowLevel':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.yellowLevel = key;
          }
        });
        break;
      case 'outside':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.outside = key;
          }
        });
        break;
        case 'outsideLevel':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.outsideLevel = key;
          }
        });
        break;
      case 'crimp':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.crimp = key;
          }
        });
        break;
        case 'crimpLevel':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.crimpLevel = key;
          }
        });
        break;
      case 'soiled':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.soiled = key;
          }
        });
        break;
        case 'soiledLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.soiledLevel = key;
            }
          });
          break;
      case 'floatSilk':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.floatSilk = key;
          }
        });
        break;
        case 'floatSilkLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.floatSilkLevel = key;
            }
          });
          break;
      case 'wind':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.wind = key;
          }
        });
        break;
        case 'windLevel':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.windLevel = key;
          }
        });
        break;
      case 'dye':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.dye = key;
          }
        });
        break;
        case 'dyeLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.dyeLevel = key;
            }
          });
          break;
      case 'property':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.property = key;
          }
        });
        break;
        case 'propertyLevel':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.propertyLevel = key;
          }
        });
        break;
      case 'opu':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.opu = key;
          }
        });
        break;
        case 'opuLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.opuLevel = key;
            }
          });
          break;
      case 'other':
        this.dataList.forEach(ele => {
          if (this.data.pxId === ele.pxId) {
            ele.other = key;
          }
        });
        break;
        case 'otherLevel':
          this.dataList.forEach(ele => {
            if (this.data.pxId === ele.pxId) {
              ele.otherLevel = key;
            }
          });
          break;
    }
    this.reloadStat.emit();//提交数据
    this.dropdown.close();
  }

  getClass(data)
  {
    let levels = [];
    levels.push(data.lousinessLevel);
    levels.push(data.bruiseLevel);
    levels.push(data.outsideLevel);
    levels.push(data.badShapeLevel);
    levels.push(data.crimpLevel);
    levels.push(data.soiledLevel);
    levels.push(data.yellowLevel);
    levels.push(data.floatSilkLevel);
    levels.push(data.windLevel);
    levels.push(data.dyeLevel);
    levels.push(data.propertyLevel);
    levels.push(data.opuLevel);
    levels.push(data.otherLevel);

    let countaaw =0;
    let counta1 =0;
    let counta =0;
    let countb =0;

    levels.forEach(ele => {
      if(ele == 'AA纬') countaaw++;
      if(ele == 'A1') counta1++;
      if(ele == 'A') counta++;
      if(ele == 'B') countb++;
    });

    if(countb>0)      return "b";   
    if(counta1>0)      return "a1";
    if(counta>0)      return "a";
    if(countaaw>0)      return "aaw";
    return "aa";
   }
}
