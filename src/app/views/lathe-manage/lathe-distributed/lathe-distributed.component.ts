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

  filters = {
    batchNum: '',
    craftState: '',
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
    const that = this;
    // @ts-ignore
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.safeUrl);
    const i = document.createElement('iframe');
    i.src = this.safeUrl;
    i.scrolling = 'no';
    i.name = 'map';
    i.id = 'jiahua';
    i.frameBorder = '1px';
    i.width = '100%';
    i.height = '100%';
    i.style.backgroundColor = 'transparent';
    document.getElementById('jiahua-map').appendChild(i);

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

  public initData() {
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
    });
    this.ingotAlarmService.wagonSummary(this.filters).subscribe(res => {
      res.value.forEach(item => {
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
        if (item.craftState === 0) {
          this.data.check = item.total;
        }
        if (item.craftState === 0) {
          this.data.pack = item.total;
        }

      });
    });
  }

  changeSelect(status) {
    console.log(status);
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  resetCond() {
    this.filters = {
      batchNum: '',
      craftState: '',
      code: ''
    };
    this.initData();
  }
}
