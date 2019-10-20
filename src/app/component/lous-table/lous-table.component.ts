import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-lous-table',
  templateUrl: './lous-table.component.html',
  styleUrls: ['./lous-table.component.scss']
})
export class LousTableComponent implements OnInit {

  @Input() dataList = [
    {
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
  ];

  constructor() {
    this.checkedAll = {
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
  }

  items1 = [
    {key: '', value: '请选择'},
    {key: 'B', value: '断毛(B)'},
    {key: 'R', value: '圈毛(R)'},
    {key: 'Q', value: '严重毛羽(Q)'},
    {key: 'BR', value: '断圈共存(BR)'},
  ];
  items2 = [
    {key: '', value: '请选择'},
    {key: '1', value: '机械碰伤'},
    {key: '2', value: '人为碰伤'},
  ];
  items3 = [
    {key: '', value: '请选择'},
    {key: '1', value: '凸肚(F1)'},
    {key: '2', value: '带状(F2)'},
    {key: '3', value: '脱圈'},
    {key: '4', value: '直绕(O)'},
  ];
  items4 = [
    {key: '', value: '请选择'},
    {key: '1', value: '第一落纱'},
    {key: '2', value: '红标签'},
    {key: '3', value: '黄标签'},
  ];
  items5 = [
    {key: '', value: '请选择'},
    {key: '1', value: 'GR绕丝'},
    {key: '2', value: 'GR交叉'},
    {key: '3', value: 'GR少绕'},
  ];
  items6 = [
    {key: '', value: '请选择'},
    {key: '1', value: '染色深(D)'},
    {key: '2', value: '染色浅(L)'},
    {key: '3', value: '条斑(S)'},
    {key: '4', value: '条纹(S)'},
  ];
  items7 = [
    {key: '', value: '请选择'},
    {key: '1', value: '丹尼异常'},
    {key: '2', value: '强伸低'},
    {key: '3', value: '强伸高'},
    {key: '4', value: '条干异常'},
    {key: '5', value: '主网络并丝'},
    {key: '6', value: '网络少'},
    {key: '7', value: '无网络'},
    {key: '8', value: '网络不均'},
  ];
  items8 = [
    {key: '', value: '请选择'},
    {key: '1', value: 'OPU低'},
    {key: '2', value: '单丝未进油咀'},
    {key: '3', value: '半束未进油咀'},
    {key: '4', value: '整束未进油咀'},
  ];
  items9 = [
    {key: '', value: '请选择'},
    {key: '1', value: '破纸管'},
    {key: '2', value: '组件压力波动'},
    {key: '3', value: '侧吹风异常'},
    {key: '4', value: '热媒异常'},
    {key: '5', value: '挤压机异常'},
  ];
  items10 = [
    {key: '', value: '请选择'},
    {key: '1', value: '是'},
    {key: '2', value: '否'},
  ];
  items11 = [
    {key: '', value: '请选择'},
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
    {key: '', value: '请选择'},
    {key: 'AA', value: 'AA级'},
    {key: 'AA纬', value: 'AA纬'},
    {key: 'A1', value: 'A1级'},
    {key: 'A', value: 'A级'},
    {key: 'B', value: 'B级'},
  ];

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

  ngOnInit() {

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
    console.log(this.dataList);
  }

}
