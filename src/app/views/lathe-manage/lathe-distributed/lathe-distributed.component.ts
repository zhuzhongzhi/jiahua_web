import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {IngotAlarmService} from '../../../core/biz-services/produceManage/IngotAlarmService';
import * as screenfull from 'screenfull';
import {ShowMessageService} from '../../../widget/show-message/show-message';

@Component({
  selector: 'app-lathe-distributed',
  templateUrl: './lathe-distributed.component.html',
  styleUrls: ['./lathe-distributed.component.scss']
})
export class LatheDistributedComponent implements OnInit {
  isCollapse = true;
  lineItems: any = []; // 线别列表
  batchList: any = []; // 批次列表
  tags = ''; // tags
  types = ''; // types
  typeMap = {};
  checked0 = false;
  checked1 = false;
  checked2 = false;
  checked3 = false;
  checked4 = false;
  checked5 = false;
  checked6 = false;
  checked9 = false;

  filters = {
    batchNum: '',
    lineType: '',
    code: ''
  };
  data: any = {};
  safeUrl = '/track/map/map2d/svg/sim/?anony=super&map=test_4&isHideBtn=1';

  detailModal = {
    show: false,
    loading: false,
    title: '',
    showContinue: false,
    showSaveBtn: false
  };

  constructor(private sanitizer: DomSanitizer,
              private messageService: ShowMessageService,
              private ingotAlarmService: IngotAlarmService) {
  }
  ngOnInit() {
    this.initData();
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        this.detailModal.show = screenfull.isFullscreen;
      });
    }
    this.createIframe();
  }

  createIframe() {
    const list = document.getElementById('jiahua-map');
    if (list.childNodes.length > 0) {
      list.removeChild(list.childNodes[0]);
    }
    const that = this;
    // @ts-ignore
    // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.safeUrl);
    const i = document.createElement('iframe');

    let url = this.safeUrl;
    if (this.tags !== '') {
      url = this.safeUrl + '&tags=' + this.tags;
    }
    if (this.types !== '') {
      url = this.safeUrl + '&types=' + this.types;
    }
    console.log(url);
    i.src = url;
    i.scrolling = 'no';
    i.name = 'map';
    i.id = 'jiahua';
    i.frameBorder = '1px';
    i.width = '100%';
    i.height = '100%';
    i.style.backgroundColor = 'transparent';
    document.getElementById('jiahua-map').appendChild(i);
    console.log('createIframe');
    // const doc = i.contentWindow.document;
    // doc.open().write('<body onload="location.href=\'' + this.safeUrl + '\'">');
    // doc.close();
    i.onload = function() {
      that.messageService.closeLoading();
    };
  }

  /**
   * 取消弹框
   */
  handleDetailCancel() {
    this.detailModal.show = false;
  }

  fullscreen() {
    // this.detailModal.showContinue = false;
    // this.detailModal.showSaveBtn = false;
    // this.detailModal.title = `丝车地图查看`;
    // this.detailModal.show = true;
    const element = document.getElementById('target');
    if (screenfull.isEnabled) {
      screenfull.request(element);
    }
  }

  closefullscreen() {
    const element = document.getElementById('target');
    if (screenfull.isEnabled) {
      screenfull.exit();
    }
  }

  // 查询丝车列表并重新构建iframe
  searchTagsInit() {
    this.initData();
    this.messageService.showLoading('地图加载中');
    if(this.filters.lineType==='请选择') this.filters.lineType='';
    if(this.filters.batchNum==='请选择') this.filters.batchNum='';
    const filter = {
      'filters': this.filters,
      'pageNum': 1,
      'pageSize': 1000
    };
    this.ingotAlarmService.getTagsList(filter).subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      let tags = '';
      res.value.list.forEach(item => {
        if (tags === '') {
          tags = item.tagId;
        } else {
          tags = tags + ',' + item.tagId;
        }
      });
      this.tags = tags;
      this.types ='';
      this.createIframe();
    });
  }

  public initData() {
    // init types
    this.ingotAlarmService.getTagTypes().subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      this.typeMap = res.value;
    });
    // init linetypes
    this.ingotAlarmService.getAllLineTypes().subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      let lineItems = res.value.sort() ;
      lineItems.splice(0,0,"请选择");
      this.lineItems = lineItems;   
      this.filters.lineType = "请选择";
    });
    this.ingotAlarmService.getAllBatchList().subscribe((res) => {
      if (res.code !== 0) {
        return;
      }
      let batchList = res.value.sort() ;
      batchList.splice(0,0,"请选择");
      this.batchList = batchList;   
      this.filters.batchNum = "请选择";
    });
    this.data.total=0;
    this.ingotAlarmService.wagonSummary(this.filters).subscribe(res => {
      res.value.forEach(item => {
        this.data.total += item.total;
        if (item.craftState === 0) {         
          this.data.exit = item.total;
        }
        if (item.craftState === 1) {
          this.data.doff = item.total;
        }
        if (item.craftState === 2) {
          this.data.danni = item.total;
        }
        if (item.craftState === 3) {
          this.data.sock = item.total;
        }
        if (item.craftState === 4) {
          this.data.check = item.total;
        }
        if (item.craftState === 5) {
          this.data.pack = item.total;
        }
        if (item.craftState === 6) {
          this.data.pack = item.total;
        }
      });
    });
  }

  changeSelect(status) {
    this.messageService.showLoading('地图加载中');
    switch (status) {
      case 9:
        this.checked9 = !this.checked9;
        break;
      case 0:
        this.checked0 = !this.checked0;
        break;
      case 1:
        this.checked1 = !this.checked1;
        break;
      case 2:
        this.checked2 = !this.checked2;
        break;
      case 3:
        this.checked3 = !this.checked3;
        break;
      case 4:
        this.checked4 = !this.checked4;
        break;
      case 5:
        this.checked5 = !this.checked5;
        break;
      case 6:
        this.checked6 = !this.checked6;
        break;
    }
    let types = '';
    if (this.checked0) {
      types =  "15,22,29";
    }
    if (this.checked1) {
      types =  "16,23,30";
    }
    if (this.checked2) {
      types =  "17,24,31";
    }
    if (this.checked3) {
      types = "18,25,32";
    }
    if (this.checked4) {
      types =  "19,26,33";
    }
    if (this.checked5) {
      types =  "20,27,34";
    }
    if (this.checked6) {
      types = "21,28,35";
    }
    if (this.checked9) {
      types = "";
    }
    this.types = types;
    this.tags ='';
    this.createIframe();
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  resetCond() {
    this.filters = {
      batchNum: '',
      lineType: '',
      code: ''
    };
    this.initData();
  }
}
